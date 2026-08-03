// Génère TOUTES les leçons manquantes du curriculum (auto-correction incluse).
// Chaque leçon générée devient contexte de la suivante (vocabulaire cumulatif).
// Usage : npx tsx scripts/generate-all.ts [ordreDebut] [ordreFin]
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { curriculum } from "../prisma/content/curriculum";
import { authoredLessons } from "../prisma/content";
import type { LessonSeed } from "../prisma/content/types";
import { loadEnvLocal, generateLesson } from "./generator-core";

const GENERATED_DIR = join(__dirname, "..", "prisma", "content", "generated");

const models = [
  process.env.MISTRAL_GEN_MODEL ?? "mistral-large-latest",
  "mistral-small-latest",
];

async function main() {
  loadEnvLocal();
  if (!process.env.MISTRAL_API_KEY) {
    console.error("MISTRAL_API_KEY absente de .env.local");
    process.exit(1);
  }
  mkdirSync(GENERATED_DIR, { recursive: true });

  const from = process.argv[2] ? Number(process.argv[2]) : 7;
  const to = process.argv[3] ? Number(process.argv[3]) : 56;

  // Contexte cumulatif : leçons rédigées + toute génération déjà sur disque.
  const corpus = new Map<number, LessonSeed>();
  for (const l of authoredLessons) corpus.set(l.order, l);
  for (const entry of curriculum) {
    const p = join(GENERATED_DIR, `lesson${entry.order}.json`);
    if (existsSync(p) && !corpus.has(entry.order)) {
      corpus.set(entry.order, JSON.parse(readFileSync(p, "utf-8")) as LessonSeed);
    }
  }

  const targets = curriculum.filter((c) => c.order >= from && c.order <= to);
  console.log(`Génération de ${targets.length} leçons (ordres ${from}→${to}).`);

  let ok = 0;
  let failed = 0;
  for (const entry of targets) {
    const priors = [...corpus.values()].filter((l) => l.order < entry.order);
    const knownWords = [...new Set(priors.flatMap((l) => l.vocabulary.map((v) => v.word)))];
    const knownHanzi = [...new Set(priors.flatMap((l) => l.hanzi.map((h) => h.character)))];

    process.stdout.write(
      `[${entry.order}/${to}] ${entry.title} (${entry.level}) — ${knownHanzi.length} car. connus… `
    );
    try {
      const { seed, soft, passes } = await generateLesson(
        entry,
        knownWords,
        knownHanzi,
        models,
        2
      );
      // Garde-fous finaux : forcer la cohérence des tableaux de révision.
      seed.order = entry.order;
      seed.slug = entry.slug;
      seed.level = entry.level;
      writeFileSync(
        join(GENERATED_DIR, `lesson${entry.order}.json`),
        JSON.stringify(seed, null, 2),
        "utf-8"
      );
      corpus.set(entry.order, seed);
      ok++;
      console.log(
        `OK (${seed.hanzi.length} hanzi, ${passes} passe${passes > 1 ? "s" : ""}${soft.length ? `, ${soft.length} avert.` : ""})`
      );
      if (soft.length) for (const w of soft.slice(0, 4)) console.log("      ⚠ " + w);
    } catch (e) {
      failed++;
      console.log(`ÉCHEC : ${(e as Error).message.slice(0, 120)}`);
    }
  }

  console.log(`\nTerminé : ${ok} réussies, ${failed} échouées sur ${targets.length}.`);
}

main();
