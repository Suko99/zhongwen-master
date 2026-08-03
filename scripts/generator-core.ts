// Cœur du Générateur de leçons (rôle "Générateur" du PRD §6).
// Génère → valide → auto-corrige (renvoi des avertissements au modèle).
// Partagé par generate-lesson.ts (une leçon) et generate-all.ts (batch).
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { curriculum } from "../prisma/content/curriculum";
import type { LessonSeed } from "../prisma/content/types";

const ROOT = join(__dirname, "..");

export function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retry sur rate limit (429) et erreurs serveur (5xx), backoff exponentiel.
export async function callMistral(model: string, messages: Msg[]) {
  const maxRetries = 5;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      return data.choices[0].message.content;
    }

    const retriable = res.status === 429 || res.status >= 500;
    if (!retriable || attempt >= maxRetries) {
      throw new Error(`Mistral ${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    // Respecte Retry-After si présent, sinon backoff 2^n + jitter.
    const retryAfter = Number(res.headers.get("retry-after"));
    const wait = retryAfter
      ? retryAfter * 1000
      : Math.min(30000, 1000 * 2 ** attempt) + Math.random() * 500;
    await sleep(wait);
  }
}

const PROPER_NOUNS = "王明李华马克小明大卫安娜";

export function buildSystemPrompt(
  entry: (typeof curriculum)[number],
  knownWords: string[],
  knownHanzi: string[]
) {
  return `Tu es le Générateur de leçons de Zhongwen Master, une application d'apprentissage du mandarin pour UN(E) francophone.
Tu produis une leçon complète au format JSON strict (schéma ci-dessous), en français, avec le plus grand soin pédagogique.

CONTRAINTES ABSOLUES :
1. VOCABULAIRE FERMÉ : les dialogues et exemples n'utilisent QUE (a) les caractères déjà connus listés plus bas, (b) les nouveaux caractères que TU introduis dans "hanzi" (environ ${entry.targetNewHanzi}), (c) des noms propres parmi : ${PROPER_NOUNS}. AUCUN autre caractère chinois, nulle part.
2. Le champ "hanzi" contient UNIQUEMENT des caractères NOUVEAUX (jamais un caractère déjà connu).
3. ÉTYMOLOGIES PRUDENTES : jamais d'affirmation catégorique inventée. "l'interprétation traditionnelle veut que..." ou signale que l'origine est débattue. Donne le radical et la logique phono-sémantique quand elle existe.
4. TONS EXACTS : 1er ton = haut et plat ; 2e = montant ; 3e = descendant-montant ; 4e = descendant. Ne décris jamais un ton de travers.
5. INTERFÉRENCES FRANÇAISES : chaque point de grammaire signale l'erreur typique du francophone quand elle existe.
6. Respecte scrupuleusement la progression : n'emploie PAS de grammaire d'un niveau supérieur à celui de la leçon (ex : pas de 了, 把, 被 avant qu'ils ne soient au programme).
7. "reviewHanzi" = exactement les caractères de "hanzi". "reviewWords" = exactement les mots de "vocabulary". Chaque translation de dialogue est remplie (jamais vide).
8. Tout le contenu pédagogique est en FRANÇAIS ; le chinois en caractères simplifiés + pinyin avec tons ; 5 à 8 répliques de dialogue.

SCHÉMA JSON (toutes les clés obligatoires) :
{
  "slug": "${entry.slug}",
  "title": "${entry.title}",
  "mission": "${entry.mission}",
  "level": "${entry.level}",
  "order": ${entry.order},
  "hanzi": [{"character": "X", "pinyin": "...", "meaning": "...", "hskLevel": 1, "radical": "...", "components": ["..."], "etymology": "...", "family": ["..."], "commonErrors": ["..."]}],
  "vocabulary": [{"word": "...", "pinyin": "...", "meaning": "...", "exampleZh": "...", "examplePinyin": "...", "exampleFr": "..."}],
  "content": {
    "mission": {"scenario": "...", "goals": ["..."]},
    "discovery": {"instructions": "consigne d'observation AVANT traduction", "dialogue": [{"speaker": "A", "chinese": "...", "pinyin": "...", "translation": "..."}]},
    "deconstruction": {"hanzi": ["nouveaux caractères"], "grammar": [{"point": "...", "explanation": "...", "examples": [{"chinese": "...", "pinyin": "...", "translation": "..."}]}], "pronunciation": ["3 notes de tons"]},
    "connection": {"text": "liens aux acquis", "links": [{"from": "X", "relation": "COMPOSE|RADICAL_DE|DONNE_LE_SON|CONTRASTE_AVEC|SE_CONFOND_AVEC", "to": "Y"}]},
    "production": {"prompts": [{"instruction": "...", "hint": "...", "example": {"chinese": "...", "pinyin": "...", "translation": "..."}}]},
    "consolidation": {"summary": "...", "reviewWords": ["..."], "reviewHanzi": ["..."]}
  }
}

Points de grammaire à couvrir : ${entry.grammarFocus.join(" ; ")}
Thèmes : ${entry.themes.join(", ")}

CARACTÈRES DÉJÀ CONNUS (réutilisables librement, à NE PAS remettre dans "hanzi") :
${knownHanzi.join("")}

MOTS DÉJÀ CONNUS :
${knownWords.join("、")}`;
}

const CJK = /[一-鿿]/;

// Contrôles automatiques. `hard` = bloquant, `soft` = à corriger si possible.
export function validate(
  seed: LessonSeed,
  knownHanzi: Set<string>
): { hard: string[]; soft: string[] } {
  const hard: string[] = [];
  const soft: string[] = [];

  for (const key of ["slug", "title", "level", "order", "hanzi", "vocabulary", "content"] as const) {
    if (seed[key] === undefined || seed[key] === null) hard.push(`clé manquante : ${key}`);
  }
  if (hard.length) return { hard, soft };
  if (!seed.content.discovery?.dialogue || !seed.content.consolidation) {
    hard.push("structure content incomplète (discovery/consolidation)");
    return { hard, soft };
  }

  for (const h of seed.hanzi) {
    if (typeof h?.character !== "string" || h.character.length === 0) {
      hard.push(`fiche hanzi sans champ "character" valide : ${JSON.stringify(h).slice(0, 80)}`);
    }
  }
  if (hard.length) return { hard, soft };

  const newChars = new Set(seed.hanzi.map((h) => h.character));
  for (const h of seed.hanzi) {
    if ([...h.character].length !== 1) hard.push(`fiche hanzi non atomique : "${h.character}"`);
    if (knownHanzi.has(h.character)) soft.push(`caractère déjà connu re-présenté comme nouveau : ${h.character}`);
  }

  const allowed = (ch: string) =>
    !CJK.test(ch) || knownHanzi.has(ch) || newChars.has(ch) || PROPER_NOUNS.includes(ch);
  const scan = (label: string, text: string) => {
    const bad = [...new Set([...text].filter((ch) => !allowed(ch)))];
    if (bad.length) soft.push(`${label} : hors vocabulaire → ${bad.join(" ")}`);
  };

  for (const v of seed.vocabulary) {
    scan(`mot ${v.word}`, v.word);
    if (v.exampleZh) scan(`exemple de ${v.word}`, v.exampleZh);
  }
  for (const line of seed.content.discovery.dialogue) {
    scan(`dialogue "${line.chinese.slice(0, 10)}…"`, line.chinese);
    if (!line.translation?.trim()) soft.push(`traduction vide : "${line.chinese}"`);
  }
  for (const g of seed.content.deconstruction.grammar)
    for (const ex of g.examples ?? []) scan(`exemple grammaire`, ex.chinese);

  const vocabWords = new Set(seed.vocabulary.map((v) => v.word));
  for (const w of seed.content.consolidation.reviewWords)
    if (!vocabWords.has(w)) soft.push(`reviewWords hors vocabulaire : ${w}`);
  for (const c of seed.content.consolidation.reviewHanzi)
    if (!newChars.has(c)) soft.push(`reviewHanzi absent des fiches : ${c}`);

  return { hard, soft };
}

export type GenResult = {
  seed: LessonSeed;
  soft: string[];
  passes: number;
};

// Génère avec jusqu'à `maxCorrections` passes d'auto-correction.
export async function generateLesson(
  entry: (typeof curriculum)[number],
  knownWords: string[],
  knownHanzi: string[],
  models: string[],
  maxCorrections = 2
): Promise<GenResult> {
  const system = buildSystemPrompt(entry, knownWords, knownHanzi);
  const knownSet = new Set(knownHanzi);
  const userMsg = `Génère la leçon ${entry.order} (${entry.level}) : "${entry.title}". Mission : ${entry.mission}.`;

  const messages: Msg[] = [
    { role: "system", content: system },
    { role: "user", content: userMsg },
  ];

  let lastErr: Error | undefined;
  let seed: LessonSeed | undefined;
  let soft: string[] = [];
  let passes = 0;

  for (let attempt = 0; attempt <= maxCorrections; attempt++) {
    let raw: string | undefined;
    for (const model of models) {
      try {
        raw = await callMistral(model, messages);
        break;
      } catch (e) {
        lastErr = e as Error;
      }
    }
    if (!raw) throw lastErr ?? new Error("Aucun modèle n'a répondu.");

    passes++;
    let parsed: LessonSeed;
    try {
      parsed = JSON.parse(raw) as LessonSeed;
    } catch {
      messages.push({ role: "assistant", content: raw });
      messages.push({
        role: "user",
        content: "Ta réponse n'était pas un JSON valide. Renvoie UNIQUEMENT l'objet JSON complet, sans texte autour.",
      });
      continue;
    }

    const { hard, soft: softIssues } = validate(parsed, knownSet);
    seed = parsed;
    soft = softIssues;

    if (hard.length === 0 && softIssues.length === 0) return { seed, soft, passes };
    if (attempt === maxCorrections) break;

    const problems = [...hard, ...softIssues];
    messages.push({ role: "assistant", content: raw });
    messages.push({
      role: "user",
      content: `Ta leçon a ces problèmes à corriger IMPÉRATIVEMENT (respecte le vocabulaire fermé et le schéma) :\n${problems.map((p) => "- " + p).join("\n")}\n\nRenvoie la leçon COMPLÈTE corrigée en JSON. Remplace tout caractère hors vocabulaire par une reformulation n'utilisant que des caractères autorisés.`,
    });
  }

  if (!seed) throw lastErr ?? new Error("Génération impossible.");
  return { seed, soft, passes };
}
