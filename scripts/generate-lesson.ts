// Génère UNE leçon du curriculum (auto-correction incluse), à relire avant seed.
// Usage :
//   npx tsx scripts/generate-lesson.ts        → prochaine leçon manquante
//   npx tsx scripts/generate-lesson.ts 8      → leçon d'ordre 8
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { curriculum } from "../prisma/content/curriculum";
import { allLessons } from "../prisma/content";
import { loadEnvLocal, generateLesson } from "./generator-core";

const GENERATED_DIR = join(__dirname, "..", "prisma", "content", "generated");

async function main() {
  loadEnvLocal();
  if (!process.env.MISTRAL_API_KEY) {
    console.error("MISTRAL_API_KEY absente de .env.local");
    process.exit(1);
  }

  const existing = allLessons();
  const existingOrders = new Set(existing.map((l) => l.order));
  const argOrder = process.argv[2] ? Number(process.argv[2]) : undefined;
  const entry = argOrder
    ? curriculum.find((c) => c.order === argOrder)
    : curriculum.find((c) => !existingOrders.has(c.order));
  if (!entry) {
    console.error(argOrder ? `Ordre ${argOrder} introuvable.` : "Curriculum épuisé.");
    process.exit(1);
  }

  const priors = existing.filter((l) => l.order < entry.order);
  const knownWords = [...new Set(priors.flatMap((l) => l.vocabulary.map((v) => v.word)))];
  const knownHanzi = [...new Set(priors.flatMap((l) => l.hanzi.map((h) => h.character)))];

  console.log(`Génération leçon ${entry.order} — ${entry.title} (${entry.level})`);
  console.log(`Contexte : ${knownHanzi.length} caractères, ${knownWords.length} mots connus.`);

  const models = [
    process.env.MISTRAL_GEN_MODEL ?? "mistral-large-latest",
    "mistral-small-latest",
  ];
  const { seed, soft, passes } = await generateLesson(entry, knownWords, knownHanzi, models, 2);

  mkdirSync(GENERATED_DIR, { recursive: true });
  writeFileSync(
    join(GENERATED_DIR, `lesson${entry.order}.json`),
    JSON.stringify(seed, null, 2),
    "utf-8"
  );
  console.log(`\n✓ prisma/content/generated/lesson${entry.order}.json`);
  console.log(`  ${seed.hanzi.length} hanzi, ${seed.vocabulary.length} mots, ${passes} passe(s).`);
  if (soft.length) {
    console.log("\nAvertissements restants (à vérifier) :");
    for (const w of soft) console.log("  ⚠ " + w);
  }
  console.log("\nRelisez, corrigez si besoin, puis : npm run db:seed");
}

main();
