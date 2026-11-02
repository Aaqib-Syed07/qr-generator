"use client";

import "./globals.css";
import { Button } from "@/components/ui/button";

/*
  Global error boundary. It replaces the whole document, so it defines its
  own html and body per the Next.js convention, and imports the same
  tokens as the app.
*/

export default function GlobalErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  console.error(error);
  return (
    <html lang="en">
      <body className="bg-background text-text antialiased">
        <main
          id="main"
          className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center px-4 py-16 md:px-6"
        >
          <p className="text-caption font-medium uppercase tracking-wider">
            Error
          </p>
          <h1 className="mt-2 text-h1 font-bold">
            The site hit an error it could not recover from
          </h1>
          <p className="mt-4 text-body text-text-muted">
            Trying again usually works. Your generated codes never touched a
            server, so nothing you made was lost.
          </p>
          <div className="mt-8">
            <Button onClick={retry}>Try again</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
