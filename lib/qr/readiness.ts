import { encode as encodeMatrix } from "uqr";
import type { QrConfig } from "./config";
import {
  CONTRAST,
  LOGO_COVERAGE,
  MODULE_SIZE_MM,
  QUIET_ZONE,
} from "./thresholds";

/**
 * How many modules the CTA text band eats from the quiet zone where
 * the pill sits. ADJUSTABLE GUIDANCE: decode tests keep this honest.
 */
export const FRAME_BAND_MODULES = 2;

/*
  Scan readiness checker as pure functions per docs/PRD.md P1-4. Same
  input, same output, no DOM, no engine: the generator maps the result
  onto the ScanReadinessPanel presentation.
*/

export type CheckState = "pass" | "warn" | "fail";

export type CheckVerdict = { state: CheckState; detail: string };

export type ReadinessInput = {
  /** WCAG style contrast ratio between dot color and background. */
  contrast: number;
  /** Quiet zone width in modules, before the frame band. */
  quietZone: number;
  /** True when the CTA frame reduces the usable quiet zone. */
  frameOn: boolean;
  /** Logo coverage in percent of the code area, 0 when absent. */
  logoPercent: number;
  /** Effective printed module size in mm at the configured export size. */
  moduleMm: number;
  /** Light modules on a dark background instead of dark on light. */
  invert: boolean;
};

export type ReadinessCheck = { name: string; state: CheckState; detail: string };

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "").toLowerCase();
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const channels = [0, 2, 4].map((offset) =>
    parseInt(expanded.slice(offset, offset + 2), 16),
  );
  if (channels.some((value) => Number.isNaN(value))) {
    throw new Error(`Not a hex color: ${hex}`);
  }
  const [r, g, b] = channels as [number, number, number];
  const [sr, sg, sb] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * sr! + 0.7152 * sg! + 0.0722 * sb!;
}

/** WCAG contrast ratio: (L1 + 0.05) / (L2 + 0.05), rounded for display. */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const a = relativeLuminance(fgHex);
  const b = relativeLuminance(bgHex);
  return (
    Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) /
    100
  );
}

export function checkContrast(input: ReadinessInput): CheckVerdict {
  const { contrast } = input;
  if (contrast >= CONTRAST.pass) {
    return {
      state: "pass",
      detail: `Contrast is ${contrast.toFixed(1)}:1, comfortable for every scanner.`,
    };
  }
  if (contrast >= CONTRAST.warn) {
    return {
      state: "warn",
      detail: `Contrast is ${contrast.toFixed(1)}:1. Make the dots darker or the background lighter so the print stays consistent.`,
    };
  }
  return {
    state: "fail",
    detail: `Contrast is only ${contrast.toFixed(1)}:1. Most scanners will not read this combination.`,
  };
}

export function checkQuietZone(input: ReadinessInput): CheckVerdict {
  const { quietZone } = input;
  const effective = input.frameOn ? Math.max(0, quietZone - FRAME_BAND_MODULES) : quietZone;
  if (effective >= QUIET_ZONE.pass) {
    return {
      state: "pass",
      detail: `Quiet zone is ${effective} modules, matching the QR spec.`,
    };
  }
  if (effective >= QUIET_ZONE.warn) {
    return {
      state: "warn",
      detail: `Quiet zone is ${effective} modules${input.frameOn ? " after the frame band" : ""}. Four modules or more is safer.`,
    };
  }
  return {
    state: "fail",
    detail: `Quiet zone is ${effective} modules${input.frameOn ? " after the frame band" : ""}, under the spec minimum of two. Scanners will struggle at the edges.`,
  };
}

export function checkLogoCoverage(input: ReadinessInput): CheckVerdict {
  const { logoPercent } = input;
  if (logoPercent === 0) {
    return { state: "pass", detail: "No logo, nothing is covered." };
  }
  if (logoPercent <= LOGO_COVERAGE.pass) {
    return {
      state: "pass",
      detail: `The logo covers about ${logoPercent}% of the code, within the decodable margin.`,
    };
  }
  if (logoPercent <= LOGO_COVERAGE.warn) {
    return {
      state: "warn",
      detail: `The logo covers about ${logoPercent}%. Reduce it, or raise error correction to Q or H.`,
    };
  }
  return {
    state: "fail",
    detail: `The logo covers about ${logoPercent}% and blocks part of the matrix. Pull it back or drop the logo.`,
  };
}

export function checkModuleSize(input: ReadinessInput): CheckVerdict {
  const { moduleMm } = input;
  if (moduleMm >= MODULE_SIZE_MM.pass) {
    return {
      state: "pass",
      detail: `Each module prints at ${moduleMm.toFixed(2)} mm, easy to scan at arm's length.`,
    };
  }
  if (moduleMm >= MODULE_SIZE_MM.warn) {
    return {
      state: "warn",
      detail: `Each module prints at ${moduleMm.toFixed(2)} mm. Increase the export size for reliable scans.`,
    };
  }
  return {
    state: "fail",
    detail: `Each module prints at ${moduleMm.toFixed(2)} mm, too small to trust. Increase the print size.`,
  };
}

export function checkInversion(input: ReadinessInput): CheckVerdict {
  if (!input.invert) {
    return { state: "pass", detail: "Dark modules on a light background." };
  }
  return {
    state: "warn",
    detail:
      "Inverted, light modules on a dark background. Some scanners cope, some older phones do not. Only keep it if you must.",
  };
}

/** Build the checker input from a config, with the real matrix size. */
export function readinessInput(config: QrConfig): ReadinessInput {
  const { size } = encodeMatrix(config.payload, { ecc: config.ecc });
  const moduleMm = config.export.pdfSizeMm / size;
  return {
    contrast: contrastRatio(config.design.fg, config.design.bg),
    quietZone: config.design.marginModules,
    frameOn: config.design.frame?.enabled === true,
    logoPercent: config.design.logo?.sizePercent ?? 0,
    moduleMm,
    invert: config.design.invert,
  };
}

/** Every check for the panel, in presentation order. */
export function evaluateReadiness(config: QrConfig): ReadinessCheck[] {
  const input = readinessInput(config);
  const checks: ReadinessCheck[] = [
    { name: "Contrast", ...checkContrast(input) },
    { name: "Quiet zone", ...checkQuietZone(input) },
    { name: "Logo coverage", ...checkLogoCoverage(input) },
    { name: "Print size", ...checkModuleSize(input) },
    { name: "Inverted colors", ...checkInversion(input) },
  ];
  return checks;
}
