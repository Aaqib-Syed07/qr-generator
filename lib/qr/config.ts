import type { FieldValues, QrTypeSlug } from "./payload";

/*
  The single serializable QrConfig object per docs/PRD.md P1-3. Everything
  the generator produces and every saved history entry reduces to one
  QrConfig, so it stays JSON-safe: no File objects, no Blobs, colors as
  hex strings and the logo as a data URL.
*/

export type Ecc = "L" | "M" | "Q" | "H";

export type DotStyle =
  | "square"
  | "rounded"
  | "dots"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type CornerSquareStyle =
  | "square"
  | "rounded"
  | "extra-rounded"
  | "dot"
  | "classy"
  | "classy-rounded";

export type CornerDotStyle =
  | "square"
  | "rounded"
  | "dot"
  | "classy"
  | "classy-rounded"
  | "extra-rounded";

export type Gradient = {
  /** Rotation in radians. 0 is left to right, Math.PI is right to left. */
  rotation: number;
  from: string;
  to: string;
};

export type QrDesign = {
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  /** Dot color as hex "#0f172a". */
  fg: string;
  /** Quiet zone and panel color as hex "#ffffff". */
  bg: string;
  /** Optional different color for both corner squares and corner dots. */
  cornerFg: string | null;
  gradient: Gradient | null;
  /** Whether light and dark colors are swapped. Warned in the checker. */
  invert: boolean;
  /** Quiet zone in modules, target 4 or more. */
  marginModules: number;
  /** Call to action frame. Stays off by default. */
  frame: { enabled: boolean; text: string } | null;
  logo: {
    /** Data URL of a small PNG or SVG the user picked in the browser. */
    dataUrl: string;
    /** Percent of the code area covered by the logo, max 30 shown. */
    sizePercent: number;
  } | null;
};

export type QrExportOptions = {
  /** PNG edge length in px, capped at 4000 per docs/PRD.md FR-4. */
  pngSize: number;
  /** Printed PDF side length in millimeters. */
  pdfSizeMm: number;
};

export type QrConfig = {
  type: QrTypeSlug;
  /** The encoded payload string, empty until every field is valid. */
  payload: string;
  ecc: Ecc;
  design: QrDesign;
  export: QrExportOptions;
  /*
    Per-type raw field values, keyed by field id. Managed by the field
    schemas in lib/qr/fields.ts and turned into the final string by
    encodePayload in lib/qr/payload.ts.
  */
  values: FieldValues;
};

export const MAX_PNG_SIZE = 4000;

/*
  The defaults below are "adjustable guidance", not physics: they encode
  what the scan readiness checker recommends, with the thresholds being
  revisited from real decode tests in lib/qr/thresholds.ts.
*/

export const defaultDesign: QrDesign = {
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  fg: "#0f172a",
  bg: "#ffffff",
  cornerFg: null,
  gradient: null,
  invert: false,
  marginModules: 4,
  frame: { enabled: false, text: "Scan me." },
  logo: null,
};

export const defaultExport: QrExportOptions = {
  pngSize: 1024,
  pdfSizeMm: 40,
};

/** Templates are pure presets of a QrDesign for FR-3 (12 or more). */
export type QrTemplate = {
  id: string;
  name: string;
  design: Omit<QrDesign, "marginModules" | "invert" | "logo" | "frame">;
};

export const qrTemplates: QrTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    design: {
      dotStyle: "square",
      cornerSquareStyle: "square",
      cornerDotStyle: "square",
      fg: "#0f172a",
      bg: "#ffffff",
      cornerFg: null,
      gradient: null,
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    design: {
      dotStyle: "rounded",
      cornerSquareStyle: "rounded",
      cornerDotStyle: "rounded",
      fg: "#1e293b",
      bg: "#e2e8f0",
      cornerFg: null,
      gradient: null,
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    design: {
      dotStyle: "rounded",
      cornerSquareStyle: "rounded",
      cornerDotStyle: "square",
      fg: "#1d4ed8",
      bg: "#ffffff",
      cornerFg: "#1e3a8a",
      gradient: null,
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    design: {
      dotStyle: "extra-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      fg: "#be123c",
      bg: "#fff1f2",
      cornerFg: "#9f1239",
      gradient: null,
    },
  },
  {
    id: "forest",
    name: "Forest",
    design: {
      dotStyle: "classy",
      cornerSquareStyle: "classy",
      cornerDotStyle: "square",
      fg: "#14532d",
      bg: "#f0fdf4",
      cornerFg: "#166534",
      gradient: null,
    },
  },
  {
    id: "mono",
    name: "Mono",
    design: {
      dotStyle: "dots",
      cornerSquareStyle: "dot",
      cornerDotStyle: "dot",
      fg: "#171717",
      bg: "#ffffff",
      cornerFg: null,
      gradient: null,
    },
  },
  {
    id: "dots-hue",
    name: "Dots, hue shift",
    design: {
      dotStyle: "dots",
      cornerSquareStyle: "square",
      cornerDotStyle: "square",
      fg: "#0e7490",
      bg: "#ecfeff",
      cornerFg: "#155e75",
      gradient: null,
    },
  },
  {
    id: "ember",
    name: "Ember",
    design: {
      dotStyle: "classy-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      fg: "#c2410c",
      bg: "#fff7ed",
      cornerFg: "#9a3412",
      gradient: null,
    },
  },
  {
    id: "plum",
    name: "Plum",
    design: {
      dotStyle: "rounded",
      cornerSquareStyle: "rounded",
      cornerDotStyle: "dot",
      fg: "#6b21a8",
      bg: "#faf5ff",
      cornerFg: "#581c87",
      gradient: null,
    },
  },
  {
    id: "steel",
    name: "Steel",
    design: {
      dotStyle: "square",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "square",
      fg: "#334155",
      bg: "#f8fafc",
      cornerFg: "#0f172a",
      gradient: null,
    },
  },
  {
    id: "swirl",
    name: "Swirl gradient",
    design: {
      dotStyle: "extra-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      fg: "#1d4ed8",
      bg: "#ffffff",
      cornerFg: "#9333ea",
      gradient: { rotation: 0.9, from: "#1d4ed8", to: "#9333ea" },
    },
  },
  {
    id: "citrus",
    name: "Citrus gradient",
    design: {
      dotStyle: "classy-rounded",
      cornerSquareStyle: "classy",
      cornerDotStyle: "square",
      fg: "#b45309",
      bg: "#ffffff",
      cornerFg: "#ea580c",
      gradient: { rotation: 2.1, from: "#ea580c", to: "#16a34a" },
    },
  },
];

/** Every template keeps the checker's recommended baseline, never weakens it. */
export function designFromTemplate(
  config: QrConfig,
  templateId: string,
): QrConfig {
  const template = qrTemplates.find((item) => item.id === templateId);
  if (!template) return config;
  return {
    ...config,
    design: {
      ...defaultDesign,
      ...template.design,
      marginModules: config.design.marginModules,
      invert: config.design.invert,
      frame: config.design.frame,
      logo: config.design.logo,
    },
  };
}
