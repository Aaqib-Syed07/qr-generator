import type { ButtonHTMLAttributes, ReactNode } from "react";

/*
  Buttons per docs/DESIGN_SYSTEM.md: primary, secondary, ghost, destructive,
  sizes sm, md, lg. Every state (hover, active, disabled, loading) is styled
  with tokens only. sm and md are 44px tall to meet the touch target rule.
*/

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-text hover:bg-primary-hover active:bg-primary-hover",
  secondary:
    "border border-border bg-surface-raised text-text hover:bg-surface active:bg-surface",
  ghost:
    "bg-transparent text-text hover:bg-surface active:bg-surface-raised",
  destructive:
    "bg-error text-primary-text hover:brightness-90 active:brightness-90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-small",
  md: "min-h-11 px-4 text-body",
  lg: "min-h-12 px-6 text-body",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 " +
        variantClasses[variant] +
        " " +
        sizeClasses[size] +
        " " +
        className
      }
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

/*
  Icon-only button. The accessible label is required because there is no
  visible text to derive one from.
*/
export type IconButtonProps = Omit<ButtonProps, "children"> & {
  label: string;
  icon: ReactNode;
};

export function IconButton({ label, icon, size = "md", ...props }: IconButtonProps) {
  return (
    <Button
      {...props}
      size={size}
      aria-label={label}
      className={size === "sm" ? "min-h-11 min-w-11 px-2" : "min-h-12 min-w-12 px-3"}
    >
      <span aria-hidden="true" className="inline-block">
        {icon}
      </span>
    </Button>
  );
}
