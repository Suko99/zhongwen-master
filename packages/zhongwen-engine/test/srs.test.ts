import { test } from "node:test";
import assert from "node:assert/strict";
import {
  Rating,
  deserializeCard,
  gradeCard,
  newCard,
  nextRecognition,
  serializeCard,
  fsrs,
  generatorParameters,
} from "../src/index.ts";

const noFuzz = fsrs(generatorParameters({ enable_fuzz: false }));
const t0 = new Date("2026-01-01T00:00:00Z");

test("newCard is due immediately and never reviewed", () => {
  const card = newCard(t0);
  assert.equal(card.due.getTime(), t0.getTime());
  assert.equal(card.reps, 0);
});

test("serialize/deserialize round-trips dates", () => {
  const { card } = gradeCard(newCard(t0), Rating.Good, t0, noFuzz);
  const back = deserializeCard(serializeCard(card));
  assert.ok(back.due instanceof Date);
  assert.equal(back.due.getTime(), card.due.getTime());
  assert.ok(back.last_review instanceof Date);
});

test("gradeCard accepts a serialized card and gives the same result", () => {
  const card = newCard(t0);
  const a = gradeCard(card, Rating.Good, t0, noFuzz);
  const b = gradeCard(serializeCard(card), Rating.Good, t0, noFuzz);
  assert.equal(a.card.due.getTime(), b.card.due.getTime());
});

test("Easy schedules later than Again", () => {
  const card = newCard(t0);
  const again = gradeCard(card, Rating.Again, t0, noFuzz).card;
  const easy = gradeCard(card, Rating.Easy, t0, noFuzz).card;
  assert.ok(easy.due.getTime() > again.due.getTime());
});

test("nextRecognition applies deltas and clamps to 0–100", () => {
  assert.equal(nextRecognition(50, Rating.Good), 58);
  assert.equal(nextRecognition(10, Rating.Again), 0);
  assert.equal(nextRecognition(95, Rating.Easy), 100);
  const custom = { [Rating.Again]: -1, [Rating.Hard]: 0, [Rating.Good]: 1, [Rating.Easy]: 2 } as const;
  assert.equal(nextRecognition(50, Rating.Easy, custom), 52);
});
