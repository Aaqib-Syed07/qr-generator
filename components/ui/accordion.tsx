import type { ReactNode } from "react";

/*
  Accordion item built on details and summary, which gives keyboard and
  screen reader support without JavaScript. Used for FAQ sections.
  Group styling: the summary row is the touch target, 44px tall minimum.
*/

export type AccordionItemProps = {
  question: string;
  children: ReactNode;
  open?: boolean;
};

export function AccordionItem({ question, children, open }: AccordionItemProps) {
  return (
    <details className="group rounded-xl border border-border bg-surface-raised" open={open}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-6 py-3 text-body font-medium text-text after:content-['']">
        {question}
        <span
          aria-hidden="true"
          className="text-text-muted transition-transform group-open:rotate-90"
        >
          ▸
        </span>
      </summary>
      <div className="border-t border-border px-6 py-4 text-body text-text-muted">
        {children}
      </div>
    </details>
  );
}
