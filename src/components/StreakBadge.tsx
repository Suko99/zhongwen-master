import { getGamificationStats } from "@/lib/gamification";
import { getUser } from "@/lib/user";

// Badge du header : flamme + streak. Or quand la journée est jouée,
// éteint sinon — le signal Duolingo, sans en faire plus.
export async function StreakBadge() {
  const user = await getUser();
  const stats = await getGamificationStats(user.id);
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        stats.activeToday
          ? "bg-accent-soft text-accent"
          : "border border-border text-muted"
      }`}
      title={
        stats.activeToday
          ? "Série sauvée pour aujourd'hui !"
          : "Jouez aujourd'hui pour prolonger la série"
      }
    >
      🔥 {stats.streak}
    </span>
  );
}
