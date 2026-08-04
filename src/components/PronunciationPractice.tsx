"use client";

import { useState } from "react";
import {
  extractPitchContour,
  scoreTone,
  shapeLabel,
  trimToVoicedCore,
  type PitchPoint,
  type ToneVerdict,
} from "@/lib/pitchDetection";
import { toneOfSyllable, TONE_LABELS, TONE_SHAPE_DESCRIPTION } from "@/lib/pinyinTones";
import { isSpeechRecognitionSupported, recognizeSpeech } from "@/lib/speechRecognition";

// Un peu de marge au-delà du temps de parole réel : le temps de réaction
// avant de parler (ou une syllabe très courte) doit tenir dans la fenêtre.
const RECORD_MS = 2200;

type Status = "idle" | "requesting" | "recording" | "processing" | "done" | "error";
type WordResult = { transcript: string; match: boolean } | null;

export function PronunciationPractice({
  pinyin,
  character,
}: {
  pinyin: string;
  character?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [contour, setContour] = useState<PitchPoint[]>([]);
  const [verdict, setVerdict] = useState<ToneVerdict | null>(null);
  const [wordResult, setWordResult] = useState<WordResult>(null);

  const expectedTone = toneOfSyllable(pinyin);
  const wordCheckEnabled = !!character && isSpeechRecognitionSupported();

  const record = async () => {
    setError(null);
    setStatus("requesting");
    try {
      // echoCancellation/noiseSuppression/autoGainControl à false : sur la
      // WebView Android (certains Samsung), le suppresseur d'écho matériel
      // par défaut fait échouer getUserMedia avec NotReadableError
      // ("Could not start audio source").
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      setStatus("recording");

      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      const stopped = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
      });

      // Reconnaissance du MOT en parallèle de l'enregistrement pour l'analyse
      // de ton : deux captures micro indépendantes, l'une pour le contour de
      // hauteur (maison), l'autre pour la transcription (moteur du navigateur).
      const wordPromise = wordCheckEnabled ? recognizeSpeech(RECORD_MS) : Promise.resolve(null);

      recorder.start();
      await new Promise((r) => setTimeout(r, RECORD_MS));
      recorder.stop();
      stream.getTracks().forEach((t) => t.stop());

      const [blob, recognized] = await Promise.all([stopped, wordPromise]);
      setStatus("processing");

      if (recognized && character) {
        setWordResult({
          transcript: recognized.transcript,
          match: recognized.transcript.includes(character),
        });
      } else {
        setWordResult(null);
      }

      const arrayBuffer = await blob.arrayBuffer();
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const pitchContour = extractPitchContour(audioBuffer);
      ctx.close();

      if (pitchContour.length < 3) {
        setError("Je n'ai pas détecté de voix claire — réessayez plus près du micro.");
        setStatus("error");
        return;
      }

      // Le graphique affiché doit montrer exactement ce qui est noté : le
      // cœur vocal isolé, pas le contour brut (qui peut inclure du bruit de
      // fond ou un silence avant que vous ne parliez).
      setContour(trimToVoicedCore(pitchContour));
      setVerdict(scoreTone(pitchContour, expectedTone));
      setStatus("done");
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Micro refusé — autorisez l'accès au microphone pour vous entraîner."
          : "Impossible d'accéder au microphone sur cet appareil."
      );
      setStatus("error");
    }
  };

  const recording = status === "requesting" || status === "recording";

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Prononcez « {pinyin} »</p>
          <p className="text-xs text-muted">
            Attendu : {TONE_LABELS[expectedTone]} — {TONE_SHAPE_DESCRIPTION[expectedTone]}
          </p>
        </div>
        <button
          onClick={record}
          disabled={recording || status === "processing"}
          className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "recording"
            ? "🔴 Enregistrement…"
            : status === "requesting"
              ? "Micro…"
              : status === "processing"
                ? "Analyse…"
                : "🎙️ Enregistrer"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-warning">{error}</p>}

      {status === "done" && verdict && (
        <div className="mt-4">
          <ContourSparkline contour={contour} />

          {wordCheckEnabled && (
            <p
              className={`text-sm font-semibold ${
                wordResult === null
                  ? "text-muted"
                  : wordResult.match
                    ? "text-success"
                    : "text-accent"
              }`}
            >
              {wordResult === null
                ? "◦ Mot non reconnu — réessayez plus distinctement"
                : wordResult.match
                  ? `✓ Mot reconnu : « ${wordResult.transcript} »`
                  : `✗ Le navigateur a compris « ${wordResult.transcript} », pas « ${character} »`}
            </p>
          )}

          <p
            className={`mt-1 text-sm font-semibold ${verdict.match ? "text-success" : "text-accent"}`}
          >
            {verdict.match
              ? `✓ Ton correct — contour ${shapeLabel(verdict.detectedShape)}, comme attendu pour le ${TONE_LABELS[expectedTone].toLowerCase()}`
              : `✗ Ton pas encore ça — votre contour est ${shapeLabel(verdict.detectedShape)}, mais le ${TONE_LABELS[expectedTone].toLowerCase()} attend ${TONE_SHAPE_DESCRIPTION[expectedTone]}`}
          </p>
          {verdict.confidence === "low" && (
            <p className="mt-1 text-xs text-muted">
              Signal court — réessayez pour un résultat plus fiable.
            </p>
          )}
          <p className="mt-2 text-xs text-muted">
            Scoring maison (ton, analyse locale dans le navigateur)
            {wordCheckEnabled && " + reconnaissance vocale du navigateur (mot)"} —
            indicatif, pas un jugement de laboratoire. Un seul caractère isolé
            reste ambigu à reconnaître, même pour un moteur professionnel.
          </p>
        </div>
      )}
    </div>
  );
}

function ContourSparkline({ contour }: { contour: PitchPoint[] }) {
  const width = 240;
  const height = 60;
  const hz = contour.map((p) => p.hz);
  const min = Math.min(...hz);
  const max = Math.max(...hz) || min + 1;
  const points = contour
    .map((p, i) => {
      const x = (i / (contour.length - 1 || 1)) * width;
      const y = height - ((p.hz - min) / (max - min || 1)) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mb-2 h-14 w-full max-w-xs">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
