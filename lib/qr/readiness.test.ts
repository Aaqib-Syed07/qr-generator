import { describe, expect, it } from "vitest";
import {
  checkContrast,
  checkLogoCoverage,
  checkModuleSize,
  checkQuietZone,
  checkInversion,
  contrastRatio,
  evaluateReadiness,
} from "./readiness";

/*
  Readiness checker unit tests per docs/PRD.md P1-4. Thresholds are
  labeled adjustable guidance in lib/qr/thresholds.ts; these tests pin
  the boundary behavior, not the exact numbers, so retunes stay safe.
*/

const base = {
  contrast: 12,
  quietZone: 4,
  frameOn: false,
  logoPercent: 0,
  moduleMm: 1.2,
  invert: false,
};

describe("contrastRatio", () => {
  it("is monotonic in luminance difference", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeGreaterThan(
      contrastRatio("#333333", "#ffffff"),
    );
  });

  it("matches the known WCAG value for near black on white", () => {
    // WCAG documents 21:1 for pure black on pure white.
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("handles 3 digit hex", () => {
    expect(contrastRatio("#000", "#fff")).toBe(
      contrastRatio("#000000", "#ffffff"),
    );
  });
});

describe("checkContrast", () => {
  it("passes high contrast", () => {
    expect(checkContrast({ ...base, contrast: 7 }).state).toBe("pass");
  });

  it("warns in the middle band and fails below", () => {
    expect(checkContrast({ ...base, contrast: 2.8 }).state).toBe("warn");
    expect(checkContrast({ ...base, contrast: 1.1 }).state).toBe("fail");
  });
});

describe("checkQuietZone", () => {
  it("passes at the spec value", () => {
    expect(checkQuietZone({ ...base, quietZone: 4 }).state).toBe("pass");
  });

  it("fails under the spec minimum", () => {
    expect(checkQuietZone({ ...base, quietZone: 1 }).state).toBe("fail");
  });

  it("counts the frame band against the quiet zone", () => {
    expect(
      checkQuietZone({ ...base, quietZone: 6, frameOn: true }).state,
    ).toBe("pass");
    expect(
      checkQuietZone({ ...base, quietZone: 4, frameOn: true }).state,
    ).toBe("warn");
  });
});

describe("checkLogoCoverage", () => {
  it("flags an oversized logo as fail", () => {
    expect(checkLogoCoverage({ ...base, logoPercent: 31 }).state).toBe("fail");
  });

  it("warns at the boundary band", () => {
    expect(checkLogoCoverage({ ...base, logoPercent: 25 }).state).toBe("warn");
  });

  it("passes small logos and no logo", () => {
    expect(checkLogoCoverage({ ...base, logoPercent: 15 }).state).toBe("pass");
    expect(checkLogoCoverage({ ...base, logoPercent: 0 }).state).toBe("pass");
  });
});

describe("checkModuleSize", () => {
  it("passes comfortable print sizes", () => {
    expect(checkModuleSize({ ...base, moduleMm: 0.9 }).state).toBe("pass");
  });

  it("warns small and fails too small", () => {
    expect(checkModuleSize({ ...base, moduleMm: 0.6 }).state).toBe("warn");
    expect(checkModuleSize({ ...base, moduleMm: 0.4 }).state).toBe("fail");
  });
});

describe("checkInversion", () => {
  it("warns on inverted colors", () => {
    expect(checkInversion({ ...base, invert: true }).state).toBe("warn");
    expect(checkInversion({ ...base, invert: false }).state).toBe("pass");
  });
});

describe("evaluateReadiness", () => {
  it("returns all checks in presentation order", () => {
    const config = {
      type: "url" as const,
      payload: "https://example.com/scan",
      ecc: "M" as const,
      export: { pngSize: 1024, pdfSizeMm: 40 },
      design: {
        dotStyle: "square" as const,
        cornerSquareStyle: "square" as const,
        cornerDotStyle: "square" as const,
        fg: "#0f172a",
        bg: "#ffffff",
        cornerFg: null,
        gradient: null,
        invert: false,
        marginModules: 4,
        frame: { enabled: false, text: "Scan me." },
        logo: null,
      },
      values: {
        url: "https://example.com/scan",
      },
    };
    const input = evaluateReadiness(config);
    expect(input.map((check) => check.name)).toEqual([
      "Contrast",
      "Quiet zone",
      "Logo coverage",
      "Print size",
      "Inverted colors",
    ]);
    // The acceptance case: everything green for a stock styled code.
    expect(input.every((check) => check.state === "pass")).toBe(true);
  });
});
