import type { ReactNode } from "react";

/*
  Basic card container. Borders over shadows; shadow-sm is only for cards
  that react to hover.
*/

export type CardProps = {
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
};

export function Card({ children, hoverable = false, className = "" }: CardProps) {
  return (
    <div
      className={
        "rounded-xl border border-border bg-surface-raised p-6 " +
        (hoverable ? "hover:shadow-sm " : "") +
        className
      }
    >
      {children}
    </div>
  );
}
