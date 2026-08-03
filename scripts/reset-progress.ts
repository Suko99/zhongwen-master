// Remet la progression à zéro (révisions + cartes FSRS + leçons terminées).
// Le contenu (hanzi, vocabulaire, leçons) n'est pas touché.
// Usage : npx tsx scripts/reset-progress.ts
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const reviews = await p.review.deleteMany();
  const progress = await p.userProgress.deleteMany();
  console.log(
    `Progression réinitialisée : ${reviews.count} révisions et ${progress.count} nœuds de progression supprimés.`
  );
}

main().finally(() => p.$disconnect());
