"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { gradeCard, newCard, nextRecognition, serializeCard } from "@/lib/srs";
import type { LessonContent } from "@/lib/types";
import type { Grade } from "zhongwen-engine";

// Étape 6 (Consolidation) : marque la leçon terminée et fait entrer ses mots
// et hanzi dans le moteur de révision — chacun reçoit une carte FSRS vierge.
export async function completeLesson(slug: string) {
  const user = await getUser();
  const lesson = await prisma.lesson.findUnique({ where: { slug } });
  if (!lesson) throw new Error(`Leçon inconnue : ${slug}`);

  const existing = await prisma.userProgress.findFirst({
    where: { userId: user.id, nodeType: "LESSON", lessonId: lesson.id },
  });
  if (existing?.completedAt) return { alreadyCompleted: true, added: 0 };

  const content = JSON.parse(lesson.content) as LessonContent;
  const now = new Date();
  let added = 0;

  for (const word of content.consolidation.reviewWords) {
    const vocab = await prisma.vocabulary.findUnique({ where: { word } });
    if (!vocab) continue;
    const already = await prisma.userProgress.findFirst({
      where: { userId: user.id, nodeType: "WORD", vocabId: vocab.id },
    });
    if (already) continue;
    await prisma.userProgress.create({
      data: {
        userId: user.id,
        nodeType: "WORD",
        vocabId: vocab.id,
        due: now,
        fsrsCard: serializeCard(newCard(now)),
      },
    });
    added++;
  }

  for (const character of content.consolidation.reviewHanzi) {
    const hanzi = await prisma.hanzi.findUnique({ where: { character } });
    if (!hanzi) continue;
    const already = await prisma.userProgress.findFirst({
      where: { userId: user.id, nodeType: "HANZI", hanziId: hanzi.id },
    });
    if (already) continue;
    await prisma.userProgress.create({
      data: {
        userId: user.id,
        nodeType: "HANZI",
        hanziId: hanzi.id,
        due: now,
        fsrsCard: serializeCard(newCard(now)),
      },
    });
    added++;
  }

  if (existing) {
    await prisma.userProgress.update({
      where: { id: existing.id },
      data: { completedAt: now },
    });
  } else {
    await prisma.userProgress.create({
      data: {
        userId: user.id,
        nodeType: "LESSON",
        lessonId: lesson.id,
        completedAt: now,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/review");
  return { alreadyCompleted: false, added };
}

// Un rating de flashcard : FSRS recalcule la carte, l'historique est archivé
// (chaque erreur est une donnée — PRD principe 3), la reconnaissance évolue.
export async function gradeItem(progressId: string, rating: Grade) {
  const user = await getUser();
  const progress = await prisma.userProgress.findUnique({
    where: { id: progressId },
  });
  if (!progress?.fsrsCard) throw new Error("Item de révision introuvable.");

  const now = new Date();
  const { card, log } = gradeCard(progress.fsrsCard, rating, now);

  await prisma.userProgress.update({
    where: { id: progress.id },
    data: {
      fsrsCard: serializeCard(card),
      due: card.due,
      recognition: nextRecognition(progress.recognition, rating),
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      progressId: progress.id,
      rating,
      log: JSON.stringify(log),
    },
  });

  // Pas de revalidatePath ici : un refresh en pleine session décalerait la
  // file de révision côté client ; le dashboard est déjà force-dynamic.
  return { due: card.due.toISOString() };
}

// Un mot rencontré en lisant (Smart Reader) entre dans le moteur de
// révision — pinyin/sens viennent de la segmentation IA, pas d'une leçon.
export async function addWordToReview(word: string, pinyin: string, meaning: string) {
  const user = await getUser();

  const vocab = await prisma.vocabulary.upsert({
    where: { word },
    update: {},
    create: { word, pinyin, meaning, hskLevel: 0 },
  });

  const already = await prisma.userProgress.findFirst({
    where: { userId: user.id, nodeType: "WORD", vocabId: vocab.id },
  });
  if (already) return { added: false };

  const now = new Date();
  await prisma.userProgress.create({
    data: {
      userId: user.id,
      nodeType: "WORD",
      vocabId: vocab.id,
      due: now,
      fsrsCard: serializeCard(newCard(now)),
    },
  });

  revalidatePath("/");
  revalidatePath("/review");
  return { added: true };
}
