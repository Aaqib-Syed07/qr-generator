"use client";

import { useEffect, useRef } from "react";
import type { QrConfig } from "@/lib/qr/config";
import { QrEngine } from "@/lib/qr/engine";

/*
  Live QR preview: the P1-1 engine renders into this container and
  updates in place on every config change. The tile keeps its light,
  white background in both themes so dark mode can never hurt
  scanning, per docs/DESIGN_SYSTEM.md.

  Whether the tile shows the placeholder comes straight from the
  config prop: a valid payload is exactly when an engine render is
  attempted, so no effect-local setState is needed (and a failed
  render simply leaves an empty, engine-owned container).
*/

export type QrPreviewProps = {
  /** Null shows the fill-the-fields placeholder. */
  config: QrConfig | null;
  invalidHint?: string;
};

export function QrPreview({ config, invalidHint }: QrPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<QrEngine | null>(null);

  const ready = Boolean(config && config.payload);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!config || !config.payload) {
      engineRef.current?.dispose();
      engineRef.current = null;
      return;
    }
    if (!engineRef.current) {
      engineRef.current = new QrEngine();
    }
    try {
      engineRef.current.render(config, container);
    } catch (error) {
      // Leave the engine-owned container empty for this config; the
      // readiness panel already tells the user what to fix.
      console.error(error);
    }
  }, [config]);

  useEffect(() => {
    return () => engineRef.current?.dispose();
  }, []);

  return (
    <figure className="mx-auto w-full max-w-sm">
      <div
        role="img"
        aria-label="Live preview of your QR code"
        className="flex aspect-square items-center justify-center rounded-xl border border-border bg-white p-4"
      >
        {!ready ? (
          <p className="px-6 text-center text-small text-text-muted">
            {invalidHint ?? "Fill in the details to see your code."}
          </p>
        ) : null}
        <div
          ref={containerRef}
          className="pointer-events-none [&>svg]:h-auto [&>svg]:w-full"
        />
      </div>
      <figcaption className="mt-4 text-center text-small text-text-muted">
        {ready
          ? "Live preview, updated as you type."
          : "The preview appears as soon as the details are valid."}
        <span aria-live="polite" className="sr-only">
          {ready ? "Preview updated" : "Preview waiting"}
        </span>
      </figcaption>
    </figure>
  );
}
