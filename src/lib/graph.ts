import { prisma } from "./db";
import type { LessonContent } from "./types";

export type GraphNode = {
  id: string; // le token chinois (caractère ou mot)
  isHanzi: boolean; // true si un seul caractère présent dans la table hanzi
  state: "unknown" | "mastered" | "fragile" | "due"; // couleur constellation
  pinyin?: string; // pour la recherche côté client
};

export type GraphEdge = { from: string; to: string; relation: string };

const CJK_RUN = /[一-鿿]+/;

// Les leçons générées peuvent produire des libellés « 今天 (aujourd'hui) » :
// on ne garde que le premier bloc de caractères chinois.
function normalize(label: string): string | null {
  const m = label.match(CJK_RUN);
  return m ? m[0] : null;
}

export async function buildGraph(userId: string): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}> {
  const [lessons, hanziRows, vocabRows, progressRows] = await Promise.all([
    prisma.lesson.findMany({ select: { content: true } }),
    prisma.hanzi.findMany({ select: { character: true, pinyin: true } }),
    prisma.vocabulary.findMany({ select: { word: true, pinyin: true } }),
    prisma.userProgress.findMany({
      where: { userId, nodeType: { in: ["HANZI", "WORD"] } },
      include: { hanzi: true, vocab: true },
    }),
  ]);

  const hanziSet = new Set(hanziRows.map((h) => h.character));
  // Le pinyin sert uniquement à la recherche côté client (Constellation.tsx) :
  // priorité au pinyin du mot complet (plus juste en contexte) sur celui du
  // caractère isolé.
  const pinyinById = new Map<string, string>();
  for (const h of hanziRows) pinyinById.set(h.character, h.pinyin);
  for (const v of vocabRows) pinyinById.set(v.word, v.pinyin);

  // État de maîtrise par token (PRD §9 : vert/orange/rouge).
  const now = Date.now();
  const stateOf = new Map<string, GraphNode["state"]>();
  for (const p of progressRows) {
    const token = p.hanzi?.character ?? p.vocab?.word;
    if (!token) continue;
    const due = p.due.getTime() <= now;
    const state: GraphNode["state"] = due
      ? "due"
      : p.recognition >= 80
        ? "mastered"
        : "fragile";
    stateOf.set(token, state);
  }

  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();
  const addNode = (id: string) => nodeIds.add(id);

  for (const lesson of lessons) {
    const content = JSON.parse(lesson.content) as LessonContent;
    for (const link of content.connection?.links ?? []) {
      const from = normalize(link.from);
      const to = normalize(link.to);
      if (!from || !to || from === to) continue;
      addNode(from);
      addNode(to);
      edges.push({ from, to, relation: link.relation });
    }
  }

  const nodes: GraphNode[] = [...nodeIds].map((id) => ({
    id,
    isHanzi: [...id].length === 1 && hanziSet.has(id),
    state: stateOf.get(id) ?? "unknown",
    pinyin: pinyinById.get(id),
  }));

  return { nodes, edges };
}
