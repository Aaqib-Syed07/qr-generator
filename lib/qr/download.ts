/*
  Blob download plumbing for the generator. Names are descriptive and
  dated; no payload content goes into file names, so a Wi-Fi download
  does not leak an SSID or password into the file name or browser
  history of the download list.
*/

export function downloadBlob(blob: Blob, name: string, extension: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name}.${extension}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  } finally {
    // Revoke on the next tick so Safari does not cancel a click that
    // has not propagated yet.
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

export function downloadBytes(
  bytes: Uint8Array,
  name: string,
  extension: string,
  mimeType: string,
): void {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  downloadBlob(new Blob([buffer], { type: mimeType }), name, extension);
}

export function downloadSvgText(
  svg: string,
  name: string,
): void {
  downloadBlob(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    name,
    "svg",
  );
}
