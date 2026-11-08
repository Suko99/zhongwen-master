import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
  type FSRS,
  type Grade,
  type ReviewLog,
} from "ts-fsrs";

export { Rating, fsrs, generatorParameters };
export type { Card, FSRS, Grade, ReviewLog };

/** Default scheduler: standard FSRS parameters with interval fuzzing enabled. */
export const defaultScheduler: FSRS = fsrs(generatorParameters({ enable_fuzz: true }));

/** Creates a fresh, never-reviewed card. */
export function newCard(now: Date = new Date()): Card {
  return createEmptyCard(now);
}

/** Serializes a card to JSON, e.g. to store it in a text/JSON database column. */
export function serializeCard(card: Card): string {
  return JSON.stringify(card);
}

/** Parses a card produced by {@link serializeCard}, restoring its Date fields. */
export function deserializeCard(serialized: string): Card {
  const raw = JSON.parse(serialized);
  return {
    ...raw,
    due: new Date(raw.due),
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  };
}

/**
 * Applies a review rating to a card and returns the rescheduled card plus the
 * review log. Accepts either a Card or its serialized JSON form.
 */
export function gradeCard(
  card: Card | string,
  rating: Grade,
  now: Date = new Date(),
  scheduler: FSRS = defaultScheduler
): { card: Card; log: ReviewLog } {
  const input = typeof card === "string" ? deserializeCard(card) : card;
  return scheduler.next(input, now, rating);
}

/** How much each rating moves the recognition score (0–100). */
export type RecognitionDeltas = Record<Grade, number>;

export const DEFAULT_RECOGNITION_DELTAS: RecognitionDeltas = {
  [Rating.Again]: -15,
  [Rating.Hard]: 3,
  [Rating.Good]: 8,
  [Rating.Easy]: 12,
};

/**
 * Updates a 0–100 recognition score after a flashcard review. FSRS decides
 * *when* to review; this score tracks *how well* an item is recognized, which
 * drives mastery states in the knowledge graph.
 */
export function nextRecognition(
  current: number,
  rating: Grade,
  deltas: RecognitionDeltas = DEFAULT_RECOGNITION_DELTAS
): number {
  return Math.max(0, Math.min(100, current + deltas[rating]));
}
