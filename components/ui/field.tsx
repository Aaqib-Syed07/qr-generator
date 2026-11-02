import type { ReactNode } from "react";

/*
  Shared form field structure per docs/DESIGN_SYSTEM.md: label, helper text
  and error text for every input. Errors are linked to the control with
  aria-describedby and always explain how to fix the problem.
*/

export type FieldProps = {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
};

export function fieldDescribedBy(id: string, helper?: unknown, error?: unknown): string | undefined {
  const ids: string[] = [];
  if (helper) ids.push(`${id}-helper`);
  if (error) ids.push(`${id}-error`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function Field({ id, label, helper, error, children }: FieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-small font-medium text-text">
        {label}
      </label>
      {children}
      {helper ? (
        <p id={`${id}-helper`} className="mt-1 text-small text-text-muted">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-small text-error">
          <span aria-hidden="true" className="mr-1">
            ▲
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}
