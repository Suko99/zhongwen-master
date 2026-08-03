// Utilitaire de debug : état FSRS et historique des révisions.
// Usage : npx tsx scripts/check-db.ts
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const reviews = await p.review.findMany({
    include: { progress: { include: { vocab: true, hanzi: true } } },
    orderBy: { reviewedAt: "asc" },
  });
  for (const r of reviews) {
    const card = JSON.parse(r.progress.fsrsCard!);
    const item = r.progress.vocab?.word ?? r.progress.hanzi?.character;
    console.log(
      item,
      "rating=" + r.rating,
      "state=" + card.state,
      "stab=" + card.stability.toFixed(2),
      "diff=" + card.difficulty.toFixed(2),
      "due=" + card.due,
      "reco=" + r.progress.recognition
    );
  }
  console.log("total reviews:", reviews.length);

  const dueNow = await p.userProgress.count({
    where: { fsrsCard: { not: null }, due: { lte: new Date() } },
  });
  console.log("items encore dus maintenant:", dueNow);
}

main().finally(() => p.$disconnect());
