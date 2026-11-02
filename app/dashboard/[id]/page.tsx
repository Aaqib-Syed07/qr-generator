import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMockBreakdown, createMockCodes, createMockScanDaily } from "@/lib/mocks/codes";

type Params = { id: string };

export function generateStaticParams() {
  return createMockCodes().map((code) => ({ id: code.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const id = (await params).id;
  const code = createMockCodes().find((item) => item.id === id);
  if (!code) return { title: "Code not found" };
  return { title: `${code.name}, code detail` };
}

/*
  Code detail with analytics cards, Phase 0 mock. Numbers are made up; the
  real aggregate comes from scan_daily in Phase 2.
*/

export default async function CodeDetailPage({ params }: PageProps<"/dashboard/[id]">) {
  const id = (await params).id;
  const code = createMockCodes().find((item) => item.id === id);
  if (!code) {
    notFound();
  }

  const daily = createMockScanDaily();
  const devices = createMockBreakdown();
  const maxDaily = Math.max(...daily.map((point) => point.value));

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-4 text-small text-text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/dashboard" className="font-medium text-primary underline">
              My codes
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{code.name}</li>
        </ol>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold">{code.name}</h1>
          <p className="mt-2 text-body text-text-muted">
            {code.type}, {code.type === "Wi-Fi" ? "payload hidden" : code.destination}
          </p>
          <p className="font-mono text-small text-text-muted">{code.short}</p>
        </div>
        <Badge tone={code.status === "active" ? "success" : code.status === "paused" ? "warning" : "error"}>
          {code.status === "active" ? "Live" : code.status === "paused" ? "Paused" : "Suspended"}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,24rem)]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-h3 font-semibold">Destination</h2>
            <Input
              id="detail-destination"
              label="Edit destination URL"
              defaultValue={code.destination === "Encodes the network, never stored anywhere" ? "" : code.destination}
              helper={
                code.type === "Wi-Fi"
                  ? "Wi-Fi payloads are edited on the tool page, not here."
                  : "Changes go live within seconds. The printed code does not change."
              }
              disabled={code.type === "Wi-Fi"}
            />
            <div className="mt-4 flex flex-wrap gap-4">
              <Button>Save destination</Button>
              {code.status === "active" ? (
                <Button variant="secondary">Pause</Button>
              ) : (
                <Button variant="secondary">Resume</Button>
              )}
              <Button variant="ghost">Convert to static</Button>
              <Button variant="destructive">Delete code</Button>
            </div>
          </Card>

          <Card>
            <h2 className="text-h3 font-semibold">Scans, last 7 days</h2>
            <p className="mt-1 text-small text-text-muted">
              Mock numbers. Real totals come from scan_daily after Phase 2.
            </p>
            <ul className="mt-4 space-y-2" aria-label="Scans per day">
              {daily.map((point) => (
                <li key={point.label} className="flex items-center gap-3">
                  <span className="w-10 text-small text-text-muted">{point.label}</span>
                  <span className="h-4 rounded-r-full bg-primary" style={{ width: `${Math.round((point.value / maxDaily) * 100)}%` }} aria-hidden="true" />
                  <span className="text-small text-text">{point.value}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-h3 font-semibold">Devices, last 30 days</h2>
            <ul className="mt-4 space-y-2" aria-label="Devices">
              {devices.map((point) => (
                <li key={point.label} className="flex items-center justify-between gap-3 text-small">
                  <span className="text-text">{point.label}</span>
                  <span className="text-text-muted">{point.value} percent</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card hoverable>
            <h2 className="text-h3 font-semibold">This code</h2>
            <dl className="mt-2 space-y-2 text-small">
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Created</dt>
                <dd className="text-text">{code.created}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Scans, 30 days</dt>
                <dd className="text-text">{code.scans30d}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-muted">Type</dt>
                <dd className="text-text">{code.type}</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-h3 font-semibold">Lapse policy</h2>
            <p className="mt-2 text-small text-text-muted">
              If your plan ends, this code keeps redirecting for at least 90
              days, then shows a page that still points to the destination.
            </p>
            <Link href="/learn/qr-expiry" className="mt-4 inline-flex min-h-11 items-center font-medium text-primary underline">
              Read the policy
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
