# 中文 Zhongwen Master

> 🇫🇷 [Version française](README.fr.md)

> *Don't learn Chinese. Learn to think in Chinese.*

An open-source Mandarin learning app built around an **interconnected knowledge
network** (the *Cognitive Graph*) instead of linear lessons. AI is not a
chatbot here: a single LLM plays several distinct teaching roles (Teacher,
Corrector, Generator), each with its own system prompt.

The interface is currently in French and targets French-speaking learners
(the Corrector specifically flags French-language interference).

## Features

- **Dashboard**: one clear priority for the day (review or continue the path),
  a daily XP goal and a streak 🔥 (light gamification, nothing punitive).
- **6-step lessons**: Mission → Discovery → Deconstruction → Connection →
  Production → Consolidation, with observation before translation and
  clickable hanzi everywhere.
- **Spaced repetition** with [FSRS](https://github.com/open-spaced-repetition/ts-fsrs):
  every rating reschedules the card and is archived (every mistake is data).
- **Hanzi cards**: components, cautious etymology, word family and 4-dimension
  mastery (recognition / comprehension / production / automation).
- **AI Teacher** (`/professeur`): structured answers grounded in the
  vocabulary the learner already knows.
- **AI Corrector** (Production step): score, correction and typed errors.
- **AI Conversation** (`/conversation`): speak or type in Chinese; the AI
  replies, keeps the conversation going and notes mistakes on the side.
- **Smart Reader** (`/lecture`): paste any Chinese text; unknown words are
  underlined, known words stay plain. Click for pinyin and meaning.
- **Voice lab** (`/labo-vocal`): in-browser pitch detection (autocorrelation,
  no external dependency) that classifies your tone contour.
- **Cognitive Graph** (`/graphe`): a constellation of everything learned,
  coloured by mastery.
- **Audio**: neural zh-CN voices via Edge TTS, with automatic fallback to the
  browser's Web Speech API.
- **Android app** via Capacitor.

## Stack

| Layer | Choice |
|---|---|
| Frontend + backend | **Next.js 16** (App Router, Server Actions) |
| Language | **TypeScript** |
| Database | **PostgreSQL via Prisma** (Neon in production) |
| Spaced repetition | **ts-fsrs** |
| LLM | **Mistral AI**: one model, several role prompts |
| Audio | Edge neural TTS + Web Speech API fallback, in-browser pitch detection |
| Mobile | **Capacitor** (Android) |

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in DATABASE_URL and MISTRAL_API_KEY
npx prisma db push                 # create the schema
npm run db:seed                    # load lessons, hanzi and vocabulary
npm run dev                        # http://localhost:3000
```

Environment variables (see `.env.local.example`):

```
DATABASE_URL=postgresql://...      # e.g. a free Neon database
MISTRAL_API_KEY=your_key           # https://console.mistral.ai → API Keys
# MISTRAL_MODEL=mistral-large-latest   # optional (default: mistral-small-latest)
# APP_PASSWORD=...                     # optional: password-protects a public deployment
```

Without a Mistral key, AI screens show an explanatory message instead of
crashing. See [DEPLOYMENT.md](DEPLOYMENT.md) (French) for deploying to
Vercel + Neon.

## Content and lesson generator

The full **A1 → B2** curriculum (56 lessons) is planned in
[`prisma/content/curriculum.ts`](prisma/content/curriculum.ts).

- Lessons 1–5 are **hand-written** (`prisma/content/lessonN.ts`).
- Lessons 6+ are **produced by the Generator role** and then reviewed, stored
  as JSON in `prisma/content/generated/`.

```bash
npx tsx scripts/generate-lesson.ts        # next missing lesson
npx tsx scripts/generate-lesson.ts 12     # lesson 12
npx tsx scripts/generate-all.ts 7 56      # a whole range
```

The generator injects all previously introduced vocabulary as a **closed
constraint**, automatically validates the output (out-of-vocabulary
characters, duplicates, review-table consistency) and **self-corrects** by
feeding its own warnings back to the model (up to 2 passes). Generated
lessons should still be reviewed by a human.

## Utility scripts

| Command | Effect |
|---|---|
| `npm run db:seed` | (re)load all content into the database |
| `npx tsx scripts/check-db.ts` | inspect FSRS state and history |
| `npx tsx scripts/reset-progress.ts` | reset progress (keeps content) |
| `npx tsx scripts/generate-lesson.ts [n]` | generate one lesson |
| `npx tsx scripts/generate-all.ts [a] [b]` | generate a range of lessons |

## Architecture

```
src/
  app/
    page.tsx              Dashboard
    lesson/[slug]/        6-step lesson player + AI Corrector
    review/               FSRS review session
    hanzi/[char]/         Hanzi card
    professeur/           AI Teacher
    conversation/         AI Conversation
    lecture/              Smart Reader
    labo-vocal/           Voice / tone lab
    graphe/               Cognitive Graph
    actions.ts            Server Actions (lessons, reviews)
    ai-actions.ts         AI Server Actions
    tts-actions.ts        Text-to-speech Server Actions
  lib/
    srs.ts                FSRS scheduling and scoring
    ai.ts                 Mistral client + role prompts
    graph.ts              Graph extraction from lessons
    pitchDetection.ts     F0 detection and tone-contour classification
    neuralTts.ts          Edge neural TTS
    gamification.ts       XP / streak / daily goal (computed, not stored)
  components/             HanziText, SpeakButton, PronunciationPractice, ...
  proxy.ts                Optional password gate (Next.js 16 "proxy")
prisma/
  schema.prisma           Data model
  seed.ts                 Hybrid seed (hand-written + generated)
  content/                Curriculum, lessons, generated lessons
scripts/                  Generation, inspection, reset
android/                  Capacitor Android project
```

## Contributing

Issues and pull requests are welcome, whether it's bug reports, lesson
content corrections, translations of the interface, or new features.

## License

[MIT](LICENSE)
