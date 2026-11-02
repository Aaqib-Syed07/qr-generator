import Link from "next/link";
import type { ReactNode } from "react";

/*
  Dashboard chrome for Phase 0. Signed in area: no ads, no marketing nav.
  Real auth arrives in Phase 2, so Account and Log out are placeholder
  links.
*/

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 md:px-6">
          <Link
            href="/dashboard"
            className="min-h-11 rounded-lg px-4 py-2 text-body font-semibold text-text"
          >
            Signet
            <span className="sr-only">, dashboard home</span>
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text hover:bg-surface-raised"
            >
              My codes
            </Link>
            <Link
              href="/pricing"
              className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text hover:bg-surface-raised"
            >
              Plan: Free
            </Link>
            <Link
              href="/login"
              className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text-muted hover:bg-surface-raised"
            >
              Log out
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        {children}
      </main>
    </>
  );
}
