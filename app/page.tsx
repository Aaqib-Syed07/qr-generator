import { ThemeToggle } from "@/components/theme-toggle";

/*
  P0-2 working surface: shows every design token next to its use so both
  themes can be checked in one place. The real home screen with the
  generator arrives in P0-5 on top of these tokens.
  The name "Signet" is a working placeholder until the owner confirms it.
*/

const colorTokens = [
  { name: "--background", className: "bg-background", use: "Page" },
  { name: "--surface", className: "bg-surface", use: "Cards, panels" },
  {
    name: "--surface-raised",
    className: "bg-surface-raised",
    use: "Modals, popovers",
  },
  { name: "--text", className: "bg-text", use: "Body and headings" },
  {
    name: "--text-muted",
    className: "bg-text-muted",
    use: "Secondary text",
  },
  { name: "--border", className: "bg-border", use: "Dividers, inputs" },
  { name: "--primary", className: "bg-primary", use: "Buttons, links" },
  {
    name: "--primary-hover",
    className: "bg-primary-hover",
    use: "Hover and pressed",
  },
  {
    name: "--primary-text",
    className: "bg-primary-text",
    use: "Text on primary",
  },
  { name: "--success", className: "bg-success", use: "Success states" },
  { name: "--warning", className: "bg-warning", use: "Scan warnings" },
  { name: "--error", className: "bg-error", use: "Errors" },
  {
    name: "--ad-surface",
    className: "bg-ad-surface",
    use: "Ad slot background",
  },
  { name: "--ad-border", className: "bg-ad-border", use: "Ad slot border" },
];

const spacingSteps = [
  { token: "4px (p-1)", className: "p-1" },
  { token: "8px (p-2)", className: "p-2" },
  { token: "16px (p-4)", className: "p-4" },
  { token: "24px (p-6)", className: "p-6" },
  { token: "32px (p-8)", className: "p-8" },
  { token: "48px (p-12)", className: "p-12" },
  { token: "64px (p-16)", className: "p-16" },
  { token: "96px (p-24)", className: "p-24" },
];

export default function DesignTokensPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-medium uppercase tracking-wider">
            Phase 0, working name
          </p>
          <h1 className="text-h1 font-bold">Signet design tokens</h1>
          <p className="mt-2 max-w-xl text-body text-text-muted">
            Every color, type size and spacing step in this theme in one view.
            Use the theme control to check both themes.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section aria-labelledby="colors" className="mb-12">
        <h2 id="colors" className="text-h2 font-semibold">
          Colors
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {colorTokens.map((token) => (
            <li
              key={token.name}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <span
                className={
                  "inline-block h-12 w-12 shrink-0 rounded-lg border border-border " +
                  token.className
                }
                aria-hidden="true"
              />
              <span>
                <code className="text-small font-mono">{token.name}</code>
                <span className="block text-small text-text-muted">
                  {token.use}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="typography" className="mb-12">
        <h2 id="typography" className="text-h2 font-semibold">
          Typography
        </h2>
        <div className="mt-4 space-y-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-h1 font-bold">H1 heading, 40/48</p>
          <p className="text-h2 font-semibold">H2 heading, 30/38</p>
          <p className="text-h3 font-semibold">H3 heading, 22/30</p>
          <p className="text-body">
            Body text, 16/24. Plain, honest, short sentences that say what
            happens before it happens.
          </p>
          <p className="text-small text-text-muted">
            Small text, 14/20, for helper text and secondary details.
          </p>
          <p className="text-caption font-medium uppercase tracking-wider">
            Caption, 12/16, ad labels
          </p>
          <p className="font-mono text-small">
            Monospace for payload previews: WIFI:T:WPA;S:ssid;P:redacted;H:false;;
          </p>
        </div>
      </section>

      <section aria-labelledby="spacing" className="mb-12">
        <h2 id="spacing" className="text-h2 font-semibold">
          Spacing, 8px system
        </h2>
        <ul className="mt-4 flex flex-wrap items-end gap-6">
          {spacingSteps.map((step) => (
            <li key={step.token} className="text-center">
              <span className="block rounded-md bg-primary" aria-hidden="true">
                <span className={step.className + " block"}></span>
              </span>
              <span className="mt-2 block text-caption text-text-muted">
                {step.token}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-text-muted">
          Allowed spacing values only: 4, 8, 16, 24, 32, 48, 64 and 96 px.
        </p>
      </section>

      <section aria-labelledby="radius-shadows" className="mb-12">
        <h2 id="radius-shadows" className="text-h2 font-semibold">
          Radius and shadows
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface-raised p-6 text-small">
            rounded-lg, 8px, inputs and buttons
          </div>
          <div className="rounded-xl border border-border bg-surface-raised p-6 text-small shadow-sm">
            rounded-xl, 12px, cards and modals
          </div>
          <div className="rounded-full border border-border bg-surface-raised px-6 py-2 text-small">
            rounded-full, badges and toggles
          </div>
        </div>
      </section>

      <section aria-labelledby="ad-slot" className="mb-12">
        <h2 id="ad-slot" className="text-h2 font-semibold">
          Ad slot placeholder
        </h2>
        <aside
          className="mt-4 rounded-xl border border-ad-border bg-ad-surface p-6 sm:p-4"
          aria-label="Ad slot placeholder"
        >
          <p className="mb-2 text-caption font-medium text-text-muted">
            Advertisement
          </p>
          <div
            className="flex min-h-[280px] items-center justify-center rounded-lg border border-ad-border text-small text-text-muted"
            role="img"
            aria-label="Reserved space for a 280px tall ad unit"
          >
            Reserved ad space, 280px, never styled like content
          </div>
        </aside>
      </section>

      <section aria-labelledby="motion" className="mb-12">
        <h2 id="motion" className="text-h2 font-semibold">
          Motion
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-body">
            Hover this card: 150 ms color shift, removed under
            prefers-reduced-motion.
          </p>
        </div>
      </section>

      <footer className="border-t border-border pt-6 text-small text-text-muted">
        Docs: PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Owned by Aaqib.
      </footer>
    </div>
  );
}
