/*
  Phase 0 mock list of learn articles. Real articles, dates and citations
  are Phase 3 (P3-7) and Phase 4 work.
*/

export type LearnArticle = {
  slug: string;
  title: string;
  summary: string;
};

export const learnArticles: LearnArticle[] = [
  {
    slug: "generate-free-qr",
    title: "How to generate a free QR code",
    summary:
      "A walk through the free generator, no account needed, for menus, posters and handouts.",
  },
  {
    slug: "qr-expiry",
    title: "Our QR code lapse policy",
    summary:
      "Exactly what happens to a dynamic code when a plan ends, day by day.",
  },
  {
    slug: "dynamic-vs-static-qr",
    title: "Dynamic vs static QR codes",
    summary:
      "When a static code is enough, and when editing the destination later is worth a plan.",
  },
  {
    slug: "still-live-qr-policies",
    title: "Which QR vendors keep codes live",
    summary:
      "A dated comparison of lapse policies, with sources and last checked dates.",
  },
];

export function learnArticleBySlug(slug: string): LearnArticle | undefined {
  return learnArticles.find((article) => article.slug === slug);
}
