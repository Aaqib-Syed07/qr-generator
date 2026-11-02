import type { SelectHTMLAttributes, ReactNode } from "react";
import { Field, fieldDescribedBy } from "@/components/ui/field";

/*
  Native select, unstyled arrow. The native control keeps the best mobile
  and screen reader behavior, and no extra dependency is needed.
*/

export type SelectOption = { value: string; label: string };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  id,
  label,
  helper,
  error,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error}>
      <select
        {...props}
        id={id}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescribedBy(id, helper, error)}
        className={
          "w-full min-h-11 rounded-lg border bg-surface-raised px-4 py-2 text-body text-text " +
          (error ? "border-error" : "border-border")
        }
      >
        {placeholder ? (
          <option value="">{placeholder}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
