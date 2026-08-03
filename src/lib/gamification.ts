import { prisma } from "./db";

// Gamification calculée, jamais stockée : l'historique (reviews + leçons
// terminées) est la source de vérité, donc rien à migrer ni à désynchroniser.
export const XP_PER_REVIEW = 5;
export const XP_PER_LESSON = 50;
export const DAILY_GOAL_XP = 40; // ~1 leçon ou ~8 révisions

export type GamificationStats = {
  totalXp: number;
  todayXp: number;
  dailyGoalXp: number;
  streak: number; // jours consécutifs d'activité (aujourd'hui inclus s'il est actif)
  activeToday: boolean;
};

function localDay(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export async function getGamificationStats(
  userId: string
): Promise<GamificationStats> {
  const [reviews, completedLessons] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      select: { reviewedAt: true },
    }),
    prisma.userProgress.findMany({
      where: { userId, nodeType: "LESSON", completedAt: { not: null } },
      select: { completedAt: true },
    }),
  ]);

  const totalXp =
    reviews.length * XP_PER_REVIEW + completedLessons.length * XP_PER_LESSON;

  const now = new Date();
  const today = localDay(now);
  const todayXp =
    reviews.filter((r) => localDay(r.reviewedAt) === today).length *
      XP_PER_REVIEW +
    completedLessons.filter((l) => localDay(l.completedAt!) === today).length *
      XP_PER_LESSON;

  // Streak : on remonte jour par jour tant qu'il y a de l'activité.
  const activeDays = new Set<string>([
    ...reviews.map((r) => localDay(r.reviewedAt)),
    ...completedLessons.map((l) => localDay(l.completedAt!)),
  ]);
  const activeToday = activeDays.has(today);

  let streak = 0;
  const cursor = new Date(now);
  if (!activeToday) cursor.setDate(cursor.getDate() - 1); // journée en cours pas encore jouée : le streak d'hier tient toujours
  while (activeDays.has(localDay(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { totalXp, todayXp, dailyGoalXp: DAILY_GOAL_XP, streak, activeToday };
}
