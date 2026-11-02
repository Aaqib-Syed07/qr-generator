import { Badge } from "@/components/ui/badge";

/*
  Scan readiness panel per docs/DESIGN_SYSTEM.md: checks with pass, warn
  and fail states. The thresholds behind this list become real pure
  functions with unit tests in P1-4; Phase 0 shows the states with mock
  values. Never rely on color alone: the icon plus text carry the state.
*/

export type CheckState = "pass" | "warn" | "fail";

export type ReadinessCheck = {
  state: CheckState;
  name: string;
  detail: string;
};

const stateMarks: Record<CheckState, string> = {
  pass: "\u2713",
  warn: "\u0021",
  fail: "\u2715",
};

const stateBadgeTone: Record<CheckState, "success" | "warning" | "error"> = {
  pass: "success",
  warn: "warning",
  fail: "error",
};

export function ScanReadinessPanel({ checks }: { checks: ReadinessCheck[] }) {
  return (
    <section
      aria-label="Scan readiness"
      className="rounded-xl border border-border bg-surface p-6"
    >
      <h2 className="text-h3 font-semibold">Scan readiness</h2>
      <ul className="mt-4 space-y-3">
        {checks.map((check) => (
          <li key={check.name} className="flex flex-wrap items-start gap-3">
            <span
              aria-hidden="true"
              className={
                "mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border " +
                (check.state === "pass"
                  ? "border-success text-success"
                  : check.state === "warn"
                    ? "border-warning text-warning"
                    : "border-error text-error")
              }
            >
              {stateMarks[check.state]}
            </span>
            <span className="flex-1">
              <Badge tone={stateBadgeTone[check.state]}>
                {check.state === "pass"
                  ? "Pass"
                  : check.state === "warn"
                    ? "Warn"
                    : "Fail"}
              </Badge>
              <span className="ml-2 text-body text-text">{check.name}</span>
              <span className="block text-small text-text-muted">
                {check.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
