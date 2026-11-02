/*
  Mock QR preview tile for the Phase 0 screens. The real SVG rendering
  through QrEngine arrives in P1-1. The tile stays light in both themes so
  scanning is never hurt by dark mode, per docs/DESIGN_SYSTEM.md.
*/
import type { QrTypeListItem } from "@/lib/qr/types";

export type PreviewTileProps = {
  type?: QrTypeListItem;
  hint?: string;
};

export function PreviewTile({ type, hint }: PreviewTileProps) {
  return (
    <figure className="mx-auto w-full max-w-sm">
      <div
        role="img"
        aria-label={`Placeholder preview of a QR code${type ? ` for ${type.label.toLowerCase()}` : ""}`}
        className="flex aspect-square items-center justify-center rounded-xl border border-border bg-white p-4"
      >
        {/* Deterministic mock pattern, not a scannable code. */}
        <svg viewBox="0 0 21 21" className="h-full w-full" aria-hidden="true">
          <rect width="21" height="21" fill="#ffffff" />
          {Array.from({ length: 21 }).map((_, row) =>
            Array.from({ length: 21 }).map((__, col) => {
              const corner =
                (row < 7 && col < 7) ||
                (row < 7 && col > 13) ||
                (row > 13 && col < 7);
              const seed = (row * 7 + col * 13) % 5;
              if (corner ? (row + col) % 2 === 0 : seed < 2) {
                return (
                  <rect key={`${row}-${col}`} x={col} y={row} width="1" height="1" fill="#0f172a" />
                );
              }
              return null;
            })
          )}
          <rect x="7" y="7" width="7" height="7" fill="#ffffff" />
        </svg>
      </div>
      <figcaption className="mt-4 text-center text-small text-text-muted">
        {hint ?? "Mock preview. Real rendering arrives in Phase 1."}
        <span aria-live="polite" className="sr-only">
          Preview updated
        </span>
      </figcaption>
    </figure>
  );
}
