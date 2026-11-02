import Link from "next/link";

export const metadata = {
  title: "About this QR code",
  description: "This QR code's plan has ended. The destination is still shown.",
};

/*
  Branded fallback page preview, Phase 0 static mock. In Phase 2 the edge
  redirect renders this for lapsed (90 days or more) codes. Rules from
  docs/PRD.md: destination still visible, abuse report link, no ads,
  never a bare error. Real short codes are server validated there; this
  mock uses placeholder text only.
*/

const mockCode = "aX7q";

export function generateStaticParams() {
  return [{ code: mockCode }];
}

export default async function FallbackPage({ params }: PageProps<"/r/[code]">) {
  // Validate nothing yet, mock phase. P2-5 shifts this behind real lookups.
  await params;
  return (
    <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16 md:px-6">
      <p className="text-caption font-medium uppercase tracking-wider">Signet</p>
      <h1 className="mt-2 text-h1 font-bold">This code outlived its plan</h1>
      <p className="mt-4 text-body text-text-muted">
        The owner of this QR code has not renewed it in the last 90 days. The
        page below was where this code pointed, and it is shown here on
        purpose, so the printed code is never a dead end.
      </p>

      <section aria-label="Destination" className="mt-8 rounded-xl border border-border bg-surface p-6">
        <p className="text-small font-medium text-text">Destination</p>
        <a
          href="https://example.com/destination"
          rel="nofollow"
          className="mt-1 inline-flex min-h-11 items-center break-all font-mono text-body text-primary underline"
        >
          https://example.com/destination
        </a>
        <p className="mt-2 text-small text-text-muted">
          Check the address before you visit it. Links to this page are not
          endorsements.
        </p>
      </section>

      <p className="mt-8 text-small text-text-muted">
        Own this code? Convert it to static or renew the plan in your{" "}
        <Link href="/dashboard" className="font-medium text-primary underline">
          dashboard
        </Link>
        .
      </p>
      <p className="mt-2 text-small">
        <Link href="/report-abuse" className="font-medium text-primary underline">
          Report abuse
        </Link>
      </p>
    </main>
  );
}
