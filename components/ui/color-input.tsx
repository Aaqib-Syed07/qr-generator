"use client";

import { useState } from "react";

/*
  Color picker: native color input plus a hex text field that stays in sync.
  Phase 0 only: the parent passes an initial value and receives changes.
  Purely client side, matching the design studio's offline nature.
*/

const HEX_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export type ColorInputProps = {
  id: string;
  label: string;
  defaultValue: string;
  onChange?: (value: string) => void;
};

export function ColorInput({ id, label, defaultValue, onChange }: ColorInputProps) {
  const [color, setColor] = useState(defaultValue);
  const [text, setText] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  function validNext(value: string): string | null {
    return HEX_PATTERN.test(value) ? value.toLowerCase() : null;
  }

  function onTextChange(value: string) {
    setText(value);
    const valid = validNext(value);
    if (valid) {
      setError(null);
      setColor(valid);
      onChange?.(valid);
    } else if (value.length >= 4) {
      setError("Use a 3 or 6 digit hex color, for example #1D4ED8.");
    } else {
      setError(null);
    }
  }

  const textId = `${id}-text`;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-small font-medium text-text">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={color}
          onChange={(event) => {
            setColor(event.target.value);
            setText(event.target.value);
            setError(null);
            onChange?.(event.target.value);
          }}
          className="h-11 w-16 cursor-pointer rounded-lg border border-border bg-surface-raised p-1"
        />
        <input
          id={textId}
          type="text"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          className={
            "min-h-11 w-32 rounded-lg border bg-surface-raised px-4 py-2 font-mono text-small text-text " +
            (error ? "border-error" : "border-border")
          }
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
