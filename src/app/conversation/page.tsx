import { ConversationClient } from "./ConversationClient";

export default function ConversationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Conversation IA</h1>
        <p className="mt-1 text-sm text-muted">
          Parlez ou écrivez en chinois — l&apos;IA répond, relance la
          discussion, et lit sa réponse à voix haute. Les erreurs sont
          notées en aparté, sans casser le fil de l&apos;échange.
        </p>
      </div>
      <ConversationClient />
    </div>
  );
}
