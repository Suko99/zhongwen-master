import "server-only";
import { EdgeTTS } from "edge-tts-universal";
import { NEURAL_VOICES } from "./voices";

// Voix neuronales gratuites via le service en ligne d'Edge (le moteur
// derrière "Lire à voix haute") — MÊME qualité que les voix Azure Neural
// payantes, sans clé API. Point d'accès non officiel de Microsoft : peut
// casser un jour, d'où le repli systématique vers la voix système du
// navigateur (voir src/lib/textToSpeech.ts) si cet appel échoue.
const MAX_TTS_TEXT = 500;

export async function synthesizeSpeech(
  text: string,
  voice: string = NEURAL_VOICES.default
): Promise<string> {
  const trimmed = text.trim().slice(0, MAX_TTS_TEXT);
  if (!trimmed) throw new Error("Texte vide.");

  const tts = new EdgeTTS(trimmed, voice, { rate: "-8%" }); // légèrement ralenti, pour l'apprentissage
  const { audio } = await tts.synthesize();
  const buffer = Buffer.from(await audio.arrayBuffer());
  return buffer.toString("base64");
}
