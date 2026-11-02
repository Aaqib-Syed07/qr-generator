"use client";

import { useState } from "react";

/*
  Toast component and a minimal demo of show, dismiss and the polite live
  region. A provider with a queue arrives with the download flow, when there
  are real events to announce.
*/

export type ToastProps = {
  title: string;
  description?: string;
};

export function Toast({ title, description }: ToastProps) {
  return (
    <div
      role="status"
      className="flex min-h-11 items-start gap-4 rounded-xl border border-border bg-surface-raised p-4 shadow-md"
    >
      <span aria-hidden="true" className="mt-1 text-success">
        ▼
      </span>
      <div>
        <p className="text-body font-medium text-text">{title}</p>
        {description ? (
          <p className="text-small text-text-muted">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ToastDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-4 font-medium text-primary-text transition-colors hover:bg-primary-hover active:bg-primary-hover"
      >
        {visible ? "Dismiss toast" : "Show toast"}
      </button>
      {visible ? <Toast title="Your QR code is downloading" /> : null}
    </div>
  );
}
