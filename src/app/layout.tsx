import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { StreakBadge } from "@/components/StreakBadge";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zhongwen Master",
  description: "Don't learn Chinese. Learn to think in Chinese.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <nav className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="hanzi text-xl font-bold text-accent">中文</span>
              <span className="text-sm font-semibold tracking-wide">
                Zhongwen Master
              </span>
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted sm:gap-5">
              <Link href="/" className="hover:text-accent">
                Aujourd&apos;hui
              </Link>
              <Link href="/lesson" className="hover:text-accent">
                Leçon
              </Link>
              <Link href="/review" className="hover:text-accent">
                Révisions
              </Link>
              <Link href="/professeur" className="hover:text-accent">
                Professeur
              </Link>
              <Link href="/graphe" className="hover:text-accent">
                Graphe
              </Link>
              <Link href="/labo-vocal" className="hover:text-accent">
                Labo vocal
              </Link>
              <Link href="/lecture" className="hover:text-accent">
                Lecture
              </Link>
              <Link href="/conversation" className="hover:text-accent">
                Conversation
              </Link>
              <Suspense fallback={null}>
                <StreakBadge />
              </Suspense>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
