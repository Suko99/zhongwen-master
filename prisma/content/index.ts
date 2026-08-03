import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { LessonSeed } from "./types";
import { lesson1 } from "./lesson1";
import { lesson2 } from "./lesson2";
import { lesson3 } from "./lesson3";
import { lesson4 } from "./lesson4";
import { lesson5 } from "./lesson5";

// Leçons rédigées à la main
export const authoredLessons: LessonSeed[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
];

const GENERATED_DIR = join(__dirname, "generated");

// Leçons produites par le Générateur IA (scripts/generate-lesson.ts),
// stockées en JSON — relues avant d'être seedées.
export function loadGeneratedLessons(): LessonSeed[] {
  if (!existsSync(GENERATED_DIR)) return [];
  return readdirSync(GENERATED_DIR)
    .filter((f) => f.endsWith(".json"))
    .map(
      (f) =>
        JSON.parse(readFileSync(join(GENERATED_DIR, f), "utf-8")) as LessonSeed
    );
}

export function allLessons(): LessonSeed[] {
  const seen = new Set(authoredLessons.map((l) => l.slug));
  const generated = loadGeneratedLessons().filter((l) => !seen.has(l.slug));
  return [...authoredLessons, ...generated].sort((a, b) => a.order - b.order);
}
