import Link from "next/link";

/*
  Footer per docs/DESIGN_SYSTEM.md: legal, status, comparisons. All routes
  link to pages that P0-5 (and Phase 4 trust drafts) fill in.
*/

const columns = [
  {
    heading: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/tools/url", label: "QR tools" },
      { href: "/learn/generate-free-qr", label: "Free generator guide" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { href: "/learn/qr-expiry", label: "Lapse policy" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/status", label: "Status" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/learn/dynamic-vs-static-qr", label: "Dynamic vs static" },
      { href: "/learn/still-live-qr-policies", label: "Codes that stay live" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <p className="text-body font-semibold text-text">Signet</p>
          <p className="mt-2 text-small text-text-muted">
            The honest QR code generator. Free static codes, no signup, no
            watermark. Dynamic codes that never become a dead end.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <p className="mb-2 text-small font-medium text-text">{column.heading}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-small text-text-muted hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-caption text-text-muted md:px-6">
          Working name. Static QR codes are always free. Made in India.
        </p>
      </div>
    </footer>
  );
}
