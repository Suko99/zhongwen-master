import type { LessonContent } from "../../src/lib/types";

export type HanziSeed = {
  character: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
  radical: string;
  components: string[];
  etymology: string;
  family: string[];
  commonErrors: string[];
};

export type VocabSeed = {
  word: string;
  pinyin: string;
  meaning: string;
  exampleZh: string;
  examplePinyin: string;
  exampleFr: string;
};

export type LessonSeed = {
  slug: string;
  title: string;
  mission: string;
  level: string;
  order: number;
  content: LessonContent;
  hanzi: HanziSeed[];
  vocabulary: VocabSeed[];
};
