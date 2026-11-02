import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { Field, fieldDescribedBy } from "@/components/ui/field";

/*
  Text inputs per docs/DESIGN_SYSTEM.md. Every control is at least 16px
  body text on mobile so mobile browsers do not zoom on focus.
  Text is at least 16px on mobile, per the design system body rule.
*/

const controlClasses =
  "w-full min-h-11 rounded-lg border bg-surface-raised px-4 py-2 text-body text-text placeholder:text-text-muted";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: ReactNode;
};

export function Input({ id, label, helper, error, ...props }: InputProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error}>
      <input
        {...props}
        id={id}
        type={props.type ?? "text"}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescribedBy(id, helper, error)}
        className={controlClasses + (error ? " border-error" : " border-border")}
      />
    </Field>
  );
}

export type NumberInputProps = InputProps;

export function NumberInput(props: NumberInputProps) {
  return <Input {...props} type="number" />;
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: ReactNode;
};

export function Textarea({
  id,
  label,
  helper,
  error,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error}>
      <textarea
        {...props}
        id={id}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescribedBy(id, helper, error)}
        className={
          controlClasses + " min-h-24" + (error ? " border-error" : " border-border")
        }
      />
    </Field>
  );
}
