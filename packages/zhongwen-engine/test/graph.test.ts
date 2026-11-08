import { test } from "node:test";
import assert from "node:assert/strict";
import { buildGraph, masteryState, normalizeLabel } from "../src/index.ts";

const now = new Date("2026-01-10T00:00:00Z");
const past = new Date("2026-01-01T00:00:00Z");
const future = new Date("2026-02-01T00:00:00Z");

test("normalizeLabel keeps the first run of Chinese characters", () => {
  assert.equal(normalizeLabel("今天 (aujourd'hui)"), "今天");
  assert.equal(normalizeLabel("  好"), "好");
  assert.equal(normalizeLabel("hello"), null);
});

test("masteryState: due, mastered, fragile", () => {
  assert.equal(masteryState({ due: past, recognition: 100 }, now), "due");
  assert.equal(masteryState({ due: future, recognition: 80 }, now), "mastered");
  assert.equal(masteryState({ due: future, recognition: 79 }, now), "fragile");
  assert.equal(masteryState({ due: future.toISOString(), recognition: 50 }, now, 50), "mastered");
});

test("buildGraph builds nodes and edges from links", () => {
  const { nodes, edges } = buildGraph({
    links: [
      { from: "你 (tu)", relation: "composant", to: "你好" },
      { from: "好", relation: "composant", to: "你好" },
      { from: "abc", relation: "ignored", to: "好" }, // no CJK → dropped
      { from: "好", relation: "self", to: "好 (bien)" }, // self loop → dropped
    ],
    hanzi: ["你", "好"],
    pinyin: { 你好: "nǐ hǎo", 好: "hǎo" },
    progress: [
      { token: "你", due: past, recognition: 90 },
      { token: "好", due: future, recognition: 90 },
      { token: "你好", due: future, recognition: 20 },
    ],
    now,
  });

  assert.deepEqual(edges, [
    { from: "你", to: "你好", relation: "composant" },
    { from: "好", to: "你好", relation: "composant" },
  ]);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  assert.deepEqual(Object.keys(byId).sort(), ["你", "你好", "好"].sort());
  assert.equal(byId["你"].state, "due");
  assert.equal(byId["好"].state, "mastered");
  assert.equal(byId["你好"].state, "fragile");
  assert.equal(byId["你"].isHanzi, true);
  assert.equal(byId["你好"].isHanzi, false);
  assert.equal(byId["你好"].pinyin, "nǐ hǎo");
  assert.equal(byId["你"].pinyin, undefined);
});

test("buildGraph: unknown state and hanzi detection without a hanzi set", () => {
  const { nodes } = buildGraph({
    links: [{ from: "水", relation: "dans", to: "汉" }],
    pinyin: new Map([["水", "shuǐ"]]),
  });
  assert.ok(nodes.every((n) => n.state === "unknown" && n.isHanzi));
  assert.equal(nodes.find((n) => n.id === "水")?.pinyin, "shuǐ");
});

test("buildGraph: a hanzi set restricts isHanzi", () => {
  const { nodes } = buildGraph({
    links: [{ from: "水", relation: "dans", to: "汉" }],
    hanzi: ["水"],
  });
  assert.equal(nodes.find((n) => n.id === "汉")?.isHanzi, false);
});
