import { ReaderClient } from "./ReaderClient";

export default function LecturePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Smart Reader</h1>
        <p className="mt-1 text-sm text-muted">
          Collez un texte chinois : les mots que vous connaissez déjà
          restent en texte simple, les mots inconnus sont soulignés — cliquez
          pour voir le pinyin et le sens.
        </p>
      </div>
      <ReaderClient />
    </div>
  );
}
