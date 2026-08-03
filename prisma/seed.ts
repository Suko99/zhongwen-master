import { PrismaClient } from "@prisma/client";
import type { LessonSeed } from "./content/types";
import { allLessons } from "./content";

const prisma = new PrismaClient();

const lessons: LessonSeed[] = allLessons();

async function seedLesson(seed: LessonSeed) {
  for (const h of seed.hanzi) {
    const data = {
      pinyin: h.pinyin,
      meaning: h.meaning,
      hskLevel: h.hskLevel,
      radical: h.radical,
      components: JSON.stringify(h.components),
      etymology: h.etymology,
      family: JSON.stringify(h.family),
      commonErrors: JSON.stringify(h.commonErrors),
    };
    await prisma.hanzi.upsert({
      where: { character: h.character },
      update: data,
      create: { character: h.character, ...data },
    });
  }

  const lesson = await prisma.lesson.upsert({
    where: { slug: seed.slug },
    update: {
      title: seed.title,
      mission: seed.mission,
      level: seed.level,
      order: seed.order,
      content: JSON.stringify(seed.content),
    },
    create: {
      slug: seed.slug,
      title: seed.title,
      mission: seed.mission,
      level: seed.level,
      order: seed.order,
      content: JSON.stringify(seed.content),
    },
  });

  for (const v of seed.vocabulary) {
    // Un mot n'appartient qu'à la première leçon qui l'introduit
    const existing = await prisma.vocabulary.findUnique({
      where: { word: v.word },
    });
    if (existing) {
      await prisma.vocabulary.update({
        where: { word: v.word },
        data: { ...v, lessonId: existing.lessonId ?? lesson.id },
      });
    } else {
      await prisma.vocabulary.create({
        data: { ...v, hskLevel: 1, lessonId: lesson.id },
      });
    }
  }

  return lesson;
}

async function main() {
  const existingUser = await prisma.user.findFirst();
  const user =
    existingUser ??
    (await prisma.user.create({
      data: {
        name: "Apprenant",
        level: "A1",
        goal: "Tenir une conversation de base",
      },
    }));

  let totalHanzi = 0;
  let totalVocab = 0;
  for (const seed of lessons) {
    await seedLesson(seed);
    totalHanzi += seed.hanzi.length;
    totalVocab += seed.vocabulary.length;
    console.log(`  Leçon ${seed.order} — ${seed.title} : OK`);
  }

  console.log(
    `Seed OK — utilisateur "${user.name}", ${lessons.length} leçons, ${totalHanzi} fiches hanzi, ${totalVocab} entrées de vocabulaire.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
