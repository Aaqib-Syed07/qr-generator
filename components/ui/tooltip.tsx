import type { ReactNode } from "react";

/*
  CSS only tooltip: visible on hover and on keyboard focus through
  focus-within, announced through aria-describedby. Never the only place
  critical information lives, per good practice for tooltips.
*/

export type TooltipProps = {
  id: string;
  tooltip: string;
  children: ReactNode;
};

export function Tooltip({ id, tooltip, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        id={id}
        role="tooltip"
        className={
          "pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max max-w-64 -translate-x-1/2 rounded-lg bg-surface-raised px-4 py-2 text-caption text-text shadow-md " +
          "group-hover:block group-focus-within:block"
        }
      >
        {tooltip}
      </span>
    </span>
  );
}
