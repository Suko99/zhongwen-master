"use client";

import { useState, useTransition } from "react";
import { askProfessorAction } from "@/app/ai-actions";
import { HanziText } from "@/components/HanziText";
import type { ProfessorAnswer } from "@/lib/ai";

const SUGGESTIONS = [
  "Quelle est la différence entre 不 et 没 ?",
  "Pourquoi 好 contient-il « femme » et « enfant » ?",
  "Comment dire « il y a » en chinois ?",
];

type Entry = { question: string; answer: ProfessorAnswer };

export function ProfessorPanel() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const ask = (q: string) => {
    setError(null);
    startTransition(async () => {
      const result = await askProfessorAction(q);
      if (result.ok) {
        setHistory((h) => [{ question: q, answer: result.data }, ...h]);
        setQuestion("");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask(question);
        }}
        className="flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Votre question…"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending || !question.trim()}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Le professeur réfléchit…" : "Demander"}
        </button>
      </form>

      {history.length === 0 && !pending && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              <HanziText text={s} mixed />
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-warning bg-card p-4 text-sm">
          <p className="font-semibold text-warning">Le professeur est injoignable</p>
          <p className="mt-1 text-muted">{error}</p>
        </div>
      )}

      {history.map((entry, i) => (
        <article
          key={history.length - i}
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-sm font-semibold text-muted">
            <HanziText text={entry.question} mixed />
          </p>
          <h2 className="mt-2 text-lg font-bold">
            <HanziText text={entry.answer.concept} mixed />
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            <HanziText text={entry.answer.explanation.simple} mixed />
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-semibold text-accent">
              Aller plus loin
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              <HanziText text={entry.answer.explanation.deep} mixed />
            </p>
          </details>

          {entry.answer.examples.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {entry.answer.examples.map((ex, j) => (
                <div key={j} className="rounded-lg bg-background p-3">
                  <HanziText text={ex.chinese} className="text-xl" />
                  <p className="mt-1 text-sm text-muted">
                    {ex.pinyin} — {ex.translation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {entry.answer.common_errors.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5">
              {entry.answer.common_errors.map((err, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-warning">⚠</span>
                  <HanziText text={err} mixed />
                </li>
              ))}
            </ul>
          )}

          {entry.answer.related_known.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                En lien avec vos acquis
              </span>
              {entry.answer.related_known.map((w) => (
                <HanziText
                  key={w}
                  text={w}
                  className="rounded bg-accent-soft px-2 py-0.5 text-base"
                />
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
