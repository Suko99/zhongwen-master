// Reconnaissance vocale du MOT prononcé — complète le Labo vocal, qui ne
// vérifiait jusqu'ici que le TON (forme du contour de hauteur), pas le mot
// lui-même. Utilise la Web Speech API (SpeechRecognition), la cousine
// gratuite de la synthèse vocale déjà utilisée pour la lecture audio :
// intégrée à Chrome/Edge, aucune installation, aucun coût.
//
// Limite honnête : reconnaître UN SEUL caractère isolé, sans contexte de
// phrase, est intrinsèquement ambigu pour un moteur de reconnaissance
// (妈/麻/马/骂 se ressemblent hors contexte) — signal complémentaire au
// scoring de ton, pas un verdict infaillible.

// L'API SpeechRecognition n'est pas standardisée (préfixe webkit-) et
// n'est donc pas dans les types DOM de TypeScript — déclaration minimale
// du sous-ensemble utilisé ici.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResultItem {
  0: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResultItem;
  length: number;
}
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type RecognizedWord = { transcript: string; confidence: number };

function getRecognitionCtor(): (new () => SpeechRecognitionInstance) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return !!getRecognitionCtor();
}

// `timeoutMs` est une limite de sécurité absolue (si rien n'est jamais dit).
//
// Note technique : deux approches plus "malines" ont été essayées et ont
// dégradé la fiabilité du micro dans Chrome (mode `continuous: true` moins
// précis ; puis redémarrages en rafale qui finissaient par ne plus capter
// de son du tout). On revient donc à une écoute simple en mode non-continu
// (le comportement natif le plus robuste), sans forcer l'arrêt au premier
// silence détecté (c'était ça qui coupait trop tôt) — on laisse le
// navigateur gérer lui-même sa tolérance de pause, ce qu'il fait déjà
// raisonnablement bien par défaut.
export function recognizeSpeech(
  timeoutMs = 10000,
  lang = "zh-CN"
): Promise<RecognizedWord | null> {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return Promise.resolve(null);

  return new Promise((resolve) => {
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false;
    const finish = (result: RecognizedWord | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        recognition.stop();
      } catch {
        // déjà arrêté — sans conséquence
      }
      resolve(result);
    };

    const timer = setTimeout(() => finish(null), timeoutMs);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0]?.[0];
      finish(result ? { transcript: result.transcript.trim(), confidence: result.confidence } : null);
    };
    recognition.onerror = () => finish(null);
    recognition.onend = () => finish(null);

    try {
      recognition.start();
    } catch {
      finish(null);
    }
  });
}
