import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  type Card,
  type Grade,
  type ReviewLog,
} from "ts-fsrs";

// FSRS calcule QUAND réviser ; la pondération contextuelle (PRD §4) décidera
// plus tard dans quel ordre parmi les items dus le même jour.
const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

export { Rating };

export function newCard(now: Date = new Date()): Card {
  return createEmptyCard(now);
}

export function gradeCard(
  serializedCard: string,
  rating: Grade,
  now: Date = new Date()
): { card: Card; log: ReviewLog } {
  // CardInput de ts-fsrs accepte les dates sérialisées en string : le JSON
  // stocké en base peut être passé tel quel.
  const card = JSON.parse(serializedCard);
  return scheduler.next(card, now, rating);
}

export function serializeCard(card: Card): string {
  return JSON.stringify(card);
}

// Impact d'un rating de flashcard sur le score de reconnaissance (0–100).
// Heuristique MVP : les autres dimensions seront alimentées par d'autres
// types d'exercices (production → étape 5 des leçons, automaticité → chrono).
export function nextRecognition(current: number, rating: Grade): number {
  const delta: Record<Grade, number> = {
    [Rating.Again]: -15,
    [Rating.Hard]: 3,
    [Rating.Good]: 8,
    [Rating.Easy]: 12,
  };
  return Math.max(0, Math.min(100, current + delta[rating]));
}
