"use client";

import { useState } from "react";
import type { DragEvent } from "react";

/*
  File dropzone for the logo upload. States per docs/DESIGN_SYSTEM.md:
  default, drag over, error (wrong type) and has file. Keyboard users get
  a visible focus ring on the zone through focus-within. The logo never
  leaves the browser in Phase 0, so nothing is uploaded here.
*/

export type FileDropzoneProps = {
  id: string;
  label: string;
  accept: string;
  helper?: string;
  maxBytes?: number;
  /**
   * Receives the validated file. Phase 1 reads it in the browser only:
   * the logo becomes a data URL inside QrConfig and never leaves the
   * device. Omit it for storage-only use.
   */
  onFile?: (file: File) => void;
};

export function FileDropzone({
  id,
  label,
  accept,
  helper,
  maxBytes = 500_000,
  onFile,
}: FileDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadFile(file: File | undefined) {
    if (!file) return;
    const typeOk = file.type === "image/png" || file.type === "image/svg+xml";
    if (!typeOk) {
      setFileName(null);
      setError("This file type is not supported. Use PNG or SVG.");
      return;
    }
    if (file.size > maxBytes) {
      setFileName(null);
      setError(
        `This file is ${(file.size / 1000).toFixed(0)} KB. Use a file under ${
          maxBytes / 1000
        } KB.`
      );
      return;
    }
    setError(null);
    setFileName(file.name);
    onFile?.(file);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    loadFile(event.dataTransfer.files[0]);
  }

  const errorId = `${id}-error`;
  const fileId = `${id}-file`;

  return (
    <div className="w-full">
      <label htmlFor={fileId} className="mb-2 block text-small font-medium text-text">
        {label}
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={
          "flex min-h-32 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-6 text-center focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[color:var(--primary)] " +
          (dragOver ? "border-primary bg-surface" : "border-border bg-surface")
        }
      >
        <label
          htmlFor={fileId}
          className="cursor-pointer text-body text-primary underline"
        >
          Choose a file or drop it here
        </label>
        <input
          id={fileId}
          type="file"
          accept={accept}
          onChange={(event) => loadFile(event.target.files?.[0])}
          className="sr-only"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error) || undefined}
        />
        <p className="text-small text-text-muted">
          {fileName
            ? `Selected: ${fileName}`
            : (helper ?? "PNG or SVG, up to 500 KB.")}
        </p>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
