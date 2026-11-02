"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/*
  Download ad modal per docs/PRD.md and docs/DESIGN_SYSTEM.md.
  States: explainer, loading, playing, granted, failed, abandoned.
  Flow: Watch ad click -> loading (deadline 4 seconds) -> house ad plays
  5 seconds -> granted -> close and download. A fake "fail open" provider
  demo shows what happens when no ad arrives. Escape cannot close the
  dialog while the ad plays, per the locked rules.
  The close-early control is demo only for Phase 0 review.
*/

type ModalState = "explainer" | "loading" | "playing" | "granted" | "failed" | "abandoned";

export type DownloadAdModalProps = {
  open: boolean;
  onClose: () => void;
  onResult?: (result: "download" | "cancelled") => void;
  provider?: "house" | "fail-open";
};

const loadingCopy =
  "Loading your ad. If it cannot load in 4 seconds, your download starts anyway.";

export function DownloadAdModal({
  open,
  onClose,
  onResult,
  provider = "house",
}: DownloadAdModalProps) {
  const [state, setState] = useState<ModalState>("explainer");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      setState("explainer");
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(
    () => () => {
      clearTimers();
    },
    []
  );

  function watchAd() {
    clearTimers();
    setState("loading");
    const toPlaying = window.setTimeout(() => {
      if (provider === "fail-open") {
        setState("failed");
        onResult?.("download");
        timers.current.push(
          window.setTimeout(() => {
            onClose();
          }, 1500)
        );
      } else {
        setState("playing");
        timers.current.push(
          window.setTimeout(() => {
            setState("granted");
            onResult?.("download");
            onClose();
          }, 5000)
        );
      }
    }, 900);
    timers.current.push(toPlaying);
  }

  function onAnimationEnd() {
    // Fires on dialog close. Mirrors the result back to the page for toasts.
    if (state === "abandoned" || state === "explainer" || state === "loading") {
      onResult?.("cancelled");
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        if (state === "playing") {
          event.preventDefault();
        }
      }}
      onClose={onAnimationEnd}
      aria-labelledby="download-ad-title"
      className="mx-auto mt-auto w-full max-w-lg rounded-xl border border-border bg-surface-raised p-6 shadow-md backdrop:bg-black/50 md:mb-auto"
    >
      {state === "explainer" ? (
        <>
          <h2 id="download-ad-title" className="text-h3 font-semibold">
            Watch a short ad to download your QR code.
          </h2>
          <p className="mt-2 text-body text-text-muted">
            Paid plans have no ads. Your download starts after the ad, or
            sooner if the ad fails to load.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button onClick={watchAd} autoFocus>
              Watch ad and download
            </Button>
            <Link href="/pricing" className="inline-flex min-h-11 items-center rounded-lg px-4 text-body font-medium text-primary underline">
              Upgrade
            </Link>
          </div>
        </>
      ) : null}

      {state === "loading" ? (
        <>
          <h2 id="download-ad-title" className="text-h3 font-semibold">
            Loading your ad
          </h2>
          <p className="mt-2 text-body text-text-muted">{loadingCopy}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-small text-text-muted">
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            Finding an ad under 4 seconds
          </p>
        </>
      ) : null}

      {state === "playing" ? (
        <>
          <h2 id="download-ad-title" className="text-h3 font-semibold">
            Your download starts after the ad
          </h2>
          <div
            className="mt-4 flex min-h-40 items-center justify-center rounded-lg border border-ad-border bg-ad-surface text-small text-text-muted"
            aria-label="Ad playback area"
          >
            House ad placeholder: the provider takes over here
          </div>
          <button
            type="button"
            onClick={() => setState("abandoned")}
            className="mt-4 text-caption text-text-muted underline"
          >
            Demo control: ad closed early
          </button>
        </>
      ) : null}

      {state === "failed" ? (
        <>
          <h2 id="download-ad-title" className="text-h3 font-semibold">
            We could not load an ad. Your download is starting.
          </h2>
        </>
      ) : null}

      {state === "abandoned" ? (
        <>
          <h2 id="download-ad-title" className="text-h3 font-semibold">
            The ad was closed early, so the download did not start.
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button onClick={watchAd}>Retry</Button>
            <Link href="/pricing" className="inline-flex min-h-11 items-center text-body font-medium text-primary underline" onClick={onClose}>
              Upgrade to Plus, ad free
            </Link>
          </div>
        </>
      ) : null}
    </dialog>
  );
}
