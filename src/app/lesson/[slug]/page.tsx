import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import type { LessonContent } from "@/lib/types";
import { LessonPlayer } from "./LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();

  const lesson = await prisma.lesson.findUnique({
    where: { slug: decodeURIComponent(slug) },
    include: {
      progress: { where: { userId: user.id, nodeType: "LESSON" } },
    },
  });
  if (!lesson) notFound();

  const content = JSON.parse(lesson.content) as LessonContent;
  const completed = lesson.progress.some((p) => p.completedAt);

  return (
    <LessonPlayer
      slug={lesson.slug}
      title={lesson.title}
      order={lesson.order}
      level={lesson.level}
      content={content}
      alreadyCompleted={completed}
    />
  );
}
