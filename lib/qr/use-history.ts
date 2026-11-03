"use client";

import { useSyncExternalStore } from "react";
import {
  getHistorySnapshot,
  subscribeHistory,
  type HistoryEntry,
} from "./history";

const EMPTY: HistoryEntry[] = [];

/*
  The localStorage download history (P1-7) as an external store: React
  reads it reactively without a setState-in-effect hydration dance.
  The server snapshot is always the same empty array.
*/
export function useSavedHistory(): HistoryEntry[] {
  return useSyncExternalStore(subscribeHistory, getHistorySnapshot, () => EMPTY);
}
