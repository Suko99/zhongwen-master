import {
  DEFAULT_MASTERED_THRESHOLD,
  masteryState,
  type MasteryInput,
  type MasteryState,
} from "./mastery.js";

/** A relation between two items, as written in lesson content. */
export type GraphLink = { from: string; relation: string; to: string };

export type GraphNode = {
  /** The Chinese token (a single character or a word). */
  id: string;
  /** True for a single character that is a known hanzi. */
  isHanzi: boolean;
  state: MasteryState;
  pinyin?: string;
};

export type GraphEdge = { from: string; to: string; relation: string };

/** Learner progress on one token. */
export type ProgressEntry = MasteryInput & { token: string };

export type BuildGraphInput = {
  /** Relations from all lessons; labels are normalized with {@link normalizeLabel}. */
  links: Iterable<GraphLink>;
  /**
   * Known hanzi. A single-character node is flagged `isHanzi` only if it is in
   * this set. When omitted, any single CJK character counts as a hanzi.
   */
  hanzi?: Iterable<string>;
  /** Pinyin per token, attached to nodes (e.g. for search). */
  pinyin?: Map<string, string> | Record<string, string>;
  /** Learner progress; tokens without progress are `unknown`. */
  progress?: Iterable<ProgressEntry>;
  now?: Date | number;
  masteredThreshold?: number;
};

const CJK_RUN = /[一-鿿]+/;

/**
 * Extracts the first run of Chinese characters from a label, so that
 * "今天 (today)" becomes "今天". Returns null if there is none.
 */
export function normalizeLabel(label: string): string | null {
  const m = label.match(CJK_RUN);
  return m ? m[0] : null;
}

/**
 * Builds a knowledge graph from lesson relations and learner progress.
 * Pure function: fetch the data from any storage and pass it in.
 */
export function buildGraph(input: BuildGraphInput): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const now = input.now ?? Date.now();
  const threshold = input.masteredThreshold ?? DEFAULT_MASTERED_THRESHOLD;
  const hanziSet = input.hanzi ? new Set(input.hanzi) : null;
  const pinyinOf =
    input.pinyin instanceof Map
      ? (id: string) => (input.pinyin as Map<string, string>).get(id)
      : (id: string) => (input.pinyin as Record<string, string> | undefined)?.[id];

  const stateOf = new Map<string, MasteryState>();
  for (const p of input.progress ?? []) {
    stateOf.set(p.token, masteryState(p, now, threshold));
  }

  const edges: GraphEdge[] = [];
  const nodeIds = new Set<string>();
  for (const link of input.links) {
    const from = normalizeLabel(link.from);
    const to = normalizeLabel(link.to);
    if (!from || !to || from === to) continue;
    nodeIds.add(from);
    nodeIds.add(to);
    edges.push({ from, to, relation: link.relation });
  }

  const nodes: GraphNode[] = [...nodeIds].map((id) => ({
    id,
    isHanzi: [...id].length === 1 && (hanziSet ? hanziSet.has(id) : CJK_RUN.test(id)),
    state: stateOf.get(id) ?? "unknown",
    pinyin: pinyinOf(id),
  }));

  return { nodes, edges };
}
