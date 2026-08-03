"use client";

import { useState, useTransition } from "react";
import { segmentTextAction, type ReaderWord } from "@/app/ai-actions";
import { addWordToReview } from "@/app/actions";
import { SpeakButton } from "@/components/SpeakButton";
import { SAMPLE_TEXTS } from "./sampleTexts";

const MAX_LENGTH = 700;
const CJK = /[一-鿿]/;

export function ReaderClient() {
  const [text, setText] = useState("");
  const [words, setWords] = useState<ReaderWord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [addingWord, setAddingWord] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const segment = () => {
    setError(null);
    setOpenIndex(null);
    startTransition(async () => {
      const result = await segmentTextAction(text);
      if (result.ok) {
        setWords(result.data);
      } else {
        setError(result.error);
        setWords(null);
      }
    });
  };

  const addToReview = (w: ReaderWord) => {
    setAddingWord(w.text);
    startTransition(async () => {
      await addWordToReview(w.text, w.pinyin, w.meaning);
      setAdded((prev) => new Set(prev).add(w.text));
      setAddingWord(null);
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLE_TEXTS.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setText(s.text);
                setWords(null);
                setError(null);
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              {s.label} · {s.level}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          rows={6}
          placeholder="Collez un texte en chinois (700 caractères max)…"
          className="hanzi w-full rounded-lg border border-border bg-background p-3 text-lg outline-none focus:border-accent"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted">
            {text.length} / {MAX_LENGTH}
          </span>
          <button
            onClick={segment}
            disabled={pending || !text.trim()}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Segmentation…" : "Segmenter"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-warning bg-card p-4 text-sm">
          <p className="font-semibold text-warning">Segmentation indisponible</p>
          <p className="mt-1 text-muted">{error}</p>
        </div>
      )}

      {words && (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="hanzi text-2xl leading-loose">
            {words.map((w, i) =>
              !CJK.test(w.text) || !w.pinyin ? (
                <span key={i}>{w.text}</span>
              ) : (
                <span key={i} className="relative">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className={
                      w.known
                        ? "hanzi"
                        : "hanzi border-b-2 border-dotted border-accent text-inherit"
                    }
                  >
                    {w.text}
                  </button>
                  {openIndex === i && (
                    <span className="absolute left-1/2 top-full z-10 mt-2 w-max max-w-[13rem] -translate-x-1/2 rounded-lg border border-border bg-card p-3 text-left text-sm shadow-lg">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold">{w.pinyin}</span>
                        <SpeakButton text={w.text} size="sm" />
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {w.meaning}
                      </span>
                      {!w.known && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToReview(w);
                          }}
                          disabled={addingWord === w.text || added.has(w.text)}
                          className="mt-2 w-full rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                          {added.has(w.text)
                            ? "✓ Ajouté aux révisions"
                            : addingWord === w.text
                              ? "Ajout…"
                              : "+ Ajouter aux révisions"}
                        </button>
                      )}
                    </span>
                  )}
                </span>
              )
            )}
          </p>
        </div>
      )}
    </div>
  );
}
