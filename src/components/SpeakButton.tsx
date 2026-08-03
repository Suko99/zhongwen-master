"use client";

import { useEffect, useState } from "react";
import { isSpeechSynthesisSupported, speakText } from "@/lib/textToSpeech";

// Audio gratuit : voix neuronale (service en ligne d'Edge) en priorité,
// repli sur la voix système du navigateur si le service est indisponible.
// Ne dépend plus d'une voix installée localement — toujours affiché une
// fois monté côté client.
export function SpeakButton({
  text,
  className = "",
  size = "md",
  voice,
}: {
  text: string;
  className?: string;
  size?: "sm" | "md";
  voice?: string;
}) {
  // Toujours `false` au premier rendu (y compris côté serveur, où `window`
  // n'existe pas) pour que l'hydratation client corresponde exactement au
  // HTML serveur. L'effet ci-dessous active le bouton une fois monté.
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const detectSupport = () => setSupported(isSpeechSynthesisSupported());
    detectSupport();
  }, []);

  const speak = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    speakText(
      text,
      {
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      },
      voice
    );
  };

  if (!supported) return null;

  return (
    <button
      onClick={speak}
      aria-label="Écouter la prononciation"
      title="Écouter"
      className={`inline-flex items-center justify-center rounded-full text-muted transition hover:bg-accent-soft hover:text-accent ${
        size === "sm" ? "h-6 w-6 text-sm" : "h-8 w-8"
      } ${speaking ? "animate-pulse text-accent" : ""} ${className}`}
    >
      🔊
    </button>
  );
}
