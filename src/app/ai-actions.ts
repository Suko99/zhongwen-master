"use server";

import {
  askProfessor,
  correctProduction,
  converse,
  segmentText,
  type ConversationReply,
  type ConversationTurn,
  type CorrectionResult,
  type ProfessorAnswer,
  type ReaderToken,
} from "@/lib/ai";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";

// Enveloppe commune : les erreurs (clé absente, API down, JSON invalide)
// remontent comme messages lisibles plutôt qu'en écran d'erreur Next.
type AiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function safely<T>(fn: () => Promise<T>): Promise<AiResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    const message =
      e instanceof SyntaxError
        ? "L'IA a renvoyé une réponse mal formée — réessayez."
        : e instanceof Error
          ? e.message
          : "Erreur inattendue.";
    return { ok: false, error: message };
  }
}

export async function askProfessorAction(
  question: string
): Promise<AiResult<ProfessorAnswer>> {
  const trimmed = question.trim();
  if (!trimmed) return { ok: false, error: "Posez une question d'abord." };
  return safely(() => askProfessor(trimmed.slice(0, 500)));
}

export async function correctProductionAction(
  instruction: string,
  attempt: string
): Promise<AiResult<CorrectionResult>> {
  const trimmed = attempt.trim();
  if (!trimmed)
    return { ok: false, error: "Écrivez votre phrase avant de la faire corriger." };
  return safely(() => correctProduction(instruction, trimmed.slice(0, 500)));
}

export type ReaderWord = ReaderToken & { known: boolean };

// La segmentation (pinyin/sens) vient de l'IA ; le statut "connu" vient de
// l'état réel de l'utilisateur en base — jamais de l'IA, qui ne sait pas ce
// qu'il a réellement révisé.
export async function segmentTextAction(
  text: string
): Promise<AiResult<ReaderWord[]>> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "Collez un texte à lire d'abord." };

  return safely(async () => {
    const [tokens, user] = [await segmentText(trimmed), await getUser()];
    const progress = await prisma.userProgress.findMany({
      where: { userId: user.id, nodeType: { in: ["WORD", "HANZI"] } },
      include: { vocab: true, hanzi: true },
    });
    const known = new Set(
      progress.map((p) => p.vocab?.word ?? p.hanzi?.character).filter(Boolean)
    );
    return tokens.map((t) => ({ ...t, known: known.has(t.text) }));
  });
}

export async function converseAction(
  history: ConversationTurn[],
  message: string
): Promise<AiResult<ConversationReply>> {
  const trimmed = message.trim();
  if (!trimmed) return { ok: false, error: "Dites quelque chose d'abord." };
  return safely(async () => {
    const reply = await converse(history, trimmed);
    const user = await getUser();
    await prisma.conversationMessage.createMany({
      data: [
        { userId: user.id, role: "user", content: trimmed },
        {
          userId: user.id,
          role: "assistant",
          content: reply.reply,
          pinyin: reply.pinyin,
          translation: reply.translation,
          correction: reply.correction,
        },
      ],
    });
    return reply;
  });
}

export type StoredMessage = {
  role: "user" | "assistant";
  text: string;
  pinyin?: string;
  translation?: string;
  correction?: string | null;
};

// Mémoire persistante : on ne recharge pas tout l'historique (coût, bruit),
// juste assez pour que 小龙 se souvienne des derniers échanges au-delà de la
// session en cours (PRD §9 — "un(e) ami(e)", pas un chat qui repart de zéro).
const HISTORY_LOAD_LIMIT = 30;

export async function loadConversationAction(): Promise<AiResult<StoredMessage[]>> {
  return safely(async () => {
    const user = await getUser();
    const rows = await prisma.conversationMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LOAD_LIMIT,
    });
    rows.reverse();
    return rows.map((r) => ({
      role: r.role as "user" | "assistant",
      text: r.content,
      pinyin: r.pinyin ?? undefined,
      translation: r.translation ?? undefined,
      correction: r.correction,
    }));
  });
}

export async function clearConversationAction(): Promise<AiResult<null>> {
  return safely(async () => {
    const user = await getUser();
    await prisma.conversationMessage.deleteMany({ where: { userId: user.id } });
    return null;
  });
}
