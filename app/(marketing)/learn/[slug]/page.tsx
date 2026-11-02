import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/layout/ad-slot";
import { AccordionItem } from "@/components/ui/accordion";
import { learnArticleBySlug, learnArticles } from "@/lib/content/learn";

type Params = { slug: string };

export function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const slug = (await params).slug;
  const article = learnArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: `${article.title} | Signet learn`,
    description: article.summary,
  };
}

/*
  Learn article template, per docs/PRD.md P3-2 and P3-7. Phase 0: structure
  only (answer block, headings in order, FAQ, dated note) with mock body
  text. Ad placements follow the locked rules: after the intro, mid
  article, at the end, and a sticky sidebar from 1024px, three units max
  per 1000 words.
*/

export default async function LearnArticlePage({
  params,
}: PageProps<"/learn/[slug]">) {
  const article = learnArticleBySlug((await params).slug);
  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-4 text-small text-text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/learn" className="font-medium text-primary underline">
              Learn
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{article.title}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <h1 className="text-h1 font-bold">{article.title}</h1>

          <section aria-label="Answer" className="mt-6 rounded-xl border border-border bg-surface p-6">
            <p className="text-body">
              <strong>Short answer.</strong> Static codes never expire and cost
              nothing. Dynamic codes stay live for at least 90 days after a
              plan ends, then still show the destination. Details follow, with
              a last checked date before publishing. See the{" "}
              <Link href="/learn/qr-expiry" className="font-medium text-primary underline">
                lapse policy
              </Link>
              .
            </p>
          </section>

          <div className="mt-8 space-y-6 text-body text-text-muted">
            <p>
              Placeholder intro paragraph. Written copy arrives with the SEO
              phase and carries real sources, a last updated date and no
              invented numbers.
            </p>
            <AdSlot placement="in-article" />
            <h2 className="text-h2 font-semibold text-text">Section heading</h2>
            <p>
              Placeholder section paragraph. Line length stays at 65 to 75
              characters on desktop, and headings never skip a level.
            </p>
            <h2 className="text-h2 font-semibold text-text">Mid heading</h2>
            <p>Placeholder second section.</p>
          </div>

          <section aria-labelledby="article-faq" className="mt-12">
            <h2 id="article-faq" className="text-h2 font-semibold">
              Questions
            </h2>
            <div className="mt-4 space-y-4">
              <AccordionItem question="Is this guide checked?">
                Every published number carries its source and a last checked
                date next to it.
              </AccordionItem>
            </div>
          </section>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AdSlot placement="sidebar" />
        </aside>
      </div>
    </div>
  );
}
