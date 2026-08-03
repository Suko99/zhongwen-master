"use client";

import dynamic from "next/dynamic";
import type { GraphNode, GraphEdge } from "@/lib/graph";

// Le layout force-dirigé (400 itérations de calcul flottant) n'est PAS
// déterministe au bit près entre le moteur JS du serveur et celui du
// navigateur : rendu côté serveur, ça provoque un mismatch d'hydratation.
// `ssr: false` (utilisable uniquement depuis un composant client) évite
// que le calcul tourne jamais côté serveur.
const Constellation = dynamic(
  () => import("./Constellation").then((m) => m.Constellation),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-xl border border-border bg-card text-sm text-muted">
        Calcul du graphe…
      </div>
    ),
  }
);

export function ConstellationClient({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  return <Constellation nodes={nodes} edges={edges} />;
}
