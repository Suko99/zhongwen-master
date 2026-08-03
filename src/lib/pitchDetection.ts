// Détection de hauteur (F0) et classement de la forme du contour tonal —
// entièrement en JS, dans le navigateur : pas de Python, pas de CREPE
// (PRD §7 "option fait maison"), donc heuristique plutôt que neuronal.
// N'utilise que des API navigateur standard (AudioContext, autocorrélation
// maison) : aucune dépendance externe. N'est importé que depuis des
// composants clients (AudioBuffer n'existe pas côté serveur).

import type { Tone } from "./pinyinTones";

export type PitchPoint = { t: number; hz: number; rms: number };

// Fenêtres courtes : un 4e ton prononcé vite et sec (comportement natif
// normal) peut ne durer que 150-250ms — des fenêtres de 43ms (2048
// échantillons à 48 kHz) lissent trop la chute de hauteur. Des fenêtres de
// ~21ms suivent le mouvement de pitch bien plus fidèlement, tout en restant
// assez longues pour capter une période complète jusqu'à MIN_HZ.
const FRAME_SIZE = 1024;
const HOP_SIZE = 256;
const MIN_HZ = 75; // voix humaine grave
const MAX_HZ = 500; // voix humaine aiguë
const ABSOLUTE_SILENCE_RMS = 0.004;

// Autocorrélation normalisée sur une fenêtre : trouve le décalage (lag) qui
// maximise la ressemblance du signal avec lui-même — l'inverse du lag donne
// la fréquence fondamentale. Une voix réelle est riche en harmoniques, ce
// qui piège une autocorrélation naïve entre plusieurs pics plausibles (la
// vraie période, sa moitié, son double) : d'une frame à l'autre elle peut
// "sauter d'octave" et zigzaguer au lieu de suivre un contour lisse.
// `previousHz` sert d'ancre de continuité : parmi les pics de corrélation
// plausibles, on préfère celui le plus proche de la fréquence précédente,
// pas seulement le score brut le plus haut.
function autocorrelatePitch(
  buf: Float32Array,
  sampleRate: number,
  silenceThreshold: number,
  previousHz: number | null
): { hz: number; rms: number } | null {
  const n = buf.length;
  let rms = 0;
  for (let i = 0; i < n; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / n);
  if (rms < silenceThreshold) return null; // trop silencieux : pas de voix ici

  const maxLag = Math.min(Math.floor(sampleRate / MIN_HZ), n - 1);
  const minLag = Math.floor(sampleRate / MAX_HZ);
  const corrs = new Float32Array(maxLag - minLag + 1);
  let bestIdx = -1;
  let bestCorr = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < n - lag; i++) {
      corr += buf[i] * buf[i + lag];
    }
    corr = corr / (n - lag);
    corrs[lag - minLag] = corr;
    if (corr > bestCorr) {
      bestCorr = corr;
      bestIdx = lag - minLag;
    }
  }

  if (bestIdx < 0 || bestCorr < rms * rms * 0.22) return null; // pas assez périodique

  let chosenIdx = bestIdx;
  if (previousHz) {
    // Seuil de tolérance élevé (85% du meilleur score, pas 60%) : ne
    // considère que les candidats PRESQUE aussi forts que le meilleur.
    // Un seuil trop permissif laissait la continuité "coller" à l'ancienne
    // fréquence même quand le ton évolue réellement (ex. la remontée
    // progressive et discrète d'un 3e ton), un pic secondaire à peine
    // plausible suffisant à gagner sur le vrai meilleur pic.
    let bestDistance = Infinity;
    for (let i = 0; i < corrs.length; i++) {
      if (corrs[i] < bestCorr * 0.85) continue;
      const freq = sampleRate / (i + minLag);
      const distance = Math.abs(Math.log2(freq / previousHz));
      if (distance < bestDistance) {
        bestDistance = distance;
        chosenIdx = i;
      }
    }
  }

  return { hz: sampleRate / (chosenIdx + minLag), rms };
}

// Lissage léger (médiane glissante) : gomme les sauts d'octave isolés qui
// subsistent malgré l'ancrage de continuité, sans aplatir un vrai mouvement
// de ton confirmé sur plusieurs frames. Traite aussi les deux extrémités
// (un filtre à 3 points naïf les laisse souvent intactes, exactement là où
// un artefact de fin d'enregistrement aime se nicher).
function medianSmooth(hz: number[]): number[] {
  if (hz.length < 3) return hz;
  return hz.map((_, i) => {
    const window = hz
      .slice(Math.max(0, i - 1), Math.min(hz.length, i + 2))
      .sort((a, b) => a - b);
    return window[Math.floor(window.length / 2)];
  });
}

export function extractPitchContour(audioBuffer: AudioBuffer): PitchPoint[] {
  const data = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const raw: { t: number; hz: number; rms: number }[] = [];

  // Seuil de silence ADAPTATIF : un pourcentage du pic d'énergie de CET
  // enregistrement, pas une valeur absolue — insensible au gain du micro,
  // à la distance, ou au volume de la voix de l'utilisateur. Un plancher
  // absolu reste appliqué pour ignorer un enregistrement vraiment vide.
  let peakRms = 0;
  for (let start = 0; start + FRAME_SIZE <= data.length; start += HOP_SIZE) {
    const frame = data.subarray(start, start + FRAME_SIZE);
    let rms = 0;
    for (let i = 0; i < frame.length; i++) rms += frame[i] * frame[i];
    rms = Math.sqrt(rms / frame.length);
    if (rms > peakRms) peakRms = rms;
  }
  const silenceThreshold = Math.max(ABSOLUTE_SILENCE_RMS, peakRms * 0.15);

  let previousHz: number | null = null;
  for (let start = 0; start + FRAME_SIZE <= data.length; start += HOP_SIZE) {
    const frame = data.subarray(start, start + FRAME_SIZE);
    const result = autocorrelatePitch(frame, sampleRate, silenceThreshold, previousHz);
    if (result) {
      raw.push({ t: start / sampleRate, hz: result.hz, rms: result.rms });
      previousHz = result.hz;
    }
  }

  const smoothed = medianSmooth(raw.map((p) => p.hz));
  return raw.map((p, i) => ({ t: p.t, hz: smoothed[i], rms: p.rms }));
}

// Le seuil de silence ci-dessus est volontairement permissif (pour ne pas
// couper la fin faible d'un ton sec) : il laisse parfois passer du bruit de
// fond ou un temps de réaction avant que l'utilisateur ne parle vraiment.
// Cette 2e passe, plus stricte, isole le passage réellement voisé (souffle
// vocal fort) — la vraie syllabe — pour ne pas diluer sa forme dans une
// moyenne qui inclut du bruit silencieux.
export function trimToVoicedCore(contour: PitchPoint[]): PitchPoint[] {
  if (contour.length < 4) return contour;

  // Regroupe par CONTINUITÉ TEMPORELLE (pas par volume) : un 4e ton
  // s'éteint souvent en hauteur ET en volume à la fois — un filtre basé sur
  // le volume couperait justement la fin plus faible qui prouve la chute.
  // On repère plutôt le plus long passage sans coupure (pas de frame
  // manquante entre deux points consécutifs) : c'est la syllabe réelle,
  // même si elle se termine en decrescendo.
  const dts = contour.slice(1).map((p, i) => p.t - contour[i].t);
  const sortedDts = [...dts].sort((a, b) => a - b);
  const medianDt = sortedDts[Math.floor(sortedDts.length / 2)] ?? dts[0] ?? 0;
  const gapThreshold = medianDt * 1.8;

  let bestStart = 0;
  let bestEnd = 1;
  let curStart = 0;
  for (let i = 1; i <= contour.length; i++) {
    const broke = i === contour.length || contour[i].t - contour[i - 1].t > gapThreshold;
    if (broke) {
      if (i - curStart > bestEnd - bestStart) {
        bestStart = curStart;
        bestEnd = i;
      }
      curStart = i;
    }
  }

  const core = contour.slice(bestStart, bestEnd);
  if (core.length < 3) return contour;

  // Amorce vocale : les tout premiers instants d'une syllabe sont souvent
  // acoustiquement instables (les cordes vocales n'ont pas encore atteint
  // leur régime stable), ce qui produit une petite rampe de hauteur
  // parasite avant que le vrai ton ne s'installe — surtout visible sur un
  // 1er ton (plat), où cette rampe ressemble à tort à une montée. On
  // ignore les tout premiers points, seulement si le cœur reste assez
  // long pour qu'il en reste une forme exploitable.
  const onsetTrim = core.length >= 10 ? 2 : 0;
  return onsetTrim > 0 ? core.slice(onsetTrim) : core;
}

export type ToneShape = "flat" | "rising" | "falling" | "dipping" | "unclear";

const SHAPE_LABELS: Record<ToneShape, string> = {
  flat: "plate et haute",
  rising: "montante",
  falling: "descendante",
  dipping: "un creux (descend puis remonte)",
  unclear: "peu marquée",
};

export function shapeLabel(shape: ToneShape): string {
  return SHAPE_LABELS[shape];
}

// Classe la forme du contour à partir de valeurs normalisées (0-1) :
// on ne regarde que le DESSIN de la courbe, jamais la hauteur absolue —
// chaque voix a sa propre tessiture. Opère sur le cœur voisé (voir
// `trimToVoicedCore`), pas le contour brut, pour ne pas être dilué par du
// bruit de fond ou un silence avant la parole.
export function classifyContourShape(contour: PitchPoint[]): ToneShape {
  const core = trimToVoicedCore(contour);
  if (core.length < 4) return "unclear";

  const hz = core.map((p) => p.hz);
  const min = Math.min(...hz);
  const max = Math.max(...hz);
  if (max - min < 8) return "flat"; // moins d'une tierce mineure de variation

  const norm = hz.map((h) => (h - min) / (max - min));
  const flatThreshold = 0.22;

  // Le creux (3e ton) se détecte à part, AVANT le test descendant/montant :
  // une moyenne par tiers dilue trop la remontée (souvent progressive et
  // partielle, elle ne revient pas forcément au niveau de départ) pour
  // qu'un simple "tiers de fin haut" fonctionne. On cherche directement le
  // point le plus bas — en fait souvent un PLATEAU de plusieurs points au
  // même niveau, pas un seul point isolé — avec une vraie descente avant
  // et une vraie remontée après TOUT le plateau, sans exiger qu'elle
  // rejoigne le niveau initial.
  const minVal = Math.min(...norm);
  const edgeMargin = Math.max(1, Math.floor(norm.length * 0.15));
  const dipThreshold = 0.12;
  const plateauEpsilon = 0.06;
  const troughStart = norm.findIndex((v) => v <= minVal + plateauEpsilon);
  const troughEnd = norm.length - 1 - [...norm].reverse().findIndex((v) => v <= minVal + plateauEpsilon);
  // On exige un minimum de points de part et d'autre (pas forcément la
  // marge complète) : une remontée qui se termine près du bord du cœur
  // voisé reste une vraie remontée, même mesurée sur moins de points.
  const minWindow = 2;
  if (troughStart >= minWindow && troughEnd <= norm.length - 1 - minWindow) {
    const before = norm.slice(Math.max(0, troughStart - edgeMargin), troughStart);
    const after = norm.slice(troughEnd + 1, Math.min(norm.length, troughEnd + 1 + edgeMargin));
    const declined = average(before) - minVal > dipThreshold;
    const rose = average(after) - minVal > dipThreshold;
    if (declined && rose) return "dipping";
  }

  const third = Math.max(1, Math.floor(norm.length / 3));
  const start = average(norm.slice(0, third));
  const middle = average(norm.slice(third, norm.length - third || third));
  const end = average(norm.slice(norm.length - third));

  if (Math.abs(end - start) < flatThreshold && Math.abs(middle - start) < flatThreshold) {
    return "flat";
  }
  if (end - start > flatThreshold) return "rising";
  if (start - end > flatThreshold) return "falling";
  return "unclear";
}

function average(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

export const TONE_TO_EXPECTED_SHAPE: Record<Tone, ToneShape> = {
  1: "flat",
  2: "rising",
  3: "dipping",
  4: "falling",
  5: "flat",
};

export type ToneVerdict = {
  detectedShape: ToneShape;
  expectedShape: ToneShape;
  match: boolean;
  confidence: "low" | "medium" | "high";
};

export function scoreTone(contour: PitchPoint[], expectedTone: Tone): ToneVerdict {
  const detectedShape = classifyContourShape(contour);
  const expectedShape = TONE_TO_EXPECTED_SHAPE[expectedTone];
  const core = trimToVoicedCore(contour);
  const confidence: ToneVerdict["confidence"] =
    core.length < 6 ? "low" : core.length < 12 ? "medium" : "high";
  return {
    detectedShape,
    expectedShape,
    match: detectedShape === expectedShape && detectedShape !== "unclear",
    confidence,
  };
}
