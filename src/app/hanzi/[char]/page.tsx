import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { HanziText } from "@/components/HanziText";
import { SpeakButton } from "@/components/SpeakButton";
import { PronunciationPractice } from "@/components/PronunciationPractice";
import { MASTERY_DIMENSIONS } from "@/lib/types";

export const dynamic = "force-dynamic";

const DIMENSION_LABELS: Record<(typeof MASTERY_DIMENSIONS)[number], string> = {
  recognition: "Reconnaissance",
  comprehension: "Compréhension",
  production: "Production",
  automaticity: "Automatisation",
};

export default async function HanziPage({
  params,
}: {
  params: Promise<{ char: string }>;
}) {
  const { char } = await params;
  const character = decodeURIComponent(char);
  const user = await getUser();

  const hanzi = await prisma.hanzi.findUnique({
    where: { character },
    include: { progress: { where: { userId: user.id } } },
  });
  if (!hanzi) notFound();

  const components = JSON.parse(hanzi.components) as string[];
  const family = JSON.parse(hanzi.family) as string[];
  const commonErrors = JSON.parse(hanzi.commonErrors) as string[];
  const progress = hanzi.progress[0];

  // Un composant n'est cliquable que s'il a sa propre fiche en base
  const knownComponents = new Set(
    (
      await prisma.hanzi.findMany({
        where: { character: { in: components } },
        select: { character: true },
      })
    ).map((h) => h.character)
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <p className="hanzi text-8xl leading-none">{hanzi.character}</p>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">{hanzi.pinyin}</p>
            <SpeakButton text={hanzi.character} />
          </div>
          <p className="mt-1 text-lg text-muted">{hanzi.meaning}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
            HSK {hanzi.hskLevel} · Radical{" "}
            <span className="hanzi text-sm">{hanzi.radical}</span>
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Composition
        </h2>
        <div className="flex flex-wrap gap-2">
          {components.map((c) =>
            knownComponents.has(c) && c !== hanzi.character ? (
              <Link
                key={c}
                href={`/hanzi/${encodeURIComponent(c)}`}
                className="hanzi rounded-lg border border-border px-3 py-2 text-2xl transition hover:border-accent hover:bg-accent-soft"
              >
                {c}
              </Link>
            ) : (
              <span
                key={c}
                className="hanzi rounded-lg border border-border px-3 py-2 text-2xl text-muted"
              >
                {c}
              </span>
            )
          )}
        </div>
        <h2 className="mt-5 mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
          Étymologie
        </h2>
        <p className="text-sm leading-relaxed">
          <HanziText text={hanzi.etymology} mixed />
        </p>
      </section>

      {family.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Famille — ce caractère débloque
          </h2>
          <div className="flex flex-wrap gap-2">
            {family.map((word) => (
              <HanziText
                key={word}
                text={word}
                className="rounded-lg bg-accent-soft px-2.5 py-1.5 text-xl"
              />
            ))}
          </div>
        </section>
      )}

      {commonErrors.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
            Pièges connus
          </h2>
          <ul className="flex flex-col gap-1.5">
            {commonErrors.map((err) => (
              <li key={err} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-warning">⚠</span>
                <HanziText text={err} mixed />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Labo vocal
        </h2>
        <PronunciationPractice pinyin={hanzi.pinyin} character={hanzi.character} />
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Maîtrise — 4 dimensions
        </h2>
        {progress ? (
          <div className="flex flex-col gap-3">
            {MASTERY_DIMENSIONS.map((dim) => {
              const value = progress[dim];
              return (
                <div key={dim}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{DIMENSION_LABELS[dim]}</span>
                    <span className="text-muted">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-border">
                    <div
                      className="h-2 rounded-full bg-accent transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Pas encore dans votre moteur de révision — terminez la leçon qui
            l&apos;introduit.
          </p>
        )}
      </section>
    </div>
  );
}
