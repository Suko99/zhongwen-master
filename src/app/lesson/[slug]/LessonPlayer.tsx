"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { completeLesson } from "@/app/actions";
import { correctProductionAction } from "@/app/ai-actions";
import { HanziText } from "@/components/HanziText";
import { SpeakButton } from "@/components/SpeakButton";
import type { CorrectionResult } from "@/lib/ai";
import type { LessonContent } from "@/lib/types";

const STEPS = [
  "Mission",
  "Découverte",
  "Déconstruction",
  "Connexion",
  "Production",
  "Consolidation",
] as const;

export function LessonPlayer({
  slug,
  title,
  order,
  level,
  content,
  alreadyCompleted,
}: {
  slug: string;
  title: string;
  order: number;
  level: string;
  content: LessonContent;
  alreadyCompleted: boolean;
}) {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false); // Découverte : observation avant traduction
  const [shownExamples, setShownExamples] = useState<Set<number>>(new Set());
  const [completion, setCompletion] = useState<{
    done: boolean;
    added: number;
  }>({ done: alreadyCompleted, added: 0 });
  const [pending, startTransition] = useTransition();

  // Correcteur IA (étape Production)
  const [attempts, setAttempts] = useState<Record<number, string>>({});
  const [corrections, setCorrections] = useState<
    Record<number, CorrectionResult>
  >({});
  const [aiError, setAiError] = useState<string | null>(null);
  const [correcting, setCorrecting] = useState<number | null>(null);

  const requestCorrection = (index: number, instruction: string) => {
    setAiError(null);
    setCorrecting(index);
    startTransition(async () => {
      const result = await correctProductionAction(
        instruction,
        attempts[index] ?? ""
      );
      if (result.ok) {
        setCorrections((c) => ({ ...c, [index]: result.data }));
      } else {
        setAiError(result.error);
      }
      setCorrecting(null);
    });
  };

  const finishLesson = () => {
    startTransition(async () => {
      const result = await completeLesson(slug);
      setCompletion({ done: true, added: result.added });
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted">
          Leçon {order} · {level}
          {completion.done && (
            <span className="ml-2 font-semibold text-success">Terminée ✓</span>
          )}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
      </div>

      {/* Stepper */}
      <ol className="flex flex-wrap gap-1.5">
        {STEPS.map((name, i) => (
          <li key={name}>
            <button
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                i === step
                  ? "bg-accent text-white"
                  : i < step
                    ? "bg-accent-soft text-accent"
                    : "border border-border text-muted hover:border-accent"
              }`}
            >
              {i + 1}. {name}
            </button>
          </li>
        ))}
      </ol>

      <section className="rounded-xl border border-border bg-card p-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Mission communicative</h2>
            <p className="leading-relaxed">{content.mission.scenario}</p>
            <ul className="flex flex-col gap-2">
              {content.mission.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-accent">◦</span>
                  <HanziTextInline text={goal} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Découverte</h2>
            <p className="text-sm text-muted">{content.discovery.instructions}</p>
            <div className="flex flex-col gap-3">
              {content.discovery.dialogue.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="mt-1 w-5 shrink-0 text-xs font-bold text-accent">
                    {line.speaker}
                  </span>
                  <div>
                    <span className="inline-flex items-center gap-1">
                      <HanziText text={line.chinese} className="text-2xl" />
                      <SpeakButton text={line.chinese} size="sm" />
                    </span>
                    {revealed && (
                      <p className="mt-1 text-sm text-muted">
                        {line.pinyin} — {line.translation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!revealed && (
              <button
                onClick={() => setRevealed(true)}
                className="self-start rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent-soft"
              >
                J&apos;ai observé — afficher pinyin et traduction
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-semibold">Déconstruction</h2>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Hanzi de la leçon — cliquez pour ouvrir la fiche
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.deconstruction.hanzi.map((ch) => (
                  <Link
                    key={ch}
                    href={`/hanzi/${encodeURIComponent(ch)}`}
                    className="hanzi rounded-lg border border-border px-3 py-2 text-2xl transition hover:border-accent hover:bg-accent-soft"
                  >
                    {ch}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Grammaire
              </h3>
              <div className="flex flex-col gap-4">
                {content.deconstruction.grammar.map((g) => (
                  <div key={g.point} className="rounded-lg border border-border p-4">
                    <p className="font-semibold">{g.point}</p>
                    <p className="mt-1 text-sm leading-relaxed">
                      <HanziTextInline text={g.explanation} />
                    </p>
                    {g.examples.map((ex, i) => (
                      <p key={i} className="mt-2 text-sm">
                        <HanziText text={ex.chinese} className="text-base" />{" "}
                        <span className="text-muted">
                          — {ex.pinyin} — {ex.translation}
                        </span>
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                Prononciation
              </h3>
              <ul className="flex flex-col gap-2">
                {content.deconstruction.pronunciation.map((note) => (
                  <li key={note} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 text-warning">♪</span>
                    <HanziTextInline text={note} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Connexion</h2>
            <p className="text-sm leading-relaxed">
              <HanziTextInline text={content.connection.text} />
            </p>
            <div className="flex flex-col gap-2">
              {content.connection.links.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-2 text-sm"
                >
                  <HanziText text={link.from} className="text-lg" />
                  <span className="rounded bg-accent-soft px-2 py-0.5 text-xs font-mono text-accent">
                    {link.relation}
                  </span>
                  <HanziText text={link.to} className="text-lg" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold">Production</h2>
            <p className="text-sm text-muted">
              Créez, ne reconnaissez pas seulement : écrivez vos réponses,
              faites-les corriger par l&apos;IA, puis comparez avec un exemple.
            </p>
            {aiError && (
              <div className="rounded-lg border border-warning bg-card p-3 text-sm">
                <p className="font-semibold text-warning">Correcteur indisponible</p>
                <p className="mt-1 text-muted">{aiError}</p>
              </div>
            )}
            {content.production.prompts.map((prompt, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold">
                  <HanziTextInline text={prompt.instruction} />
                </p>
                <p className="mt-1 text-xs text-muted">
                  <HanziTextInline text={prompt.hint} />
                </p>
                <textarea
                  value={attempts[i] ?? ""}
                  onChange={(e) =>
                    setAttempts((a) => ({ ...a, [i]: e.target.value }))
                  }
                  className="hanzi mt-3 w-full rounded-lg border border-border bg-background p-3 text-lg outline-none focus:border-accent"
                  rows={2}
                  placeholder="写在这里… (écrivez ici)"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => requestCorrection(i, prompt.instruction)}
                    disabled={correcting !== null || !(attempts[i] ?? "").trim()}
                    className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                  >
                    {correcting === i
                      ? "Correction en cours…"
                      : "Faire corriger par l'IA"}
                  </button>
                </div>
                {corrections[i] && (
                  <div className="mt-3 rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-lg font-bold ${
                          corrections[i].score >= 80
                            ? "text-success"
                            : corrections[i].score >= 50
                              ? "text-warning"
                              : "text-accent"
                        }`}
                      >
                        {corrections[i].score}/100
                      </span>
                      <span className="text-xs text-muted">Correcteur IA</span>
                    </div>
                    <p className="mt-1 text-sm">
                      <HanziTextInline text={corrections[i].verdict} />
                    </p>
                    <p className="mt-3">
                      <HanziText
                        text={corrections[i].corrected}
                        className="text-xl"
                      />
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {corrections[i].corrected_pinyin}
                    </p>
                    {corrections[i].errors.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-2">
                        {corrections[i].errors.map((err, k) => (
                          <li key={k} className="text-sm">
                            <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">
                              {err.type}
                            </span>{" "}
                            <HanziTextInline
                              text={`« ${err.quote} » — ${err.explanation}`}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-sm text-muted">
                      💡 <HanziTextInline text={corrections[i].naturalness_tip} />
                    </p>
                  </div>
                )}
                {shownExamples.has(i) ? (
                  <p className="mt-2 text-sm">
                    <HanziText text={prompt.example.chinese} className="text-base" />{" "}
                    <span className="text-muted">
                      — {prompt.example.pinyin} — {prompt.example.translation}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={() =>
                      setShownExamples((prev) => new Set(prev).add(i))
                    }
                    className="mt-2 text-sm font-semibold text-accent hover:underline"
                  >
                    Comparer avec un exemple
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Consolidation</h2>
            <p className="text-sm leading-relaxed">
              <HanziTextInline text={content.consolidation.summary} />
            </p>
            <div className="flex flex-wrap gap-2">
              {content.consolidation.reviewWords.map((w) => (
                <HanziText
                  key={w}
                  text={w}
                  className="rounded-lg bg-accent-soft px-2 py-1 text-lg"
                />
              ))}
            </div>
            {completion.done ? (
              <div className="rounded-lg border border-border bg-background p-4 text-sm">
                <p className="font-semibold text-success">
                  Leçon terminée ✓
                  {completion.added > 0 &&
                    ` — ${completion.added} items ajoutés au moteur de révision.`}
                </p>
                <div className="mt-3 flex gap-4">
                  <Link
                    href="/review"
                    className="rounded-lg bg-accent px-4 py-2 font-semibold text-white"
                  >
                    Réviser maintenant
                  </Link>
                  <Link
                    href="/"
                    className="rounded-lg border border-border px-4 py-2 font-semibold hover:border-accent"
                  >
                    Retour au dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={finishLesson}
                disabled={pending}
                className="self-start rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {pending
                  ? "Envoi au moteur de révision…"
                  : "Terminer la leçon — envoyer au moteur de révision"}
              </button>
            )}
          </div>
        )}
      </section>

      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent disabled:opacity-40"
        >
          ← Précédent
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent disabled:opacity-40"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

function HanziTextInline({ text }: { text: string }) {
  return <HanziText text={text} mixed />;
}
