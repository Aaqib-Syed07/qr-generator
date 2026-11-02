/*
  Ad slot placeholder per docs/DESIGN_SYSTEM.md and the placement rules in
  docs/PRD.md: labeled Advertisement, neutral box, reserved height, kept
  visibly separate from content. Real rendering follows the AdProvider
  choice in Phase 5.
*/

export type AdSlotPlacement = "in-article" | "sidebar" | "below-fold";

export type AdSlotProps = {
  placement: AdSlotPlacement;
  className?: string;
};

const heightByPlacement = {
  "in-article": 280,
  sidebar: 600,
  "below-fold": 280,
} as const;

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const height = heightByPlacement[placement];
  return (
    <aside
      className={
        "rounded-xl border border-ad-border bg-ad-surface p-4 " + className
      }
      aria-label="Advertisement slot"
      data-placement={placement}
    >
      <p className="mb-2 text-caption font-medium text-text-muted">
        Advertisement
      </p>
      <div
        style={{ minHeight: height }}
        className="flex items-center justify-center rounded-lg border border-ad-border text-small text-text-muted"
        role="img"
        aria-label={`Reserved space for a ${height}px tall ad unit`}
      >
        Reserved ad space, {height}px
      </div>
    </aside>
  );
}
