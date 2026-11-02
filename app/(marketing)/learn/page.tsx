import Link from "next/link";
import { learnArticles } from "@/lib/content/learn";

export const metadata = {
  title: "Learn, plain guides about QR codes",
  description:
    "Short, honest guides about generating, printing and keeping QR codes alive.",
};

export default function LearnIndexPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8">
        <h1 className="text-h1 font-bold">Learn</h1>
        <p className="mt-2 text-body text-text-muted">
          Plain guides. Every claim gets a source and a last checked date
          before we publish.
        </p>
      </header>
      <ul className="space-y-4">
        {learnArticles.map((article) => (
          <li
            key={article.slug}
            className="relative rounded-xl border border-border bg-surface-raised p-6"
          >
            <Link
              href={`/learn/${article.slug}`}
              className="after:absolute after:inset-0"
            >
              <span className="text-body font-medium text-text">
                {article.title}
                <span className="mt-2 block text-small text-text-muted">
                  {article.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
