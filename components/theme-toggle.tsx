"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, THEME_VALUES, type ThemeValue } from "@/lib/theme";

/*
  Manual theme toggle that persists. The class on <html> is set by an
  inline script before paint, and this component syncs with the same
  source (localStorage plus the OS preference) through an external store,
  so server rendering and hydration agree on "system" until the real
  stored value is read after mount.

  Usable value: useSyncExternalStore handles it without hydration errors.
  States: each radio has default, hover, focus and active styles.
*/

const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  window.addEventListener("storage", onStoreChange);

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  function onSystemChange(): void {
    if (getSnapshot() === "system") {
      document.documentElement.classList.toggle("dark", systemDark.matches);
    }
    onStoreChange();
  }
  systemDark.addEventListener("change", onSystemChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    systemDark.removeEventListener("change", onSystemChange);
  };
}

function getSnapshot(): ThemeValue {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_VALUES.includes(stored as ThemeValue)
    ? (stored as ThemeValue)
    : "system";
}

function getServerSnapshot(): ThemeValue {
  return "system";
}

function setTheme(next: ThemeValue): void {
  const dark =
    next === "dark" ||
    (next === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode). The choice just does not persist.
  }
  notify();
}

const optionLabels = { light: "Light", system: "System", dark: "Dark" };

export function ThemeToggle() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function onKeyDown(event: React.KeyboardEvent) {
    const index = THEME_VALUES.indexOf(value);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setTheme(THEME_VALUES[(index + 1) % THEME_VALUES.length]);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setTheme(
        THEME_VALUES[(index - 1 + THEME_VALUES.length) % THEME_VALUES.length]
      );
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      onKeyDown={onKeyDown}
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1"
    >
      {THEME_VALUES.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setTheme(option)}
            className={
              "min-h-11 cursor-pointer rounded-md px-4 py-2 text-small transition-colors " +
              (selected
                ? "bg-primary text-primary-text"
                : "bg-transparent text-text-muted hover:text-text active:bg-surface-raised")
            }
          >
            {optionLabels[option]}
          </button>
        );
      })}
    </div>
  );
}
