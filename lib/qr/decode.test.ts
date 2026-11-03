import { describe, expect, it } from "vitest";
import { Resvg } from "@resvg/resvg-js";
import jsQR from "jsqr";
import QRCodeStyling from "qr-code-styling";
import { readBarcodes } from "zxing-wasm/reader";

import { engineOptions, marginPixels } from "./engine";
import type { QrConfig } from "./config";
import { defaultDesign } from "./config";
import { socialPlatforms } from "./payload";
import { frameExtension } from "./frame";
import { ShimJsdomFacade } from "./test-dom";

/*
  Decode test suite per docs/PRD.md P1-8: every payload format and every
  shipped template/style family must decode with at least two decoder
  libraries, and any miss fails the build (the test script exits
  non-zero, so a run before `next build` gates Phase 1).

  Pipeline: the real engine option mapping (engineOptions, including
  exact quiet-zone pixels and the frame extension) -> SVG via
  qr-code-styling under jsdom -> rasterized with resvg-js -> decoded
  with jsQR (raw RGBA) and zxing-wasm (PNG bytes).
*/

type EngineCtorArgs = NonNullable<ConstructorParameters<typeof QRCodeStyling>[0]>;

async function renderSvg(config: QrConfig, px = 480): Promise<string> {
  const options: EngineCtorArgs = {
    ...engineOptions(config, px),
    jsdom: ShimJsdomFacade,
  } as EngineCtorArgs;
  const instance = new QRCodeStyling(options);
  const design = config.design;
  if (design.frame?.enabled && design.frame.text.trim() !== "") {
    instance.applyExtension(
      frameExtension({
        text: design.frame.text,
        backgroundColor: design.bg,
        foregroundColor: design.cornerFg ?? design.gradient?.from ?? design.fg,
      }),
    );
  }
  const raw = await instance.getRawData("svg");
  if (raw === null) {
    throw new Error("Render produced no SVG data");
  }
  return (raw as Buffer).toString("utf8");
}

async function decodeAll(config: QrConfig, px = 480): Promise<[jsQRResult, zxingResult]> {
  return Promise.all([decodeJsQR(config, px), decodeZXing(config, px)]);
}

type jsQRResult = string | null;
type zxingResult = string | null;

/**
 * The engine ships the SVG with quoted functional IRIs (valid SVG, all
 * browsers render it); the test rasterizer's SVG parser expects the
 * unquoted form, so normalize before rasterizing — test plumbing only,
 * the exported bytes are untouched.
 */
export function stripQuotedIris(svg: string): string {
  return svg.replace(/url\('#([^']+)'\)/g, "url(#$1)");
}

async function decodeJsQR(config: QrConfig, px = 480): Promise<jsQRResult> {
  const svg = await renderSvg(config, px);
  const bitmap = new Resvg(stripQuotedIris(svg), {
    fitTo: { mode: "width", value: px },
  }).render();
  const rgba = new Uint8ClampedArray(bitmap.pixels);
  const found = jsQR(rgba, bitmap.width, bitmap.height, {
    inversionAttempts: "dontInvert",
  });
  return found?.data ?? null;
}

async function decodeZXing(config: QrConfig, px = 480): Promise<string | null> {
  const svg = await renderSvg(config, px);
  const png = new Resvg(stripQuotedIris(svg)).render().asPng();
  const results = await readBarcodes(new Uint8Array(png), {
    tryHarder: true,
  });
  return results[0]?.text ?? null;
}

const baseConfig = (slug: QrConfig["type"], payload: string): QrConfig => ({
  type: slug,
  payload,
  ecc: "M",
  design: { ...defaultDesign },
  export: { pngSize: 1024, pdfSizeMm: 40 },
  values: {},
});

/*
  The 13 launch payloads, encoder output, pinned formats. These exact
  payload strings are what the decode pipeline must reproduce, all
  through our engine mapping: quiet zone px math included.
*/

const typePayloads: [QrConfig["type"], string][] = [
  ["url", "https://example.com/menu"],
  ["text", "Welcome! Today's special is tulip dal."],
  ["email", "mailto:hello@cafe.example?subject=Table%20booking&body=two%20people"],
  ["phone", "tel:+919876543210"],
  ["sms", "SMSTO:9876543210:Feedback STOP to opt out"],
  ["wifi", 'WIFI:T:WPA;S:Cafe\\;Guest\\,WiFi;P:couchpotato;H:false;;'],
  ["vcard", [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Rao;Asha;;;",
    "FN:Asha Rao",
    "ORG:Asha Textiles",
    "TEL;TYPE=CELL:+91 98765 43210",
    "EMAIL:asha@ashatextiles.example",
    "URL:https://ashatextiles.example",
    "END:VCARD",
  ].join("\r\n")],
  ["location", "geo:11.016844,76.955833"],
  [
    "event",
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Signet//QR generator//EN",
      "BEGIN:VEVENT",
      "SUMMARY:Sunday workshop",
      "LOCATION:Community hall, MG Road",
      "DTSTART:20260301T103000",
      "DTEND:20260301T123000",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n"),
  ],
  ["upi", "upi://pay?pa=shop%40upi&pn=Asha%20Textiles&am=199.00&cu=INR"],
  ["review", "https://search.google.com/local/writereview?placeid=ChIJbogus123"],
  ["social", `${socialPlatforms[0]?.base}ashatextiles`],
  ["app-store", "https://play.google.com/store/apps/details?id=com.example.app"],
];

describe("decode suite, all 13 types at stock style", () => {
  for (const [slug, payload] of typePayloads) {
    it(`decodes ${slug} with both decoders`, async () => {
      const [jsQrPayload, zxingPayload] = await decodeAll(baseConfig(slug, payload));
      expect(jsQrPayload).toBe(payload);
      expect(zxingPayload).toBe(payload);
    }, 30_000);
  }
});

describe("decode suite, styled and decorated variants", () => {
  it("decodes rounded dots with corner styles and ecc Q", async () => {
    const config = baseConfig("url", "https://example.com/styled");
    config.ecc = "Q";
    config.design = {
      ...config.design,
      dotStyle: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      fg: "#1d4ed8",
      bg: "#ffffff",
    };
    const [jsQrPayload, zxingPayload] = await decodeAll(config);
    expect(jsQrPayload).toBe("https://example.com/styled");
    expect(zxingPayload).toBe("https://example.com/styled");
  }, 30_000);

  it("decodes dots style with ecc H", async () => {
    const config = baseConfig("text", "dots with heavy damage tolerance");
    config.ecc = "H";
    config.design = {
      ...config.design,
      dotStyle: "dots",
      cornerSquareStyle: "dot",
      cornerDotStyle: "dot",
    };
    const [jsQrPayload, zxingPayload] = await decodeAll(config);
    expect(jsQrPayload).toBe("dots with heavy damage tolerance");
    expect(zxingPayload).toBe("dots with heavy damage tolerance");
  }, 30_000);

  it("decodes a gradient filled code", async () => {
    const config = baseConfig("url", "https://example.com/gradient");
    config.design = {
      ...config.design,
      dotStyle: "extra-rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      fg: "#1d4ed8",
      bg: "#ffffff",
      cornerFg: "#155e75",
      gradient: { rotation: 0.9, from: "#1d4ed8", to: "#155e75" },
    };
    const [jsQrPayload, zxingPayload] = await decodeAll(config);
    expect(jsQrPayload).toBe("https://example.com/gradient");
    expect(zxingPayload).toBe("https://example.com/gradient");
  }, 30_000);

  it("decodes the call to action frame, with a wide quiet zone", async () => {
    const config = baseConfig("url", "https://example.com/framed");
    config.design = {
      ...config.design,
      marginModules: 8,
      frame: { enabled: true, text: "Scan me." },
    };
    const [jsQrPayload, zxingPayload] = await decodeAll(config);
    expect(jsQrPayload).toBe("https://example.com/framed");
    expect(zxingPayload).toBe("https://example.com/framed");
  }, 30_000);

  it("keeps the exact quiet zone formulas consistent", () => {
    // 480 px canvas, 25 modules, 4 module quiet zone:
    // margin = 4*480/33 = 58.18 -> 58 px; 58 / ((480-116)/25) = 3.98 modules.
    expect(marginPixels(480, 25, 4)).toBe(58);
  });
});
