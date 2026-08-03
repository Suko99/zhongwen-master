"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { StreakBadge } from "@/components/StreakBadge";

const LINKS = [
  { href: "/", label: "Aujourd'hui" },
  { href: "/lesson", label: "Leçon" },
  { href: "/review", label: "Révisions" },
  { href: "/professeur", label: "Professeur" },
  { href: "/graphe", label: "Graphe" },
  { href: "/labo-vocal", label: "Labo vocal" },
  { href: "/lecture", label: "Lecture" },
  { href: "/conversation", label: "Conversation" },
];

export function NavLinks() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border sm:hidden"
      >
        <span className="sr-only">Menu</span>
        <div className="flex flex-col gap-1">
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
          <span className="block h-0.5 w-4 bg-current" />
        </div>
      </button>

      <div className="hidden items-center gap-4 text-sm text-muted sm:flex sm:gap-5">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-accent">
            {link.label}
          </Link>
        ))}
        <Suspense fallback={null}>
          <StreakBadge />
        </Suspense>
      </div>

      {open && (
        <div className="flex w-full flex-col gap-3 border-t border-border pt-3 text-sm text-muted sm:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Suspense fallback={null}>
            <StreakBadge />
          </Suspense>
        </div>
      )}
    </>
  );
}
