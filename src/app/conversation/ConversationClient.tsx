"use client";

import { useEffect, useRef, useState } from "react";
import { clearConversationAction, converseAction, loadConversationAction } from "@/app/ai-actions";
import { HanziText } from "@/components/HanziText";
import { SpeakButton } from "@/components/SpeakButton";
import { isSpeechRecognitionSupported, recognizeSpeech } from "@/lib/speechRecognition";
import { isSpeechSynthesisSupported, speakText } from "@/lib/textToSpeech";
import { NEURAL_VOICES } from "@/lib/voices";
import type { ConversationTurn } from "@/lib/ai";

type DisplayMessage = {
  role: "user" | "assistant";
  text: string;
  pinyin?: string;
  translation?: string;
  correction?: string | null;
};

type LiveState = "idle" | "listening" | "thinking" | "speaking" | "paused";

const MIC_TIMEOUT_MS = 15000; // limite de sécurité absolue — le vrai temps d'attente est géré par silenceMs dans recognizeSpeech
const MAX_CONSECUTIVE_SILENCE = 3;

export function ConversationClient() {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [busy, setBusy] = useState(false); // envoi texte ponctuel (hors mode direct)

  const [liveState, setLiveState] = useState<LiveState>("idle");
  const liveActiveRef = useRef(false);
  const historyRef = useRef<ConversationTurn[]>([]);
  const silenceCountRef = useRef(0);

  // Le micro n'écoute qu'une langue à la fois (limite de la Web Speech API,
  // aucune détection automatique possible) : par défaut le chinois, mais on
  // peut basculer en français quand on cherche ses mots, pour que le micro
  // comprenne réellement au lieu d'essayer de "lire" du français en chinois.
  const [sttLang, setSttLang] = useState<"zh-CN" | "fr-FR">("zh-CN");
  const sttLangRef = useRef(sttLang);
  useEffect(() => {
    sttLangRef.current = sttLang;
  }, [sttLang]);

  const [micSupported, setMicSupported] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  useEffect(() => {
    const detectSupport = () => {
      setMicSupported(isSpeechRecognitionSupported());
      setVoiceSupported(isSpeechSynthesisSupported());
    };
    detectSupport();
  }, []);

  // Mémoire persistante : recharge les derniers échanges enregistrés en base
  // au montage, pour que 小龙 se souvienne d'une session à l'autre (pas
  // seulement pendant que l'onglet reste ouvert).
  useEffect(() => {
    const loadHistory = async () => {
      const result = await loadConversationAction();
      if (result.ok && result.data.length > 0) {
        setMessages(result.data);
        historyRef.current = result.data.map((m) => ({ role: m.role, content: m.text }));
      }
    };
    loadHistory();
  }, []);

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envoie un message et renvoie la réponse (texte) une fois reçue — utilisé
  // à la fois par l'envoi ponctuel (texte/un seul 🎙️) et par la boucle en
  // direct, qui a besoin d'attendre la réponse avant de reparler.
  const sendMessage = async (message: string): Promise<string | null> => {
    const trimmed = message.trim();
    if (!trimmed) return null;
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);

    const result = await converseAction(historyRef.current, trimmed);
    if (!result.ok) {
      setError(result.error);
      return null;
    }
    const { reply, pinyin, translation, correction } = result.data;
    setMessages((prev) => {
      const next = [...prev];
      if (correction) {
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].role === "user") {
            next[i] = { ...next[i], correction };
            break;
          }
        }
      }
      return [...next, { role: "assistant", text: reply, pinyin, translation }];
    });
    historyRef.current = [
      ...historyRef.current,
      { role: "user", content: trimmed },
      { role: "assistant", content: reply },
    ];
    return reply;
  };

  // Envoi ponctuel (formulaire texte / un seul appui micro hors mode direct).
  const sendOnce = (message: string) => {
    setInput("");
    setBusy(true);
    sendMessage(message).then((reply) => {
      setBusy(false);
      if (reply && autoSpeak) speakText(reply, undefined, NEURAL_VOICES.conversationPartner);
    });
  };

  // Boucle "conversation en direct" : écoute → envoie → parle → réécoute,
  // sans que l'utilisateur ait à recliquer à chaque tour, comme un appel.
  const liveCycle = async () => {
    if (!liveActiveRef.current) return;
    setLiveState("listening");
    const result = await recognizeSpeech(MIC_TIMEOUT_MS, sttLangRef.current);
    if (!liveActiveRef.current) return;

    if (!result || !result.transcript.trim()) {
      silenceCountRef.current++;
      if (silenceCountRef.current >= MAX_CONSECUTIVE_SILENCE) {
        liveActiveRef.current = false;
        setLiveState("paused");
        setError("Conversation mise en pause — je n'entendais plus rien. Cliquez pour reprendre.");
        return;
      }
      liveCycle();
      return;
    }
    silenceCountRef.current = 0;

    setLiveState("thinking");
    const reply = await sendMessage(result.transcript);
    if (!liveActiveRef.current) return;

    if (!reply) {
      // Erreur IA : on retente l'écoute plutôt que de couper l'appel.
      liveCycle();
      return;
    }

    setLiveState("speaking");
    speakText(
      reply,
      {
        onEnd: () => {
          if (liveActiveRef.current) liveCycle();
        },
      },
      NEURAL_VOICES.conversationPartner
    );
  };

  const startLive = () => {
    setError(null);
    silenceCountRef.current = 0;
    liveActiveRef.current = true;
    liveCycle();
  };

  const stopLive = () => {
    liveActiveRef.current = false;
    setLiveState("idle");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const reset = () => {
    stopLive();
    setMessages([]);
    historyRef.current = [];
    setError(null);
    clearConversationAction();
  };

  const liveOn = liveState !== "idle" && liveState !== "paused";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>
          {voiceSupported
            ? autoSpeak
              ? "🔊 Lecture automatique activée"
              : "🔇 Lecture automatique coupée"
            : "Synthèse vocale indisponible sur cet appareil"}
        </span>
        <div className="flex gap-3">
          {voiceSupported && (
            <button onClick={() => setAutoSpeak((v) => !v)} className="hover:text-accent">
              {autoSpeak ? "Couper le son" : "Activer le son"}
            </button>
          )}
          {messages.length > 0 && (
            <button onClick={reset} className="hover:text-accent">
              Effacer la conversation
            </button>
          )}
        </div>
      </div>

      {micSupported && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-6">
          <LiveOrb state={liveState} />
          <p className="text-sm font-semibold">
            {liveState === "listening" && "Je t'écoute…"}
            {liveState === "thinking" && "小龙 réfléchit…"}
            {liveState === "speaking" && "小龙 parle…"}
            {liveState === "paused" && "En pause"}
            {liveState === "idle" && "Conversation en direct"}
          </p>
          <button
            onClick={liveOn ? stopLive : startLive}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 ${
              liveOn ? "bg-warning" : "bg-accent"
            }`}
          >
            {liveOn ? "⏹ Terminer l'appel" : "📞 Démarrer la conversation en direct"}
          </button>
          <button
            onClick={() => setSttLang((l) => (l === "zh-CN" ? "fr-FR" : "zh-CN"))}
            title="Le micro n'écoute qu'une langue à la fois — basculez si vous cherchez vos mots en français"
            className="text-xs text-muted hover:text-accent"
          >
            {sttLang === "zh-CN" ? "🎙️ Micro en chinois — passer en français" : "🎙️ Micro en français — repasser en chinois"}
          </button>
        </div>
      )}

      <div className="flex min-h-[16rem] flex-col gap-3 rounded-xl border border-border bg-card p-5">
        {messages.length === 0 && (
          <p className="m-auto max-w-sm text-center text-sm text-muted">
            Dites bonjour pour commencer — 你好！ Démarrez la conversation en
            direct ci-dessus, ou tapez un message plus bas.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "self-end" : "self-start"}>
            <div
              className={`max-w-sm rounded-2xl px-4 py-2.5 ${
                m.role === "user"
                  ? "bg-accent text-white"
                  : "border border-border bg-background"
              }`}
            >
              <HanziText text={m.text} className="text-lg" />
              {m.role === "assistant" && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <span>
                    {m.pinyin} — {m.translation}
                  </span>
                  <SpeakButton text={m.text} size="sm" voice={NEURAL_VOICES.conversationPartner} />
                </div>
              )}
            </div>
            {m.correction && (
              <p className="mt-1 max-w-sm text-right text-xs text-warning">
                💡 {m.correction}
              </p>
            )}
          </div>
        ))}
        {(busy || liveState === "thinking") && (
          <div className="self-start rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-muted">
            …
          </div>
        )}
        {error && (
          <div className="self-center rounded-lg border border-warning bg-card px-4 py-2 text-sm text-warning">
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendOnce(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={liveOn ? "Conversation en direct en cours…" : "Écrivez en chinois…"}
          disabled={liveOn}
          className="hanzi flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-lg outline-none focus:border-accent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || liveOn || !input.trim()}
          className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

// Indicateur visuel d'activité : un cercle dont le style change selon l'état
// (écoute / réflexion / parole) — pour que l'échange se sente vivant, pas
// juste des bulles de texte qui apparaissent.
function LiveOrb({ state }: { state: LiveState }) {
  const ringClass =
    state === "listening"
      ? "border-accent animate-pulse"
      : state === "speaking"
        ? "border-success"
        : state === "thinking"
          ? "border-warning"
          : "border-border";

  return (
    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-colors duration-300 ${ringClass}`}>
      {state === "speaking" && (
        <span className="absolute inset-0 rounded-full border-4 border-success/40 animate-ping" />
      )}
      {state === "listening" && (
        <span className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
      )}
      <span className="text-3xl">
        {state === "listening" && "🎙️"}
        {state === "thinking" && "💭"}
        {state === "speaking" && "🗣️"}
        {(state === "idle" || state === "paused") && "😊"}
      </span>
    </div>
  );
}
