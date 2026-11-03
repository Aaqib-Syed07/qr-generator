"use client";

import { useSyncExternalStore } from "react";

/*
  A minute-ticking clock exposed through useSyncExternalStore, so
  components can label "x min ago" without calling Date.now() inside
  a render. Render-time Date.now() is unstable under Next.js
  prerendering (Cache Components block it) and is flagged by
  react-hooks/purity; a subscription-driven snapshot is the pattern
  that is safe for both.

  The server snapshot is 0: nothing renders a relative label during
  prerender because history starts empty, and the first subscription
  callback delivers a real timestamp right after hydration.
*/

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let now = 0;

function ensureTicker(): void {
  if (timer) return;
  now = Date.now();
  timer = setInterval(() => {
    now = Date.now();
    for (const listener of listeners) {
      listener();
    }
  }, 60_000);
}

export function subscribeClock(listener: () => void): () => void {
  listeners.add(listener);
  ensureTicker();
  // Deliver the current time immediately: the store was EMPTY (0)
  // on the server snapshot, so this replaces 0 with a real stamp.
  listener();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
      now = 0;
    }
  };
}

/** Stable between ticks, so no render loop. */
export function getClockSnapshot(): number {
  return now;
}

export function useSteadyNow(): number {
  return useSyncExternalStore(subscribeClock, getClockSnapshot, () => 0);
}
