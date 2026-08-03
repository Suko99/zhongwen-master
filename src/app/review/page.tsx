import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { ReviewSession, type ReviewItem } from "./ReviewSession";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const user = await getUser();
  const now = new Date();

  const due = await prisma.userProgress.findMany({
    where: { userId: user.id, fsrsCard: { not: null }, due: { lte: now } },
    include: { hanzi: true, vocab: true },
    orderBy: { due: "asc" },
  });

  const items = due.flatMap((p): ReviewItem[] => {
    if (p.nodeType === "HANZI" && p.hanzi) {
      return [
        {
          progressId: p.id,
          front: p.hanzi.character,
          pinyin: p.hanzi.pinyin,
          meaning: p.hanzi.meaning,
          kind: "Hanzi" as const,
        },
      ];
    }
    if (p.nodeType === "WORD" && p.vocab) {
      return [
        {
          progressId: p.id,
          front: p.vocab.word,
          pinyin: p.vocab.pinyin,
          meaning: p.vocab.meaning,
          kind: "Mot" as const,
        },
      ];
    }
    return [];
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="hanzi text-5xl text-muted">好</p>
        <h1 className="text-xl font-bold">Rien à réviser pour l&apos;instant</h1>
        <p className="max-w-sm text-sm text-muted">
          FSRS n&apos;a détecté aucun item dû. Terminez une leçon pour alimenter
          le moteur, ou revenez quand des révisions seront planifiées.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return <ReviewSession items={items} />;
}
