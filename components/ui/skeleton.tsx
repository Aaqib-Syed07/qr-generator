/*
  Skeleton loaders. Loading placeholders stay invisible to assistive tech
  and the visible loading text next to them carries the message.
*/

export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={"block animate-pulse rounded-lg bg-surface " + className}
    />
  );
}

export type LoadingProps = {
  text: string;
};

export function Loading({ text }: LoadingProps) {
  return (
    <span className="inline-flex items-center gap-2 text-small text-text-muted">
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      {text}
    </span>
  );
}
