import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

/*
  Root 404 per docs/DESIGN_SYSTEM.md: explain, offer the next step, never
  dead end.
*/

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-16 md:px-6">
      <p className="text-caption font-medium uppercase tracking-wider">
        404
      </p>
      <h1 className="mt-2 text-h1 font-bold">That page does not exist</h1>
      <p className="mt-4 text-body text-text-muted">
        The link may be old or mistyped. The generator itself is on the home
        page, and every QR tool is in the menu above.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg bg-primary px-6 font-medium text-primary-text transition-colors hover:bg-primary-hover active:bg-primary-hover"
        >
          Open the generator
        </Link>
      </div>
    </main>
  );
}
