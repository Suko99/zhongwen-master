import Link from "next/link";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { getGamificationStats } from "@/lib/gamification";

export const dynamic = "force-dynamic";

// Dashboard = une seule question : que faire maintenant ? (PRD §9,
// minimalisme cognitif — une priorité du jour, pas 15 statistiques)
export default async function Dashboard() {
  const user = await getUser();
  const now = new Date();

  const [dueCount, hanziTracked, wordsTracked, lessons, stats] = await Promise.all([
    prisma.userProgress.count({
      where: { userId: user.id, fsrsCard: { not: null }, due: { lte: now } },
    }),
    prisma.userProgress.count({
      where: { userId: user.id, nodeType: "HANZI" },
    }),
    prisma.userProgress.count({ where: { userId: user.id, nodeType: "WORD" } }),
    prisma.lesson.findMany({
      orderBy: { order: "asc" },
      include: {
        progress: { where: { userId: user.id, nodeType: "LESSON" } },
      },
    }),
    getGamificationStats(user.id),
  ]);

  const goalPct = Math.min(
    100,
    Math.round((stats.todayXp / stats.dailyGoalXp) * 100)
  );

  const nextLesson = lessons.find((l) => !l.progress.some((p) => p.completedAt));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted">
          Niveau {user.level} · Objectif : {user.goal}
        </p>
        <h1 className="mt-1 text-2xl font-bold">
          {dueCount > 0
            ? "Priorité du jour : réviser"
            : nextLesson
              ? "Priorité du jour : continuer le parcours"
              : "Tout est à jour"}
        </h1>
      </div>

      {dueCount > 0 ? (
        <Link
          href="/review"
          className="block rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                {dueCount} {dueCount > 1 ? "items sont dus" : "item est dû"}
              </p>
              <p className="mt-1 text-sm text-muted">
                FSRS a calculé que c&apos;est le moment optimal pour les revoir.
              </p>
            </div>
            <span className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
              Réviser
            </span>
          </div>
        </Link>
      ) : nextLesson ? (
        <Link
          href={`/lesson/${nextLesson.slug}`}
          className="block rounded-xl border border-border bg-card p-6 shadow-sm transition hover:border-accent"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                Leçon {nextLesson.order} — {nextLesson.title}
              </p>
              <p className="mt-1 text-sm text-muted">
                Mission : {nextLesson.mission}
              </p>
            </div>
            <span className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">
              Commencer
            </span>
          </div>
        </Link>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
          Aucune révision due et aucune leçon en attente. Revenez plus tard —
          FSRS vous rappellera au bon moment.
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">
            Objectif du jour : {stats.todayXp} / {stats.dailyGoalXp} XP
          </span>
          <span className="text-muted">
            🔥 Série : {stats.streak} {stats.streak > 1 ? "jours" : "jour"} ·{" "}
            {stats.totalXp} XP au total
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-border">
          <div
            className={`h-2.5 rounded-full transition-all ${goalPct >= 100 ? "bg-success" : "bg-accent"}`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
        {goalPct >= 100 && (
          <p className="mt-2 text-xs font-semibold text-success">
            Objectif atteint — la série est sauvée pour aujourd&apos;hui ! 🎉
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold">{hanziTracked}</p>
          <p className="text-sm text-muted">Hanzi actifs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold">{wordsTracked}</p>
          <p className="text-sm text-muted">Mots actifs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-2xl font-bold">
            {lessons.filter((l) => l.progress.some((p) => p.completedAt)).length}
            <span className="text-base font-normal text-muted">
              /{lessons.length}
            </span>
          </p>
          <p className="text-sm text-muted">Leçons terminées</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Parcours A1 → B2
        </h2>
        {(["A1", "A2", "B1", "B2"] as const).map((level) => {
          const group = lessons.filter((l) => l.level === level);
          if (group.length === 0) return null;
          const doneCount = group.filter((l) =>
            l.progress.some((p) => p.completedAt)
          ).length;
          return (
            <details key={level} open={level === "A1"} className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-1 text-sm font-semibold">
                <span>
                  Niveau {level}
                  <span className="ml-2 font-normal text-muted">
                    {doneCount}/{group.length} terminées
                  </span>
                </span>
                <span className="text-xs text-muted group-open:hidden">
                  Afficher ▾
                </span>
              </summary>
              <ul className="mt-2 flex flex-col gap-2">
                {group.map((lesson) => {
                  const done = lesson.progress.some((p) => p.completedAt);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/lesson/${lesson.slug}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition hover:border-accent"
                      >
                        <span className="text-sm">
                          Leçon {lesson.order} — {lesson.title}
                        </span>
                        <span
                          className={`shrink-0 text-xs font-semibold ${done ? "text-success" : "text-muted"}`}
                        >
                          {done ? "Terminée ✓" : lesson.level}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </div>
  );
}
