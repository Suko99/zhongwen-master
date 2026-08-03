// Structure d'une leçon en 6 étapes (PRD §3), stockée en JSON dans Lesson.content

export type Sentence = {
  chinese: string;
  pinyin: string;
  translation: string;
};

export type DialogueLine = Sentence & { speaker: string };

export type GrammarPoint = {
  point: string;
  explanation: string;
  examples: Sentence[];
};

export type GraphLink = { from: string; relation: string; to: string };

export type ProductionPrompt = {
  instruction: string;
  hint: string;
  example: Sentence;
};

export type LessonContent = {
  mission: { scenario: string; goals: string[] };
  discovery: { instructions: string; dialogue: DialogueLine[] };
  deconstruction: {
    hanzi: string[]; // caractères analysés, cliquables vers la fiche
    grammar: GrammarPoint[];
    pronunciation: string[];
  };
  connection: { text: string; links: GraphLink[] };
  production: { prompts: ProductionPrompt[] };
  consolidation: { summary: string; reviewWords: string[]; reviewHanzi: string[] };
};

export const MASTERY_DIMENSIONS = [
  "recognition",
  "comprehension",
  "production",
  "automaticity",
] as const;

export type MasteryDimension = (typeof MASTERY_DIMENSIONS)[number];
