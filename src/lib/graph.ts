import { buildGraph as buildEngineGraph, type ProgressEntry } from "zhongwen-engine";
import { prisma } from "./db";
import type { LessonContent } from "./types";

export type { GraphNode, GraphEdge } from "zhongwen-engine";

// La construction du graphe (normalisation, états de maîtrise) vit dans
// zhongwen-engine ; ce module se contente de lire la base.
export async function buildGraph(userId: string) {
  const [lessons, hanziRows, vocabRows, progressRows] = await Promise.all([
    prisma.lesson.findMany({ select: { content: true } }),
    prisma.hanzi.findMany({ select: { character: true, pinyin: true } }),
    prisma.vocabulary.findMany({ select: { word: true, pinyin: true } }),
    prisma.userProgress.findMany({
      where: { userId, nodeType: { in: ["HANZI", "WORD"] } },
      include: { hanzi: true, vocab: true },
    }),
  ]);

  // Le pinyin sert uniquement à la recherche côté client (Constellation.tsx) :
  // priorité au pinyin du mot complet (plus juste en contexte) sur celui du
  // caractère isolé.
  const pinyin = new Map<string, string>();
  for (const h of hanziRows) pinyin.set(h.character, h.pinyin);
  for (const v of vocabRows) pinyin.set(v.word, v.pinyin);

  const progress: ProgressEntry[] = [];
  for (const p of progressRows) {
    const token = p.hanzi?.character ?? p.vocab?.word;
    if (token) progress.push({ token, due: p.due, recognition: p.recognition });
  }

  const links = lessons.flatMap(
    (lesson) => (JSON.parse(lesson.content) as LessonContent).connection?.links ?? []
  );

  return buildEngineGraph({
    links,
    hanzi: hanziRows.map((h) => h.character),
    pinyin,
    progress,
  });
}
