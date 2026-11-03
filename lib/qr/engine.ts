import QRCodeStyling from "qr-code-styling";
import type { Options as StylingOptions } from "qr-code-styling";
import { encode as encodeMatrix } from "uqr";
import type { Ecc, QrConfig } from "./config";
import { MAX_PNG_SIZE } from "./config";
import { frameExtension } from "./frame";

/*
  QrEngine wrapper per docs/PRD.md P1-1. Library choice: qr-code-styling
  1.9.x (MIT, Denys Kozak), picked because it natively renders every
  design option FR-3 needs: dot styles, corner square and dot styles,
  gradients, logo and background, and exports SVG and PNG in the
  browser. Payload correctness is verified by the P1-8 decode suite
  rather than trusted blindly. This wrapper is the only file that knows
  the library; replacing it later means changing only this mapping.

  The matrix size lookup uses uqr (MIT, unjs) purely to convert a quiet
  zone asked for in modules into exact pixels; the decode suite
  cross-checks that both implementations agree on module counts.
*/

export type { StylingOptions };

export type StylingOptionsInput = StylingOptions;

/** Point conversion: pdf-lib page coordinates are points. */
const POINTS_PER_MM = 72 / 25.4;
const PREVIEW_PX = 512;

export type DotCoverage = {
  /** Matrix module count along one edge, e.g. 25. */
  moduleCount: number;
};

/**
 * The matrix size the engine will encode for this payload and ECC from
 * the reference implementation in uqr.
 */
export function matrixInfo(payload: string, ecc: Ecc): DotCoverage {
  const { size } = encodeMatrix(payload, { ecc });
  return { moduleCount: size };
}

/**
 * Quiet zone in modules maps to a pixel margin for a square canvas of
 * `px` px drawn over (px - 2m) px:
 * m / (px - 2m) == marginModules / moduleCount
 * => m = px * marginModules / (moduleCount + 2 * marginModules).
 */
export function marginPixels(
  px: number,
  moduleCount: number,
  marginModules: number,
): number {
  return Math.round((marginModules * px) / (moduleCount + 2 * marginModules));
}

/** Map one serializable QrConfig onto the library's options object. */
export function engineOptions(
  config: QrConfig,
  px: number,
): StylingOptionsInput {
  const design = config.design;
  const { moduleCount } = matrixInfo(config.payload, config.ecc);
  const margin = marginPixels(px, moduleCount, design.marginModules);
  const cornerColor =
    design.cornerFg ?? (design.gradient ? design.gradient.from : design.fg);
  const gradient = design.gradient
    ? {
        type: "linear" as const,
        rotation: design.gradient.rotation,
        colorStops: [
          { offset: 0, color: design.gradient.from },
          { offset: 1, color: design.gradient.to },
        ],
      }
    : undefined;

  return {
    type: "svg",
    width: px,
    height: px,
    data: config.payload,
    margin,
    // Exact pixel layout so the quiet zone math above holds at any size.
    dotsOptions: {
      type: design.dotStyle,
      color: design.gradient ? undefined : design.fg,
      gradient,
      roundSize: false,
    },
    cornersSquareOptions: {
      type: design.cornerSquareStyle,
      color: cornerColor,
      gradient,
    },
    cornersDotOptions: {
      type: design.cornerDotStyle,
      color: cornerColor,
      gradient,
    },
    backgroundOptions: {
      color: design.bg,
    },
    qrOptions: {
      errorCorrectionLevel: config.ecc,
    },
    image: design.logo?.dataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: design.logo ? design.logo.sizePercent / 100 : 0.4,
      margin: 0,
      saveAsBlob: false,
      crossOrigin: "anonymous",
    },
  } as StylingOptionsInput;
}

async function renderStill(
  format: "svg" | "png",
  config: QrConfig,
  px: number,
): Promise<string | ArrayBuffer> {
  const instance = new QRCodeStyling(engineOptions(config, px));
  // PNG renders from a canvas element; SVG from the element itself.
  instance.update({ type: format === "png" ? "canvas" : "svg", width: px, height: px });
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
  const raw = (await instance.getRawData(format)) as Blob | null;
  if (!raw) {
    throw new Error(`The engine could not render the QR code as ${format}.`);
  }
  return raw.type === "image/svg+xml" ? raw.text() : raw.arrayBuffer();
}

export type PdfOptions = {
  /** Physical side length in millimeters of the printed code. */
  sizeMm: number;
};

export class QrEngine {
  private instance: QRCodeStyling | null = null;
  private container: HTMLElement | null = null;
  /** null: no frame state applied yet, true/false: current state. */
  private frameApplied: boolean | null = null;

  /**
   * Live preview. The first call appends one element to `container`;
   * every later call re-renders in place, because the library clears
   * and re-appends its element on update.
   */
  render(config: QrConfig, container: HTMLElement): void {
    if (this.instance) {
      this.syncFrame(config);
      this.instance.update(engineOptions(config, PREVIEW_PX));
      return;
    }
    this.container = container;
    this.instance = new QRCodeStyling(engineOptions(config, PREVIEW_PX));
    this.instance.append(container);
    this.syncFrame(config);
  }

  private syncFrame(config: QrConfig): void {
    if (!this.instance) return;
    const design = config.design;
    const frame = design.frame;
    if (frame && frame.enabled && frame.text.trim() !== "") {
      if (this.frameApplied !== true) {
        this.frameApplied = true;
        this.instance.applyExtension(
          frameExtension({
            text: frame.text,
            backgroundColor: design.bg,
            foregroundColor:
              design.cornerFg ?? design.gradient?.from ?? design.fg,
          }),
        );
      }
    } else if ((!frame || !frame.enabled) && this.frameApplied === true) {
      this.frameApplied = false;
      this.instance.deleteExtension();
    }
  }

  /** Drop the preview element and state; a fresh render starts clean. */
  dispose(): void {
    if (this.container) {
      this.container.replaceChildren();
    }
    this.instance = null;
    this.container = null;
    this.frameApplied = null;
  }

  /** SVG source text, for export and for the decode test suite. */
  async toSvg(config: QrConfig): Promise<string> {
    const svg = await renderStill("svg", config, config.export.pngSize);
    if (typeof svg !== "string") {
      throw new Error("The engine returned binary data instead of SVG.");
    }
    return svg;
  }

  /** PNG blob at up to 4000 px, per docs/PRD.md FR-4. */
  async toPng(config: QrConfig, sizePx: number): Promise<Blob> {
    const px = Math.min(Math.max(1, Math.round(sizePx)), MAX_PNG_SIZE);
    const buffer = await renderStill("png", config, px);
    if (typeof buffer !== "object") {
      throw new Error("The engine returned text instead of PNG data.");
    }
    return new Blob([buffer], { type: "image/png" });
  }

  /**
   * PDF at an exactly sized page, so the code prints at the physical
   * size shown in the export panel. Uses pdf-lib (MIT) to embed the PNG
   * on a page of that exact size at high resolution.
   */
  async toPdf(
    config: QrConfig,
    options: PdfOptions,
  ): Promise<Uint8Array> {
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const sizeMm = Math.max(10, Math.min(500, options.sizeMm));
    const sideLength = sizeMm * POINTS_PER_MM;
    // Raster resolution around 350 dpi, capped by MAX_PNG_SIZE.
    const px = Math.min(Math.round(sizeMm * 13.78), MAX_PNG_SIZE);
    const pngBuffer = await renderStill("png", config, px);
    if (typeof pngBuffer !== "object") {
      throw new Error("The engine returned text instead of PNG data.");
    }
    const image = await pdf.embedPng(new Uint8Array(pngBuffer));
    const page = pdf.addPage([sideLength, sideLength]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: sideLength,
      height: sideLength,
    });
    pdf.setTitle("QR code");
    return pdf.save();
  }
}

/** File naming without leaking payload content into the URL bar. */
export function fileNameFor(config: QrConfig): string {
  const kind =
    config.type === "url" ? "link" : config.type.replace(/[^a-z-]/g, "");
  return `signet-${kind}-${new Date().toISOString().slice(0, 10)}`;
}
