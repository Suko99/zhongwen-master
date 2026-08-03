import { getUser } from "@/lib/user";
import { buildGraph } from "@/lib/graph";
import { ConstellationClient } from "./ConstellationClient";

export const dynamic = "force-dynamic";

export default async function GraphePage() {
  const user = await getUser();
  const { nodes, edges } = await buildGraph(user.id);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Graphe cognitif</h1>
        <p className="mt-1 text-sm text-muted">
          Vos connaissances ne sont pas des cartes isolées : chaque caractère
          est relié à sa famille, son radical, ses contrastes. La couleur montre
          votre maîtrise. Cliquez un caractère pour ouvrir sa fiche.
        </p>
      </div>

      {nodes.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
          Le graphe se construit à mesure que vous avancez. Terminez une leçon
          pour voir apparaître vos premières connexions.
        </p>
      ) : (
        <ConstellationClient nodes={nodes} edges={edges} />
      )}
    </div>
  );
}
