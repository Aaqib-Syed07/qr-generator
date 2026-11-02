"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/*
  Route error boundary. error.message is never rendered directly, so no
  raw technical text or payload leaks to users. Copy per the design
  system: what happened and how to fix it.
*/

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-16 md:px-6"
    >
      <p className="text-caption font-medium uppercase tracking-wider">Error</p>
      <h1 className="mt-2 text-h1 font-bold">Something broke on our side</h1>
      <p className="mt-4 text-body text-text-muted">
        This page hit an error that is not yours to fix. Trying again usually
        works. If you were typing content, you may have lost the draft.
      </p>
      <div className="mt-8">
        <Button onClick={retry}>Try again</Button>
      </div>
    </main>
  );
}
