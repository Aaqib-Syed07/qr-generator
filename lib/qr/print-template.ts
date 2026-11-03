import { StandardFonts, rgb } from "pdf-lib";

/*
  UPI A5 print template per docs/PRD.md P1-9: an A5 landscape sheet a
  shop can print and put at the counter, with the shop name, the
  payment code and the UPI ID underneath in text, so a customer who
  cannot scan still knows where to pay. Built with pdf-lib (MIT)
  entirely in the browser, no server round trip.
*/

const MM = 72 / 25.4;

export type UpiSheetInput = {
  /** UPI ID, the pa parameter. */
  upiId: string;
  /** Payee name, the pn parameter. */
  payeeName: string;
  /** Png bytes of the rendered QR code. */
  codePng: Uint8Array;
};

/** A5 landscape: 210 by 148.5 millimeters. */
export type UpiSheetOptions = {
  sheetWidthMm?: number;
  sheetHeightMm?: number;
  codeMm?: number;
};

export async function pdfBytesForUpiSheet(
  input: UpiSheetInput,
  options: UpiSheetOptions = {},
): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const sheetWidthMm = options.sheetWidthMm ?? 210;
  const sheetHeightMm = options.sheetHeightMm ?? 148.5;
  const codeMm = options.codeMm ?? 85;

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const width = sheetWidthMm * MM;
  const height = sheetHeightMm * MM;
  const page = pdf.addPage([width, height]);
  const white = rgb(1, 1, 1);
  const ink = rgb(0.06, 0.09, 0.16);
  const muted = rgb(0.42, 0.47, 0.55);

  page.drawRectangle({ x: 0, y: 0, width, height, color: white });

  const name = input.payeeName || input.upiId;
  const titleSize = 16;
  page.drawText(name, {
    x: MM * 15,
    y: height - MM * 20,
    size: titleSize,
    font: fontBold,
    color: ink,
  });
  page.drawText("Pay by UPI", {
    x: MM * 15,
    y: height - MM * 20 - titleSize - 4,
    size: 10,
    font,
    color: muted,
  });

  const code = codeMm * MM;
  const image = await pdf.embedPng(input.codePng);
  page.drawImage(image, {
    x: (width - code) / 2,
    y: (height - code) / 2 - MM * 2,
    width: code,
    height: code,
  });

  const upiSize = 9;
  page.drawText(`UPI: ${input.upiId}`, {
    x: MM * 15,
    y: MM * 18,
    size: upiSize,
    font: fontBold,
    color: ink,
  });
  page.drawText("Scan or enter the UPI ID to pay.", {
    x: MM * 15,
    y: MM * 18 - upiSize - 4,
    size: 9,
    font,
    color: muted,
  });

  return pdf.save();
}
