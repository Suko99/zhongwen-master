"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GraphNode, GraphEdge } from "@/lib/graph";

type Positioned = GraphNode & { x: number; y: number; vx: number; vy: number };

const STATE_FILL: Record<GraphNode["state"], string> = {
  mastered: "var(--success)",
  fragile: "var(--warning)",
  due: "var(--accent)",
  unknown: "var(--card)",
};

const STATE_LABEL: Record<GraphNode["state"], string> = {
  mastered: "Maîtrisé",
  fragile: "Fragile",
  due: "À réviser",
  unknown: "Pas encore appris",
};

const ALL_STATES: GraphNode["state"][] = ["mastered", "fragile", "due", "unknown"];

// Le pinyin est stocké avec les tons (ài, hái…) : une recherche "ai" tapée
// sans accent ne matchait jamais rien en comparaison brute. On compare donc
// après avoir retiré les diacritiques des deux côtés.
function stripTones(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Surface "idéale" allouée par nœud (px²), utilisée uniquement pour calibrer
// la distance de répulsion k — pas comme boîte de rendu (voir plus bas).
const AREA_PER_NODE = 5200;
const MARGIN = 40;
const BASE_W = 900; // taille plancher, pour ne pas rétrécir un petit graphe
const BASE_H = 620;

// Layout force-dirigé déterministe (Fruchterman-Reingold, formule standard),
// calculé une fois au montage.
//
// Point important : PAS de bordure rigide pendant la simulation. La
// première version clampait chaque nœud dans une boîte fixe à chaque
// itération — dès qu'un nœud touchait un bord (ce qui arrive vite avec la
// répulsion cumulée de centaines de nœuds), il y restait collé, rien ne
// l'en repoussait. Résultat : la quasi-totalité des nœuds s'entassaient
// contre les bords au lieu de se répartir. La bonne approche : laisser le
// système se stabiliser librement dans le plan (une légère gravité vers le
// centre suffit à contenir les nœuds isolés sans arête), puis, une fois la
// simulation terminée, cadrer le rendu sur la boîte englobante réelle.
function layout(nodes: GraphNode[], edges: GraphEdge[]): Positioned[] {
  const n = Math.max(nodes.length, 1);
  const idx = new Map(nodes.map((node, i) => [node.id, i]));
  const k = Math.sqrt(AREA_PER_NODE); // distance idéale entre nœuds
  const spreadRadius = (k * Math.sqrt(n)) / 2;
  const pos: Positioned[] = nodes.map((node, i) => {
    const a = (i / n) * Math.PI * 2;
    return { ...node, x: Math.cos(a) * spreadRadius, y: Math.sin(a) * spreadRadius, vx: 0, vy: 0 };
  });

  const links = edges
    .map((e) => ({ s: idx.get(e.from), t: idx.get(e.to) }))
    .filter((l): l is { s: number; t: number } => l.s !== undefined && l.t !== undefined);

  const iterations = 300;
  const initialTemp = k * 2;

  for (let iter = 0; iter < iterations; iter++) {
    const temp = initialTemp * (1 - iter / iterations);
    const dispX = new Array(n).fill(0);
    const dispY = new Array(n).fill(0);

    // Répulsion entre tous les nœuds : f_r(d) = k² / d
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        let dx = pos[i].x - pos[j].x;
        let dy = pos[i].y - pos[j].y;
        let d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.01) {
          dx = Math.random() - 0.5;
          dy = Math.random() - 0.5;
          d = 0.01;
        }
        const rep = (k * k) / d;
        const ux = (dx / d) * rep;
        const uy = (dy / d) * rep;
        dispX[i] += ux;
        dispY[i] += uy;
        dispX[j] -= ux;
        dispY[j] -= uy;
      }
    }
    // Attraction le long des arêtes : f_a(d) = d² / k
    for (const { s, t } of links) {
      let dx = pos[s].x - pos[t].x;
      let dy = pos[s].y - pos[t].y;
      let d = Math.sqrt(dx * dx + dy * dy);
      if (d < 0.01) d = 0.01;
      const att = (d * d) / k;
      const ux = (dx / d) * att;
      const uy = (dy / d) * att;
      dispX[s] -= ux;
      dispY[s] -= uy;
      dispX[t] += ux;
      dispY[t] += uy;
    }
    // Gravité vers le centre (surtout utile aux nœuds sans arête, que rien
    // d'autre n'attire) — pas de mur, juste une préférence. Le coefficient
    // est calibré empiriquement (voir tests) : trop faible, la répulsion
    // cumulée de centaines de nœuds fait exploser l'aire du graphe bien
    // au-delà de l'espacement voulu (aire ≈ 370x la cible à 0.01) ; à 4,
    // l'aire finale colle à la cible sans réintroduire d'entassement.
    for (let i = 0; i < pos.length; i++) {
      dispX[i] += -pos[i].x * 4;
      dispY[i] += -pos[i].y * 4;
    }
    // Déplacement borné par la température (refroidit à chaque itération),
    // aucune contrainte de position : le système trouve sa propre étendue.
    for (let i = 0; i < pos.length; i++) {
      const d = Math.sqrt(dispX[i] * dispX[i] + dispY[i] * dispY[i]) || 0.01;
      const capped = Math.min(d, temp);
      pos[i].x += (dispX[i] / d) * capped;
      pos[i].y += (dispY[i] / d) * capped;
    }
  }

  // Cadrage final : translation pour que tout soit positif, sur la boîte
  // englobante réelle des positions obtenues (+ marge), pas une taille
  // devinée à l'avance.
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  for (const p of pos) {
    p.x = p.x - minX + MARGIN;
    p.y = p.y - minY + MARGIN;
  }
  return pos;
}

export function Constellation({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [hiddenStates, setHiddenStates] = useState<Set<GraphNode["state"]>>(new Set());
  const svgRef = useRef<SVGSVGElement>(null);
  const positioned = useMemo(() => layout(nodes, edges), [nodes, edges]);
  const posById = useMemo(
    () => new Map(positioned.map((p) => [p.id, p])),
    [positioned]
  );
  const W = Math.max(BASE_W, ...positioned.map((p) => p.x + MARGIN));
  const H = Math.max(BASE_H, ...positioned.map((p) => p.y + MARGIN));

  const q = stripTones(query.trim().toLowerCase());
  const matches = useMemo(() => {
    if (!q) return null; // pas de recherche active
    return new Set(
      positioned
        .filter(
          (n) =>
            n.id.includes(query.trim()) ||
            stripTones((n.pinyin ?? "").toLowerCase()).includes(q)
        )
        .map((n) => n.id)
    );
  }, [positioned, q, query]);

  // Vue (zoom/pan) : une fenêtre dans le grand plan du graphe, appliquée
  // directement au DOM (pas via l'état React) pour rester fluide même avec
  // des centaines de nœuds — un setState par pixel de glissement ferait
  // rerendre tout le SVG à chaque frame.
  const viewRef = useRef({ x: 0, y: 0, w: W, h: H });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; dragging: boolean } | null>(null);

  const applyViewBox = () => {
    const v = viewRef.current;
    svgRef.current?.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`);
  };

  useEffect(() => {
    viewRef.current = { x: 0, y: 0, w: W, h: H };
    applyViewBox();
  }, [W, H]);

  const zoomAt = (factor: number, clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const v = viewRef.current;
    const px = v.x + ((clientX - rect.left) / rect.width) * v.w;
    const py = v.y + ((clientY - rect.top) / rect.height) * v.h;
    const newW = Math.min(Math.max(v.w * factor, W * 0.08), W * 1.5);
    const newH = Math.min(Math.max(v.h * factor, H * 0.08), H * 1.5);
    viewRef.current = {
      x: px - ((px - v.x) / v.w) * newW,
      y: py - ((py - v.y) / v.h) * newH,
      w: newW,
      h: newH,
    };
    applyViewBox();
  };

  // `onWheel` de React est passif par défaut (perf) : preventDefault() n'y
  // bloque pas le scroll de la page. Écouteur natif non-passif requis pour
  // que la molette zoome le graphe sans faire défiler la page en dessous.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY);
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [W, H]);

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: viewRef.current.x,
      origY: viewRef.current.y,
      dragging: false,
    };
    svgRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dxPx = e.clientX - d.startX;
    const dyPx = e.clientY - d.startY;
    if (Math.abs(dxPx) > 3 || Math.abs(dyPx) > 3) d.dragging = true;
    if (!d.dragging) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const v = viewRef.current;
    viewRef.current = {
      ...v,
      x: d.origX - dxPx * (v.w / rect.width),
      y: d.origY - dyPx * (v.h / rect.height),
    };
    applyViewBox();
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };
  const resetView = () => {
    viewRef.current = { x: 0, y: 0, w: W, h: H };
    applyViewBox();
  };
  const zoomButton = (factor: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  // Recentre et zoome sur un nœud précis (résultat de recherche).
  const focusOn = (id: string) => {
    const pos = posById.get(id);
    if (!pos) return;
    const size = Math.min(W, H) * 0.22;
    viewRef.current = { x: pos.x - size / 2, y: pos.y - size / 2, w: size, h: size };
    applyViewBox();
  };

  // Résultat unique : on y va directement, pas besoin d'appuyer sur Entrée.
  useEffect(() => {
    if (matches && matches.size === 1) focusOn([...matches][0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  const toggleState = (state: GraphNode["state"]) => {
    setHiddenStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) next.delete(state);
      else next.add(state);
      return next;
    });
  };

  // Les arêtes reliées au nœud survolé sont mises en évidence.
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 text-xs">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches && matches.size > 0) focusOn([...matches][0]);
          }}
          placeholder="Rechercher un caractère ou un pinyin…"
          className="hanzi min-w-[10rem] flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-accent"
        />
        {matches && (
          <span className="text-muted">
            {matches.size} résultat{matches.size > 1 ? "s" : ""}
          </span>
        )}
        <div className="flex flex-wrap gap-2">
          {ALL_STATES.map((state) => {
            const off = hiddenStates.has(state);
            return (
              <button
                key={state}
                onClick={() => toggleState(state)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition ${
                  off ? "border-border text-muted opacity-50" : "border-border"
                }`}
                title={off ? "Masqué — cliquer pour réafficher" : "Cliquer pour masquer"}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-border"
                  style={{ background: STATE_FILL[state] }}
                />
                {STATE_LABEL[state]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative h-[70vh] overflow-hidden rounded-xl border border-border bg-card">
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => zoomButton(1 / 1.4)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-lg leading-none shadow-sm hover:bg-accent-soft"
            title="Zoomer"
          >
            +
          </button>
          <button
            onClick={() => zoomButton(1.4)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-lg leading-none shadow-sm hover:bg-accent-soft"
            title="Dézoomer"
          >
            −
          </button>
          <button
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-xs shadow-sm hover:bg-accent-soft"
            title="Réinitialiser la vue"
          >
            ⟲
          </button>
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ cursor: dragRef.current?.dragging ? "grabbing" : "grab", touchAction: "none" }}
        >
          {edges.map((e, i) => {
            const a = posById.get(e.from);
            const b = posById.get(e.to);
            if (!a || !b) return null;
            const active = hover === e.from || hover === e.to;
            const dimmed =
              hiddenStates.has(a.state) ||
              hiddenStates.has(b.state) ||
              (matches !== null && (!matches.has(a.id) || !matches.has(b.id)));
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "var(--accent)" : "var(--border)"}
                strokeWidth={active ? 1.6 : 0.8}
                opacity={dimmed ? 0.06 : active ? 0.9 : 0.4}
                className="graph-fade-in"
                style={{ transition: "opacity 0.4s" }}
              />
            );
          })}
          {positioned.map((n) => {
            const r = n.isHanzi ? 18 : 14;
            const active = hover === n.id;
            const dimmed = hiddenStates.has(n.state) || (matches !== null && !matches.has(n.id));
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() =>
                  n.isHanzi && router.push(`/hanzi/${encodeURIComponent(n.id)}`)
                }
                style={{
                  cursor: n.isHanzi ? "pointer" : "default",
                  pointerEvents: dimmed ? "none" : "auto",
                  opacity: dimmed ? 0.08 : 1,
                  transition: "opacity 0.3s",
                }}
                className="graph-fade-in"
              >
                <circle
                  r={r}
                  fill={STATE_FILL[n.state]}
                  stroke={
                    active
                      ? "var(--accent)"
                      : matches?.has(n.id)
                        ? "var(--accent)"
                        : "var(--border)"
                  }
                  strokeWidth={active || matches?.has(n.id) ? 2.5 : 1}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={n.isHanzi ? 16 : 11}
                  className="hanzi"
                  fill={
                    n.state === "unknown" ? "var(--foreground)" : "#fff"
                  }
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
