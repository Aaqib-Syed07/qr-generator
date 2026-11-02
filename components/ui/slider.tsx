import type { InputHTMLAttributes, ReactNode } from "react";
import { Field, fieldDescribedBy } from "@/components/ui/field";

/*
  Range slider using the native input for keyboard and screen reader support.
  accent-color comes from the --primary token.
*/

export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  id: string;
  label: string;
  helper?: ReactNode;
  error?: ReactNode;
};

export function Slider({ id, label, helper, error, ...props }: SliderProps) {
  return (
    <Field id={id} label={label} helper={helper} error={error}>
      <input
        {...props}
        id={id}
        type="range"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={fieldDescribedBy(id, helper, error)}
        className={
          "h-11 w-full cursor-pointer [accent-color:var(--primary)] " +
          (error ? "border-error" : "")
        }
      />
    </Field>
  );
}
