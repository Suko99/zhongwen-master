/** Mastery state of a learned item, used to colour knowledge-graph nodes. */
export type MasteryState = "unknown" | "mastered" | "fragile" | "due";

export type MasteryInput = {
  /** When the item is next due for review. */
  due: Date | number | string;
  /** Recognition score, 0–100. */
  recognition: number;
};

export const DEFAULT_MASTERED_THRESHOLD = 80;

/**
 * Classifies an item: `due` if its review date has passed, otherwise
 * `mastered` once recognition reaches the threshold, else `fragile`.
 */
export function masteryState(
  item: MasteryInput,
  now: Date | number = Date.now(),
  masteredThreshold: number = DEFAULT_MASTERED_THRESHOLD
): Exclude<MasteryState, "unknown"> {
  const dueAt = new Date(item.due).getTime();
  const nowAt = typeof now === "number" ? now : now.getTime();
  if (dueAt <= nowAt) return "due";
  return item.recognition >= masteredThreshold ? "mastered" : "fragile";
}
