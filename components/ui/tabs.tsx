"use client";

import { useId, useState } from "react";

/*
  Tabs with the WAI-ARIA tab pattern: roving tabindex plus arrow key
  navigation. Used for content, design and export panels in the generator.
*/

export type TabItem = { id: string; label: string; content: React.ReactNode };

export type TabsProps = {
  label: string;
  items: TabItem[];
};

export function Tabs({ label, items }: TabsProps) {
  const selectedId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];
  const baseId = `${selectedId}-tab`;

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveIndex((activeIndex + 1) % items.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveIndex((activeIndex - 1 + items.length) % items.length);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1"
      >
        {items.map((item, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={item.id}
              id={`${baseId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={
                "min-h-11 cursor-pointer rounded-md px-4 py-2 text-small transition-colors " +
                (selected
                  ? "bg-primary text-primary-text"
                  : "bg-transparent text-text-muted hover:text-text")
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-${active.id}`}
        tabIndex={0}
        className="mt-4"
      >
        {active.content}
      </div>
    </div>
  );
}
