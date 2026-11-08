"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { gradeItem } from "@/app/actions";
import { SpeakButton } from "@/components/SpeakButton";
import { Rating } from "zhongwen-engine";
import type { Grade } from "zhongwen-engine";

export type ReviewItem = {
  progressId: string;
  front: string;
  pinyin: string;
  meaning: string;
  kind: "Hanzi" | "Mot";
};

const RATINGS: { grade: Grade; label: string; className: string }[] = [
  {
    grade: Rating.Again,
    label: "À revoir",
    className: "border-accent text-accent hover:bg-accent-soft",
  },
  {
    grade: Rating.Hard,
    label: "Difficile",
    className: "border-warning text-warning hover:bg-accent-soft",
  },
  {
    grade: Rating.Good,
    label: "Correct",
    className: "border-success text-success hover:bg-accent-soft",
  },
  {
    grade: Rating.Easy,
    label: "Facile",
    className: "border-border text-muted hover:border-success hover:text-success",
  },
];

export function ReviewSession({ items: initialItems }: { items: ReviewItem[] }) {
  // File figée au montage : un rating replanifie l'item côté serveur, ce qui
  // changerait la liste des "dus" en cours de session et décalerait l'index.
  const [items] = useState(initialItems);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [counts, setCounts] = useState({ again: 0, ok: 0 });
  const [pending, startTransition] = useTransition();

  const current = items[index];
  const finished = index >= items.length;

  const rate = (grade: Grade) => {
    startTransition(async () => {
      await gradeItem(current.progressId, grade);
      setCounts((c) =>
        grade === Rating.Again
          ? { ...c, again: c.again + 1 }
          : { ...c, ok: c.ok + 1 }
      );
      setFlipped(false);
      setIndex((i) => i + 1);
    });
  };

  if (finished) {
    const earnedXp = (counts.ok + counts.again) * 5;
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="hanzi text-5xl text-success">完</p>
        <h1 className="text-xl font-bold">Session terminée</h1>
        <p className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
          +{earnedXp} XP
        </p>
        <p className="text-sm text-muted">
          {counts.ok} {counts.ok > 1 ? "réussites" : "réussite"} ·{" "}
          {counts.again} à revoir — FSRS a replanifié chaque item.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Retour au dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-muted">
        {index + 1} / {items.length} · {current.kind}
      </p>

      <div className="flex min-h-72 w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="hanzi text-7xl">{current.front}</p>
        <SpeakButton text={current.front} />
        {flipped && (
          <div className="text-center">
            <p className="text-xl font-semibold">{current.pinyin}</p>
            <p className="mt-1 text-muted">{current.meaning}</p>
          </div>
        )}
      </div>

      {flipped ? (
        <div className="flex flex-wrap justify-center gap-2">
          {RATINGS.map(({ grade, label, className }) => (
            <button
              key={label}
              onClick={() => rate(grade)}
              disabled={pending}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${className}`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Afficher la réponse
        </button>
      )}
    </div>
  );
}
