import Link from "next/link";
import { AccordionItem } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/*
  Pricing screen from docs/PRD.md. Facts (names, prices, limits) will move
  to lib/facts.ts in Phase 4; Phase 0 keeps the PRD table only, clearly
  labeled as launch testing prices.
*/

const plans = [
  {
    name: "Free",
    usd: "$0",
    india: "Rs 0",
    billing: "No billing",
    highlights: [
      "Unlimited static codes",
      "Full design studio",
      "PNG, SVG, PDF",
      "No watermark, no signup",
      "One short ad before each download",
      "With a free account: 3 dynamic codes",
    ],
  },
  {
    name: "Plus",
    usd: "$6 monthly",
    india: "about Rs 199 monthly",
    billing: "$5 monthly on annual billing",
    highlights: [
      "No ads",
      "30 dynamic codes",
      "12 months of analytics",
      "Custom slugs, password, expiry, UTM",
      "CSV export, print templates",
    ],
  },
  {
    name: "Pro",
    usd: "$19 monthly",
    india: "about Rs 599 monthly",
    billing: "$15 monthly on annual billing",
    highlights: [
      "300 dynamic codes",
      "Bulk CSV import",
      "API access",
      "1 custom domain",
      "Smart routing, 3 seats",
    ],
  },
  {
    name: "Business",
    usd: "$49 monthly",
    india: "custom quote",
    billing: "Monthly only",
    highlights: [
      "1,500 dynamic codes",
      "5 domains, 10 seats",
      "Folders and roles",
      "White label",
      "Priority support",
    ],
  },
];

export const metadata = {
  title: "Pricing, monthly billing for every plan",
  description:
    "Free static QR codes forever. Plus, Pro and Business plans with monthly billing, paid by UPI or card through Razorpay.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-12">
        <h1 className="text-h1 font-bold">Simple, monthly plans</h1>
        <p className="mt-2 max-w-2xl text-body text-text-muted">
          Static codes are free forever. Paid plans unlock dynamic codes, more
          analytics and no ads. Every plan bills monthly, cancel any time from
          your dashboard.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col gap-4">
            <div>
              <p className="text-h3 font-semibold">{plan.name}</p>
              <p className="mt-2 text-body font-medium text-text">
                {plan.usd}
                <span className="block text-small text-text-muted">
                  India: {plan.india}
                </span>
              </p>
              <p className="text-small text-text-muted">{plan.billing}</p>
            </div>
            <ul className="flex-1 space-y-2">
              {plan.highlights.map((item) => (
                <li key={item} className="text-small text-text-muted">
                  {item}
                </li>
              ))}
            </ul>
            {plan.name === "Free" ? (
              <Badge tone="success">Included</Badge>
            ) : (
              <Button variant="secondary">Choose {plan.name}</Button>
            )}
          </Card>
        ))}
      </ul>

      <section aria-labelledby="lapse" className="mt-12">
        <h2 id="lapse" className="text-h2 font-semibold">
          What happens when a plan ends
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-body">
            Your dynamic codes keep working for at least 90 days after a plan
            ends. After that, anyone who scans sees a simple page that still
            shows the destination link. You can convert a dynamic code to
            static at any time, and the printed code never becomes a dead end.
            Read the full{" "}
            <Link href="/learn/qr-expiry" className="font-medium text-primary underline">
              lapse policy
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="pricing-faq" className="mt-12">
        <h2 id="pricing-faq" className="text-h2 font-semibold">
          Questions
        </h2>
        <div className="mt-4 space-y-4">
          <AccordionItem question="Why is there an ad on the free plan?">
            One short ad before each download keeps static codes free, without
            signups, watermarks or scan caps. Paid plans have no ads at all.
          </AccordionItem>
          <AccordionItem question="Can I pay annually?">
            Yes, on Plus and Pro. Annual billing lowers the monthly price,
            shown on each card.
          </AccordionItem>
          <AccordionItem question="Do you accept UPI?">
            Yes. Payments run on Razorpay, so UPI and cards both work.
          </AccordionItem>
        </div>
      </section>
    </div>
  );
}
