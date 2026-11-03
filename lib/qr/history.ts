import type { QrConfig } from "./config";
import type { QrTypeSlug } from "./payload";

/*
  Local download history per docs/PRD.md P1-7: the last 10 encodes,
  stored only in this browser's localStorage with a clear button.
  Personal by design. Wi-Fi passwords are never stored by default
  (the PRD is explicit); the code still works after a history restore
  because the password field becomes empty and the user retypes it.
*/

export type HistoryEntry = {
  id: string;
  savedAt: number;
  /** One of the 13 launch type slugs. */
  type: QrTypeSlug;
  /** Dense payload means a bigger matrix; shown as a chip. */
  payloadLength: number;
  config: QrConfig;
};

const STORAGE_KEY = "signet.history.v1";
const MAX_ENTRIES = 10;

function stripDangerousDefaults(config: QrConfig): QrConfig {
  if (config.type !== "wifi") return config;
  const values = { ...config.values, password: "" };
  return { ...config, values };
}

function readAll(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    // Storage disabled or malformed data: behave as empty, never throw
    // into the generator flow.
    return [];
  }
}

function writeAll(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota exceeded or storage disabled: history is best effort.
  }
}

/*
  External-store plumbing so React can read this browser-local data
  through useSyncExternalStore (lib/qr/use-history.ts) instead of a
  setState-in-effect load: the store is written by rememberCode and
  forgetAll, which notify subscribers, and the first snapshot is read
  on demand.
*/

const listeners = new Set<() => void>();

/** null until the first read so the server snapshot stays stable. */
let snapshot: HistoryEntry[] | null = null;

function ensureSnapshot(): HistoryEntry[] {
  if (snapshot === null) {
    snapshot = readAll();
  }
  return snapshot;
}

function commit(next: HistoryEntry[]): HistoryEntry[] {
  snapshot = next;
  writeAll(next);
  for (const listener of listeners) {
    listener();
  }
  return next;
}

/** useSyncExternalStore subscription for the history store. */
export function subscribeHistory(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Client snapshot: always the same array reference between writes. */
export function getHistorySnapshot(): HistoryEntry[] {
  return ensureSnapshot();
}

export function loadHistory(): HistoryEntry[] {
  return ensureSnapshot();
}

/** Prepend a code, deduplicate by payload, keep the newest 10. */
export function rememberCode(config: QrConfig, payloadLength: number): HistoryEntry[] {
  if (config.type === "wifi") {
    config = stripDangerousDefaults(config);
  }
  const next: HistoryEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `h-${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    savedAt: Date.now(),
    type: config.type,
    payloadLength,
    config,
  };
  const rest = ensureSnapshot().filter(
    (entry) => entry.config.payload !== next.config.payload,
  );
  return commit([next, ...rest].slice(0, MAX_ENTRIES));
}

export function forgetAll(): HistoryEntry[] {
  return commit([]);
}
