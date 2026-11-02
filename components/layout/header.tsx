"use client";

import Link from "next/link";
import { useState } from "react";

/*
  Header per docs/DESIGN_SYSTEM.md: logo (placeholder wordmark), tool menu,
  pricing, learn, login. The mobile menu is a full list, not a dropdown, so
  it works without hover on touch devices.
*/

const qrTypes = [
  { slug: "url", label: "URL" },
  { slug: "text", label: "Text" },
  { slug: "email", label: "Email" },
  { slug: "phone", label: "Phone" },
  { slug: "sms", label: "SMS" },
  { slug: "wifi", label: "Wi-Fi" },
  { slug: "vcard", label: "vCard" },
  { slug: "location", label: "Location" },
  { slug: "event", label: "Calendar event" },
  { slug: "upi", label: "UPI payment" },
  { slug: "review", label: "Google review" },
  { slug: "social", label: "Social profile" },
  { slug: "app-store", label: "App store" },
];

const desktopNavLink = "min-h-11 rounded-lg px-4 py-2 text-body text-text hover:bg-surface";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  function closeMenus() {
    setMenuOpen(false);
    setToolsOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2 md:px-6"
      >
        <Link
          href="/"
          className="min-h-11 rounded-lg px-4 py-2 text-body font-semibold tracking-tight text-text"
          onClick={closeMenus}
        >
          Signet
          <span className="sr-only">, the honest QR code generator</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
            <button
              type="button"
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              onClick={() => setToolsOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setToolsOpen(false);
              }}
              className={desktopNavLink + " cursor-pointer"}
            >
              QR tools
              <span aria-hidden="true" className="ml-1 inline-block">
                ▸
              </span>
            </button>
            {toolsOpen ? (
              <ul
                className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-border bg-surface-raised p-2 shadow-md"
                aria-label="QR types"
              >
                {qrTypes.map((type) => (
                  <li key={type.slug}>
                    <Link
                      href={`/tools/${type.slug}`}
                      onClick={closeMenus}
                      className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text hover:bg-surface"
                    >
                      {type.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Link href="/pricing" className={desktopNavLink}>
            Pricing
          </Link>
          <Link href="/learn" className={desktopNavLink}>
            Learn
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/login" className="min-h-11 rounded-lg px-4 py-2 text-body font-medium text-primary">
            Log in
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-text transition-colors hover:bg-primary-hover active:bg-primary-hover"
          >
            Create a QR code
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-surface-raised px-4 text-body text-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="space-y-1">
            <li>
              <details className="rounded-lg">
                <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg px-4 py-2 text-body text-text after:content-['']">
                  QR tools
                  <span aria-hidden="true" className="ml-1">
                    ▸
                  </span>
                </summary>
                <ul className="ml-4 space-y-1 border-l border-border pl-4">
                  {qrTypes.map((type) => (
                    <li key={type.slug}>
                      <Link
                        href={`/tools/${type.slug}`}
                        onClick={closeMenus}
                        className="flex min-h-11 items-center py-2 text-body text-text-muted"
                      >
                        {type.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <Link
                href="/pricing"
                onClick={closeMenus}
                className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/learn"
                onClick={closeMenus}
                className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body text-text"
              >
                Learn
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                onClick={closeMenus}
                className="flex min-h-11 items-center rounded-lg px-4 py-2 text-body font-medium text-primary"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                href="/"
                onClick={closeMenus}
                className="mt-2 flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-text"
              >
                Create a QR code
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
