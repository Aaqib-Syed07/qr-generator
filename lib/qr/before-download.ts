/*
  The single download interception point per docs/PRD.md P1-6. Every
  download in the app passes through beforeDownload. In Phase 5 this
  hook becomes the ad gate: free users watch the reward ad, paid
  users pass at once, and any failure falls open within 4 seconds.
  Until then it returns true immediately, so the download flow is
  already shaped the way the gate needs (see components/ui/
  download-ad-modal for the same contract from the other side).
*/

export type DownloadFormat = "png" | "svg" | "pdf";

export type DownloadContext = {
  format: DownloadFormat;
};

export async function beforeDownload(ctx: DownloadContext): Promise<boolean> {
  // Phase 5: replace with the real gate. Never remove this hook: the
  // PRD requires every download to go through it. The context stays
  // wired now so the swap never touches call sites.
  await Promise.resolve(ctx.format);
  return true;
}
