import type { ReactNode } from "react";

/*
  Badges for statuses and small labels. Color is always paired with text,
  never with color alone.
*/

export type BadgeTone = "neutral" | "success" | "warning" | "error";

export type BadgeProps = {
  tone?: BadgeTone;
  children: ReactNode;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surface text-text",
  success: "border-success bg-surface text-success",
  warning: "border-warning bg-surface text-warning",
  error: "border-border bg-surface text-error",
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 rounded-full border px-4 py-1 text-caption font-medium " +
        toneClasses[tone]
      }
    >
      {children}
    </span>
  );
}
