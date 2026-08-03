// Synthèse vocale partagée — utilisée par SpeakButton (clic manuel) et par
// la Conversation IA (lecture automatique). Essaie d'abord une voix
// neuronale gratuite (service en ligne d'Edge, via un Server Action — voir
// src/lib/neuralTts.ts) pour un rendu naturel ; si l'appel échoue (réseau,
// service indisponible), repli automatique et silencieux sur la voix
// système du navigateur (Web Speech API), plus robotique mais toujours là.
import { synthesizeSpeechAction } from "@/app/tts-actions";

let cachedVoice: SpeechSynthesisVoice | null | undefined;

export function pickChineseVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    cachedVoice = null;
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => /zh[-_]CN/i.test(v.lang)) ??
    voices.find((v) => /^zh/i.test(v.lang)) ??
    null;
  return cachedVoice;
}

export function resetVoiceCache() {
  cachedVoice = undefined;
}

// La voix neuronale tourne côté serveur : elle ne dépend pas d'une voix
// installée localement, donc "supporté" est vrai dès que le JS tourne.
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined";
}

function speakWithBrowserVoice(
  text: string,
  handlers?: { onStart?: () => void; onEnd?: () => void }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    handlers?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickChineseVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "zh-CN";
  u.rate = 0.85; // légèrement ralenti pour l'apprentissage
  u.onstart = () => handlers?.onStart?.();
  u.onend = () => handlers?.onEnd?.();
  u.onerror = () => handlers?.onEnd?.();
  window.speechSynthesis.speak(u);
}

let currentAudio: HTMLAudioElement | null = null;

export async function speakText(
  text: string,
  handlers?: { onStart?: () => void; onEnd?: () => void },
  voice?: string
) {
  currentAudio?.pause();

  try {
    const result = await synthesizeSpeechAction(text, voice);
    if (result.ok) {
      const audio = new Audio(`data:audio/mpeg;base64,${result.audioBase64}`);
      currentAudio = audio;
      audio.onplay = () => handlers?.onStart?.();
      audio.onended = () => handlers?.onEnd?.();
      audio.onerror = () => speakWithBrowserVoice(text, handlers);
      await audio.play();
      return;
    }
  } catch {
    // réseau indisponible, service Edge en panne, etc. — repli ci-dessous.
  }
  speakWithBrowserVoice(text, handlers);
}
