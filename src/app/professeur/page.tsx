import { ProfessorPanel } from "./ProfessorPanel";

export const dynamic = "force-dynamic";

export default function ProfessorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Professeur</h1>
        <p className="mt-1 text-sm text-muted">
          Posez n&apos;importe quelle question sur le mandarin — grammaire,
          caractère, nuance. La réponse s&apos;appuie sur votre niveau et votre
          vocabulaire acquis.
        </p>
      </div>
      <ProfessorPanel />
    </div>
  );
}
