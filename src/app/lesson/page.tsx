import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";

export const dynamic = "force-dynamic";

// /lesson → la prochaine leçon non terminée (ou la dernière du parcours)
export default async function NextLessonPage() {
  const user = await getUser();
  const lessons = await prisma.lesson.findMany({
    orderBy: { order: "asc" },
    include: { progress: { where: { userId: user.id, nodeType: "LESSON" } } },
  });
  const next =
    lessons.find((l) => !l.progress.some((p) => p.completedAt)) ??
    lessons[lessons.length - 1];
  if (!next) redirect("/");
  redirect(`/lesson/${next.slug}`);
}
