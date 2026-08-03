import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { VoiceLabClient } from "./VoiceLabClient";

export const dynamic = "force-dynamic";

export default async function LaboVocalPage() {
  const user = await getUser();

  const progress = await prisma.userProgress.findMany({
    where: { userId: user.id, nodeType: "HANZI" },
    include: { hanzi: true },
    orderBy: { due: "asc" },
  });

  const hanziList = progress
    .filter((p) => p.hanzi)
    .map((p) => ({
      character: p.hanzi!.character,
      pinyin: p.hanzi!.pinyin,
      meaning: p.hanzi!.meaning,
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Labo vocal</h1>
        <p className="mt-1 text-sm text-muted">
          Entraînez-vous à prononcer un caractère : le navigateur enregistre,
          analyse la hauteur de votre voix (F0) et compare la forme du
          contour au ton attendu. Analyse 100% locale, gratuite — un scoring
          maison, pas un jugement de laboratoire.
        </p>
      </div>

      <VoiceLabClient hanziList={hanziList} />
    </div>
  );
}
