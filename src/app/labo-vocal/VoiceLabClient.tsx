"use client";

import { useState } from "react";
import { PronunciationPractice } from "@/components/PronunciationPractice";
import { HanziText } from "@/components/HanziText";

type HanziItem = { character: string; pinyin: string; meaning: string };

export function VoiceLabClient({ hanziList }: { hanziList: HanziItem[] }) {
  const [selected, setSelected] = useState<HanziItem | null>(
    hanziList[0] ?? null
  );
  const [customPinyin, setCustomPinyin] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
          Essai libre — tapez un pinyin avec ton (ex. mǎ, hǎo, xué)
        </h2>
        <div className="flex gap-2">
          <input
            value={customPinyin}
            onChange={(e) => setCustomPinyin(e.target.value)}
            placeholder="mǎ"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-lg outline-none focus:border-accent"
          />
        </div>
        {customPinyin.trim() && (
          <div className="mt-4">
            <PronunciationPractice pinyin={customPinyin.trim()} />
          </div>
        )}
      </div>

      {hanziList.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Vos caractères acquis
          </h2>
          <div className="flex flex-wrap gap-2">
            {hanziList.map((h) => (
              <button
                key={h.character}
                onClick={() => setSelected(h)}
                className={`hanzi rounded-lg border px-3 py-2 text-2xl transition ${
                  selected?.character === h.character
                    ? "border-accent bg-accent-soft"
                    : "border-border hover:border-accent"
                }`}
              >
                {h.character}
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 flex items-baseline gap-2">
                <HanziText text={selected.character} className="text-4xl" />
                <span className="text-sm text-muted">{selected.meaning}</span>
              </p>
              <PronunciationPractice pinyin={selected.pinyin} character={selected.character} />
            </div>
          )}
        </div>
      )}

      {hanziList.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
          Terminez une leçon pour avoir des caractères à pratiquer ici — ou
          utilisez l&apos;essai libre ci-dessus.
        </p>
      )}
    </div>
  );
}
