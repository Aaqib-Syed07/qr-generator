import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/layout/ad-slot";
import { GeneratorDemo } from "@/components/tools/generator-demo";
import { qrTypeBySlug, qrTypes } from "@/lib/qr/types";

type Params = { type: string };

export function generateStaticParams() {
  return qrTypes.map((type) => ({ type: type.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const type = qrTypeBySlug((await params).type);
  if (!type) {
    return { title: "QR tool not found" };
  }
  return {
    title: `${type.label} QR code generator, free and no signup`,
    description: type.description,
  };
}

/*
  One page per QR type, from the type registry, per docs/PRD.md P3-6.
  Phase 0: the mock generator shell; real forms and encoders come in P1-2.
  There is one ad slot below the fold, clear of the generator controls,
  per the locked placement rules.
*/

export default async function ToolPage({
  params,
}: PageProps<"/tools/[type]">) {
  const type = qrTypeBySlug((await params).type);
  if (!type) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-small text-text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="text-primary underline">
              QR generator
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{type.label}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-h1 font-bold">{type.label} QR code generator</h1>
        <p className="mt-2 max-w-2xl text-body text-text-muted">
          {type.description} Free, no signup, no watermark. Generated fully in
          your browser.
        </p>
      </header>

      <GeneratorDemo type={type} />

      <div className="mt-12 max-w-xl">
        <AdSlot placement="below-fold" />
      </div>
    </div>
  );
}
