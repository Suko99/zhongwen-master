import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { NavLinks } from "@/components/NavLinks";
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
            <NavLinks
              streakBadge={
                <Suspense fallback={null}>
                  <StreakBadge />
                </Suspense>
              }
            />
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
