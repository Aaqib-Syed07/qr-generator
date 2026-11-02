import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMockCodes } from "@/lib/mocks/codes";

export const metadata = {
  title: "My codes",
  description: "List of your dynamic QR codes.",
};

/*
  Dashboard code list for Phase 0, mock rows via lib/mocks/codes.ts.
  Includes the empty state copy even though the list renders rows, so the
  state is drawable and reviewable.
*/

export default function DashboardPage() {
  const codes = createMockCodes();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold">My codes</h1>
          <p className="mt-2 text-body text-text-muted">
            Free plan: 3 dynamic codes. Static codes are unlimited and do not
            appear here.
          </p>
        </div>
        <Button>New dynamic code</Button>
      </div>

      <section aria-labelledby="codes-list">
        <h2 id="codes-list" className="sr-only">
          Code list
        </h2>
        <Input
          id="dash-filter"
          label="Filter by name or short code"
          className="mb-6 max-w-sm placeholder:text-text-muted"
          placeholder="Restaurant menu, aX7q…"
        />
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Your dynamic QR codes with type, status, scans and destination.
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="px-6 py-4 text-small font-medium text-text">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-small font-medium text-text">
                  Type
                </th>
                <th scope="col" className="px-6 py-4 text-small font-medium text-text">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-small font-medium text-text">
                  Scans, 30 days
                </th>
                <th scope="col" className="px-6 py-4 text-small font-medium text-text">
                  Destination
                </th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/${code.id}`}
                      className="font-medium text-primary underline"
                    >
                      {code.name}
                    </Link>
                    <span
                      className="block font-mono text-small text-text-muted"
                      title={`Short link ${code.short}`}
                    >
                      {code.short}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-body text-text">{code.type}</td>
                  <td className="px-6 py-4">
                    <Badge tone={code.status === "active" ? "success" : code.status === "paused" ? "warning" : "error"}>
                      {code.status === "active" ? "Live" : code.status === "paused" ? "Paused" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-body text-text">{code.scans30d}</td>
                  <td className="max-w-40 truncate px-6 py-4 font-mono text-small text-text-muted">
                    {code.destination}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Card className="mt-8">
        <p className="text-small font-medium text-text">Empty state</p>
        <p className="mt-2 text-body text-text-muted">
          You have no dynamic codes yet. Pick a QR type, toggle dynamic, name
          it, and you can change where it points later without reprinting.
        </p>
        <div className="mt-4">
          <Button variant="secondary">Create your first code</Button>
        </div>
      </Card>
    </div>
  );
}
