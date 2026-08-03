import { prisma } from "./db";
import { getUser } from "./user";

// Un seul LLM, plusieurs rôles via des prompts système distincts (PRD §6).
// Fournisseur : Mistral AI (clé dans .env.local → MISTRAL_API_KEY).

const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-small-latest";

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      "Clé Mistral absente. Créez le fichier zhongwen-master/.env.local avec la ligne : MISTRAL_API_KEY=votre_clé (obtenue sur console.mistral.ai), puis relancez le serveur."
    );
    this.name = "MissingApiKeyError";
  }
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callMistralMessages(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new MissingApiKeyError();

  const res = await fetch(MISTRAL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL ?? DEFAULT_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur Mistral (${res.status}) : ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

async function callMistral(system: string, userMessage: string): Promise<string> {
  return callMistralMessages([
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ]);
}

// Contexte utilisateur injecté dans chaque prompt (PRD §6) : niveau réel
// et vocabulaire déjà acquis, pour ancrer chaque réponse dans le connu.
async function buildLearnerContext() {
  const user = await getUser();
  const progress = await prisma.userProgress.findMany({
    where: { userId: user.id, nodeType: { in: ["WORD", "HANZI"] } },
    include: { vocab: true, hanzi: true },
  });
  const knownWords = progress
    .map((p) => p.vocab?.word ?? p.hanzi?.character)
    .filter(Boolean) as string[];
  return { user, knownWords };
}

const SHARED_RULES = `
Règles impératives :
1. Tu n'expliques jamais un mot sans expliquer sa logique (origine, structure, contexte).
2. Tu compares systématiquement à la logique française quand c'est pertinent pour éviter les erreurs de transfert.
3. Tu adaptes ton vocabulaire d'explication au niveau réel de l'utilisateur.
4. Quand c'est possible, tu relies ta réponse au vocabulaire déjà acquis (fourni ci-dessous).
5. Tu n'inventes JAMAIS une étymologie : en cas de doute, écris "l'interprétation traditionnelle veut que..." ou dis que l'origine est débattue.
6. Tu cites le niveau HSK d'un mot avant de l'introduire s'il est hors du vocabulaire acquis.
7. Tu réponds STRICTEMENT au format JSON demandé, sans texte autour.`;

export type ProfessorAnswer = {
  concept: string;
  explanation: { simple: string; deep: string };
  examples: { chinese: string; pinyin: string; translation: string }[];
  common_errors: string[];
  related_known: string[];
};

export async function askProfessor(question: string): Promise<ProfessorAnswer> {
  const { user, knownWords } = await buildLearnerContext();
  const system = `Tu es le professeur de mandarin de Zhongwen Master.
Tu enseignes à un(e) francophone de niveau ${user.level}.
${SHARED_RULES}

Vocabulaire déjà acquis par l'utilisateur : ${knownWords.join("、") || "(aucun pour l'instant)"}

Format JSON de réponse (toutes les clés sont obligatoires) :
{
  "concept": "le concept traité, en quelques mots",
  "explanation": {
    "simple": "explication en 1-2 phrases accessibles",
    "deep": "explication approfondie : logique, origine, culture"
  },
  "examples": [{"chinese": "...", "pinyin": "...", "translation": "..."}],
  "common_errors": ["erreur fréquente des francophones sur ce point"],
  "related_known": ["mots du vocabulaire acquis en lien avec la réponse"]
}`;

  const raw = await callMistral(system, question);
  return JSON.parse(raw) as ProfessorAnswer;
}

export type CorrectionResult = {
  score: number;
  verdict: string;
  corrected: string;
  corrected_pinyin: string;
  errors: { quote: string; explanation: string; type: string }[];
  naturalness_tip: string;
};

export async function correctProduction(
  instruction: string,
  attempt: string
): Promise<CorrectionResult> {
  const { user, knownWords } = await buildLearnerContext();
  const system = `Tu es le correcteur de Zhongwen Master.
Tu corriges la production écrite d'un(e) francophone de niveau ${user.level}.
Tu cherches en particulier les interférences du français (ordre des mots, 是 parasite, 也 mal placé, oubli de classificateur, 不/没 confondus).
${SHARED_RULES}

Vocabulaire déjà acquis par l'utilisateur : ${knownWords.join("、") || "(aucun pour l'instant)"}

Format JSON de réponse (toutes les clés sont obligatoires) :
{
  "score": 0-100,
  "verdict": "une phrase d'appréciation honnête et encourageante",
  "corrected": "la phrase corrigée en caractères (identique si déjà correcte)",
  "corrected_pinyin": "le pinyin de la phrase corrigée",
  "errors": [{"quote": "le fragment fautif", "explanation": "pourquoi c'est faux et la logique chinoise", "type": "grammaire|vocabulaire|interférence_français|classificateur|autre"}],
  "naturalness_tip": "un conseil pour rendre la phrase plus naturelle (ou féliciter si elle l'est)"
}`;

  const userMessage = `Consigne de l'exercice : ${instruction}
Production de l'utilisateur : ${attempt}`;

  const raw = await callMistral(system, userMessage);
  const result = JSON.parse(raw) as CorrectionResult;
  result.score = Math.max(0, Math.min(100, Math.round(result.score)));
  return result;
}

// Rôle Générateur/Segmenteur (PRD §6, §10 Smart Reader) : découpe un texte
// chinois en mots pour l'affichage assisté — traduction au survol des mots
// inconnus, texte connu laissé intact.
export type ReaderToken = { text: string; pinyin: string; meaning: string };

const MAX_READER_TEXT = 700;

export async function segmentText(text: string): Promise<ReaderToken[]> {
  const system = `Tu es le Segmenteur de Zhongwen Master. Tu découpes un texte chinois en unités lexicales pour un lecteur assisté qui traduit les mots au survol.

Règles impératives :
1. Découpe le texte en jetons : chaque mot chinois (1 à 4 caractères, l'unité de sens naturelle : 学生, 火车站, 虽然...) est un jeton séparé ; chaque ponctuation ou espace est aussi un jeton séparé à part entière.
2. RÈGLE ABSOLUE : la concaténation exacte de tous les champs "text", dans l'ordre, DOIT reconstituer le texte fourni caractère pour caractère. N'ajoute, ne supprime, ne reformule, ne réordonne RIEN — tu segmentes, tu ne réécris pas.
3. Pour chaque mot chinois, donne son pinyin avec tons et sa traduction française la plus naturelle DANS CE CONTEXTE précis (pas seulement le sens isolé du mot).
4. Pour la ponctuation, les espaces ou tout texte non chinois, laisse "pinyin" et "meaning" en chaîne vide "".

Format JSON (un seul objet, une seule clé) :
{"tokens": [{"text": "...", "pinyin": "...", "meaning": "..."}, ...]}`;

  const original = text.slice(0, MAX_READER_TEXT);

  // La sortie d'un LLM n'est pas parfaitement déterministe : il arrive
  // (rarement) qu'une reformulation mineure casse la reconstruction exacte.
  // On retente avant d'abandonner plutôt que de faire échouer l'utilisateur.
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await callMistral(system, original);
    const parsed = JSON.parse(raw) as { tokens: ReaderToken[] };
    const tokens = parsed.tokens;
    const reconstructed = tokens.map((t) => t.text).join("");

    if (reconstructed.replace(/\s+/g, "") === original.replace(/\s+/g, "")) {
      return tokens;
    }
    lastError = new Error(
      "La segmentation IA a modifié le texte au lieu de le découper — réessayez."
    );
  }
  throw lastError;
}

// Rôle Conversation (PRD §9, écran "Conversation IA") : dialogue oral/écrit
// naturel, pas un cours — corrige en passant, sans jamais interrompre le fil.
export type ConversationTurn = { role: "user" | "assistant"; content: string };
export type ConversationReply = {
  reply: string;
  pinyin: string;
  translation: string;
  correction: string | null;
};

const MAX_CONVERSATION_TURN = 300;
const MAX_HISTORY_TURNS = 12; // ~6 échanges de contexte, suffisant et borné en coût

export async function converse(
  history: ConversationTurn[],
  userMessage: string
): Promise<ConversationReply> {
  const { user, knownWords } = await buildLearnerContext();
  const system = `Tu es 小龙 (Xiǎo Lóng), 22 ans, étudiant à Pékin, curieux et un peu taquin. Tu es le partenaire de conversation de Zhongwen Master — un(e) ami(e) chinois(e) avec qui l'utilisateur discute, PAS un professeur qui fait cours.
Tu discutes avec un(e) francophone de niveau ${user.level}.

Règles impératives :
1. Réponds en chinois courant, à un rythme conversationnel : 1 à 3 phrases courtes, jamais un pavé. Tu as une vraie personnalité (curiosité, humour léger, réactions spontanées) — tu n'es pas neutre.
2. Reste ancré dans le vocabulaire déjà acquis autant que possible (fourni ci-dessous) ; si tu introduis un mot nouveau, choisis-le simple et utile, il sera traduit automatiquement.
3. Ne complique jamais artificiellement : adapte-toi vraiment au niveau ${user.level}, y compris à l'oral (contractions naturelles, tournures courantes).
4. Si l'utilisateur fait une erreur de grammaire ou de vocabulaire, note-la brièvement dans "correction" (une phrase, ton bienveillant) SANS l'intégrer dans "reply" — la conversation continue normalement, la correction est un aparté. Si rien à corriger, "correction" est null.
5. Relance la conversation avec une question ou une réaction, comme un vrai échange — jamais une réponse qui clôt le sujet. Réagis vraiment à ce que dit l'utilisateur (surprise, intérêt, désaccord amical) plutôt que d'enchaîner une question neutre.
6. Ne te présente pas comme "小龙" à chaque message — seulement si on te le demande ou en tout début de conversation.
7. Message de l'utilisateur en français, mélangé français-chinois, ou visiblement incomplet (mot manquant, transcription vocale hésitante) : tu comprends TOUJOURS l'intention derrière, tu ne bloques jamais dessus. Utilise "correction" pour donner la bonne façon de le dire en chinois (ex. "On dirait plutôt : ..."), et continue "reply" normalement en chinois comme si l'échange n'avait pas été interrompu.
8. Tu as une vraie mémoire : l'historique fourni couvre aussi les sessions précédentes. Réfère-toi naturellement à ce que l'utilisateur t'a dit avant (son prénom, ses goûts, ce qu'il a raconté) quand c'est pertinent, comme un ami qui se souvient.
9. Tu réponds STRICTEMENT au format JSON demandé, sans texte autour.

Vocabulaire déjà acquis par l'utilisateur : ${knownWords.join("、") || "(aucun pour l'instant)"}

Format JSON de réponse (toutes les clés obligatoires) :
{
  "reply": "ta réponse en chinois, naturelle et courte",
  "pinyin": "le pinyin avec tons de ta réponse",
  "translation": "traduction française de ta réponse",
  "correction": "remarque brève et bienveillante sur une erreur du dernier message de l'utilisateur, ou null"
}`;

  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS);
  const messages: ChatMessage[] = [
    { role: "system", content: system },
    ...trimmedHistory.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: userMessage.slice(0, MAX_CONVERSATION_TURN) },
  ];

  const raw = await callMistralMessages(messages);
  return JSON.parse(raw) as ConversationReply;
}
