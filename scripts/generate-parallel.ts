// Génération PARALLÈLE par vagues. Bien plus rapide que le séquentiel :
// K leçons générées en même temps. Compromis assumé : les leçons d'une même
// vague ne voient pas le vocabulaire les unes des autres (seulement celui des
// vagues précédentes) — quelques avertissements de plus, gros gain de temps.
//
// Reprend automatiquement : saute les leçons déjà présentes dans generated/.
// Usage : npx tsx scripts/generate-parallel.ts [ordreDebut] [ordreFin] [concurrence]
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
  const concurrency = process.argv[4] ? Number(process.argv[4]) : 5;

  // Corpus = leçons rédigées + déjà générées sur disque.
  const corpus = new Map<number, LessonSeed>();
  for (const l of authoredLessons) corpus.set(l.order, l);
  for (const entry of curriculum) {
    const p = join(GENERATED_DIR, `lesson${entry.order}.json`);
    if (existsSync(p) && !corpus.has(entry.order)) {
      corpus.set(entry.order, JSON.parse(readFileSync(p, "utf-8")) as LessonSeed);
    }
  }

  const todo = curriculum.filter(
    (c) => c.order >= from && c.order <= to && !corpus.has(c.order)
  );
  if (todo.length === 0) {
    console.log("Rien à générer : toutes les leçons de l'intervalle existent déjà.");
    return;
  }
  console.log(
    `${todo.length} leçons à générer (ordres ${from}→${to}), ${concurrency} en parallèle.`
  );

  let ok = 0;
  let failed = 0;

  // Vagues successives : chaque vague voit le vocabulaire de toutes les
  // précédentes (snapshot du corpus figé avant la vague).
  for (let i = 0; i < todo.length; i += concurrency) {
    const wave = todo.slice(i, i + concurrency);
    const snapshot = [...corpus.values()];

    const results = await Promise.allSettled(
      wave.map(async (entry) => {
        const priors = snapshot.filter((l) => l.order < entry.order);
        const knownWords = [...new Set(priors.flatMap((l) => l.vocabulary.map((v) => v.word)))];
        const knownHanzi = [...new Set(priors.flatMap((l) => l.hanzi.map((h) => h.character)))];
        const { seed, soft, passes } = await generateLesson(
          entry,
          knownWords,
          knownHanzi,
          models,
          2
        );
        seed.order = entry.order;
        seed.slug = entry.slug;
        seed.level = entry.level;
        writeFileSync(
          join(GENERATED_DIR, `lesson${entry.order}.json`),
          JSON.stringify(seed, null, 2),
          "utf-8"
        );
        return { entry, seed, soft, passes };
      })
    );

    for (let j = 0; j < results.length; j++) {
      const r = results[j];
      const entry = wave[j];
      if (r.status === "fulfilled") {
        corpus.set(entry.order, r.value.seed);
        ok++;
        console.log(
          `  ✓ [${entry.order}] ${entry.title} (${entry.level}) — ${r.value.seed.hanzi.length} hanzi, ${r.value.passes} passe(s)${r.value.soft.length ? `, ${r.value.soft.length} avert.` : ""}`
        );
      } else {
        failed++;
        console.log(`  ✗ [${entry.order}] ${entry.title} — ${String(r.reason).slice(0, 120)}`);
      }
    }
    console.log(`— vague terminée (${i + wave.length}/${todo.length}) —`);
  }

  console.log(`\nTerminé : ${ok} réussies, ${failed} échouées.`);
}

main();
