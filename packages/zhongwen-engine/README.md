# zhongwen-engine

A small, database-agnostic learning engine for Chinese, extracted from
[Zhongwen Master](https://github.com/Suko99/zhongwen-master).

It combines three pieces that language-learning apps usually rebuild:

- **Spaced repetition** with [FSRS](https://github.com/open-spaced-repetition/ts-fsrs):
  create, grade and (de)serialize cards for storage in any database.
- **Mastery tracking**: a 0–100 recognition score updated on each review, and
  a `due` / `fragile` / `mastered` / `unknown` state per item.
- **Knowledge graph**: turns lesson relations ("你 is a component of 你好")
  plus learner progress into nodes and edges ready to visualize.

Everything is pure functions: you fetch data from your own storage and pass it in.

## Install

```bash
npm install zhongwen-engine
```

ESM only, Node 18+ or any modern bundler.

## Spaced repetition

```ts
import { newCard, gradeCard, serializeCard, nextRecognition, Rating } from "zhongwen-engine";

let stored = serializeCard(newCard());          // save this string in your DB
let recognition = 0;

// later, when the learner answers:
const { card, log } = gradeCard(stored, Rating.Good);
stored = serializeCard(card);                   // card.due = next review date
recognition = nextRecognition(recognition, Rating.Good); // 0 → 8
```

`gradeCard` takes a `Card` or its serialized JSON, an optional `now`, and an
optional FSRS scheduler (`fsrs(generatorParameters({...}))`, re-exported from
ts-fsrs) if you want custom parameters. The default scheduler enables interval
fuzzing. `nextRecognition` accepts custom deltas per rating.

## Mastery state

```ts
import { masteryState } from "zhongwen-engine";

masteryState({ due: someDate, recognition: 85 }); // "due" | "mastered" | "fragile"
```

An item is `due` once its review date has passed, otherwise `mastered` when
recognition is at least 80 (configurable), else `fragile`.

## Knowledge graph

```ts
import { buildGraph } from "zhongwen-engine";

const { nodes, edges } = buildGraph({
  links: [
    { from: "你", relation: "component", to: "你好" },
    { from: "好 (good)", relation: "component", to: "你好" },
  ],
  hanzi: ["你", "好"],                           // optional: known characters
  pinyin: { 你好: "nǐ hǎo" },                    // optional: Map or object
  progress: [{ token: "你", due: new Date(), recognition: 90 }],
});
// nodes: [{ id: "你", isHanzi: true, state: "due", pinyin: undefined }, ...]
```

Labels are normalized to their first run of Chinese characters
(`"好 (good)"` → `"好"`); links without Chinese text and self-loops are
dropped. Nodes without progress are `unknown`.

## License

[MIT](LICENSE)
