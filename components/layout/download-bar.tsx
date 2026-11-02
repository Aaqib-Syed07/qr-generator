import type { ReactNode } from "react";

/*
  Download bar per docs/DESIGN_SYSTEM.md: sticky at the bottom on mobile,
  inline on desktop. Sits below the generator controls and above the
  generator it belongs to. Phase 0 mock: the click does nothing yet, the
  real handler is beforeDownload(format) in Phase 1.
*/

export type DownloadBarProps = {
  children?: ReactNode;
};

export function DownloadBar() {
  return (
    <div className="sticky bottom-0 z-20 border-t border-border bg-surface-raised p-4 lg:static lg:mt-6 lg:border lg:rounded-xl lg:p-6">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 lg:max-w-none">
        <div>
          <p className="text-body font-medium text-text">Download your QR code</p>
          <p className="text-small text-text-muted">
            Free, no signup. One short ad before the download.
          </p>
        </div>
        <button
          type="button"
          className="min-h-11 shrink-0 cursor-pointer rounded-lg bg-primary px-6 font-medium text-primary-text transition-colors hover:bg-primary-hover active:bg-primary-hover"
        >
          Download
        </button>
      </div>
    </div>
  );
}
