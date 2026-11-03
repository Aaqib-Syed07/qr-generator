import { AdSlot } from "@/components/layout/ad-slot";
import { Generator } from "@/components/qr/generator";
import { qrTypeBySlug, qrTypes } from "@/lib/qr/types";
import Link from "next/link";

/*
  Home: the free generator, 13 types, no signup, per docs/PRD.md. The word
  "Signet" is a working placeholder until the owner confirms the name.
*/

export const metadata = {
  title: "Signet, free QR code generator with no signup",
  description:
    "Make a QR code in seconds. Free static codes, no watermark, no account. Dynamic codes that never become a dead end.",
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-h1 font-bold">
          Free QR code generator, no signup
        </h1>
        <p className="mt-2 max-w-2xl text-body text-text-muted">
          Pick a type, fill one field, download. Free static codes always, no
          watermark. Every download runs fully in your browser.
        </p>
      </header>

      <Generator type={qrTypeBySlug("url")!} allowTypeSwitch />

      <section aria-labelledby="other-types" className="mt-12">
        <h2 id="other-types" className="text-h2 font-semibold">
          All 13 QR types
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qrTypes.map((type) => (
            <li
              key={type.slug}
              className="relative rounded-xl border border-border bg-surface-raised p-6"
            >
              <Link
                href={`/tools/${type.slug}`}
                className="text-body font-medium text-text after:absolute after:inset-0 hover:underline"
              >
                {type.label}
                <span className="block text-small text-text-muted">
                  {type.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 max-w-xl">
        <AdSlot placement="below-fold" />
      </div>
    </div>
  );
}
