"use client";

import { Button } from "@/components/ui/button";
import { qrTypeBySlug } from "@/lib/qr/types";
import type { HistoryEntry } from "@/lib/qr/history";
import { useSteadyNow } from "@/lib/qr/use-now";

/*
  Recent downloads per docs/PRD.md P1-7: the last 10 encodes from this
  browser only, restore and clear. Personal by design, no account and
  no sync. Wi-Fi entries show a note when the password was not kept.
*/

export type HistoryListProps = {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onClear: () => void;
};

function relativeTime(timestamp: number, now: number): string {
  const minutes = Math.round((now - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function HistoryList({ entries, onRestore, onClear }: HistoryListProps) {
  /*
    A subscription-driven clock for the "x min ago" labels only. This
    component renders client-side, after history loads from
    localStorage, so the stamp never participates in hydration; the
    labels refresh on the minute tick.
  */
  const now = useSteadyNow();
  return (
    <section aria-label="Recent downloads" className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-h3 font-semibold">Recent downloads</h2>
        {entries.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear all
          </Button>
        ) : null}
      </div>
      {entries.length === 0 ? (
        <p className="mt-2 text-small text-text-muted">
          Your last 10 downloaded codes appear here, stored only in this
          browser. Nothing is uploaded.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {entries.map((entry) => {
            const type = qrTypeBySlug(entry.type);
            return (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-surface-raised px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body text-text">
                    {type?.label ?? entry.type}
                    <span className="ml-2 text-small text-text-muted">
                      {relativeTime(entry.savedAt, now)}
                    </span>
                  </p>
                  {entry.type === "wifi" ? (
                    <p className="text-caption text-text-muted">
                      Wi-Fi code restored without the password.
                    </p>
                  ) : null}
                </div>
                <Button variant="secondary" size="sm" onClick={() => onRestore(entry)}>
                  Restore
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
