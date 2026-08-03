"use server";

import { synthesizeSpeech } from "@/lib/neuralTts";

type TtsResult = { ok: true; audioBase64: string } | { ok: false; error: string };

export async function synthesizeSpeechAction(
  text: string,
  voice?: string
): Promise<TtsResult> {
  try {
    const audioBase64 = await synthesizeSpeech(text, voice);
    return { ok: true, audioBase64 };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Synthèse vocale indisponible.",
    };
  }
}
