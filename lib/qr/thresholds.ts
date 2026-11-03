/*
  Scan readiness thresholds, per docs/PRD.md P1-4. ADJUSTABLE GUIDANCE:
  these are starting points from QR spec guidance, not physics. They
  live in this one file so results from real decoder tests (P1-8) or
  field data can retune them without touching user-facing code.
*/

/** Contrast in the WCAG relative luminance sense. */
export const CONTRAST = {
  /** At or above this ratio the check passes. */
  pass: 3.5,
  /** At or above this and below pass, warning. Below this, fail. */
  warn: 2.0,
} as const;

/** Quiet zone in modules. The QR spec asks for 4; 2 is a bare minimum. */
export const QUIET_ZONE = {
  pass: 4,
  warn: 2,
} as const;

/**
 * Logo coverage as a percent of the code area. With error correction M
 * around 15 percent of hidden modules stays decodable; 20 keeps a
 * safety margin, 30 is the edge and only reasonable with Q or H.
 */
export const LOGO_COVERAGE = {
  pass: 20,
  warn: 30,
} as const;

/**
 * Printed module size in millimeters. Phones comfortably read modules
 * of 0.8 mm and above at close range; below 0.5 mm is unreliable.
 */
export const MODULE_SIZE_MM = {
  pass: 0.8,
  warn: 0.5,
} as const;

/** Below the warn floor of any check the overall list turns into a fail. */
export const OVERALL = {
  /** Any check at this state means "do not ship the code". */
  fail: "fail",
} as const;
