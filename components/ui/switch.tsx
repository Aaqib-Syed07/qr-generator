"use client";

import { useState } from "react";

/*
  Toggle for boolean settings. The knob position carries the state, so the
  meaning never relies on color alone. Touch target is 44px tall. Motion is
  removed under prefers-reduced-motion by the global rule in globals.css.
*/

export type SwitchProps = {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  helper?: string;
  disabled?: boolean;
};

export function Switch({
  id,
  label,
  checked: controlledChecked,
  onChange,
  helper,
  disabled = false,
}: SwitchProps) {
  /*
    Controlled when the parent passes onChange, otherwise it manages its own
    state. Server components cannot pass functions as props, so the demo
    pages use the internal form.
  */
  const [internalChecked, setInternalChecked] = useState(controlledChecked ?? false);
  const checked = onChange ? controlledChecked ?? false : internalChecked;

  function toggle() {
    if (disabled) return;
    if (onChange) {
      onChange(!checked);
    } else {
      setInternalChecked(!checked);
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    // Left and right toggle so the switch works without spacebar discovery.
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      toggle();
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-small font-medium text-text">
          {label}
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={onKeyDown}
          className={
            "relative inline-flex h-11 w-16 shrink-0 cursor-pointer items-center rounded-full border transition-colors " +
            (checked
              ? "border-primary bg-primary"
              : "border-border bg-surface") +
            (disabled ? " cursor-not-allowed opacity-55" : "")
          }
        >
          <span
            aria-hidden="true"
            className={
              "inline-block h-6 w-6 rounded-full bg-primary-text transition-transform " +
              (checked ? "translate-x-8" : "translate-x-2")
            }
          />
        </button>
      </div>
      {helper ? <p className="mt-1 text-small text-text-muted">{helper}</p> : null}
    </div>
  );
}
