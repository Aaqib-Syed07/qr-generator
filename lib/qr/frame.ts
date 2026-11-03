/*
  Frame with call to action text per docs/PRD.md FR-3, built as a
  qr-code-styling extension. The official qr-border-plugin was
  rejected in the P1-1 review because its license is not open
  (license verification plug-in, no clear grant); this in-house frame
  keeps the export pipeline fully MIT.

  Geometry notes: the border is drawn inside the quiet zone so it
  never touches modules as long as the quiet zone is 4 modules or
  more. The text pill sits on the bottom edge; the readiness checker
  reduces the effective quiet zone by the pill band (see readiness.ts
  and P1-8 decode tests, which include a framed code).
*/

const SVG_NS = "http://www.w3.org/2000/svg";

export type FrameText = { text: string; backgroundColor: string; foregroundColor: string };

/*
  Frame extension for the library instance. Local structural type: the
  library method signatures are checked bivariantly, so a narrower
  options shape is accepted without importing the package's type
  subpath (which drags in absent optional dev types).
*/

/*
  width and height stay optional (the library may omit them; by the
  time extensions run they are always present) and default to zero,
  which makes the extension a no-op rather than a crash.
*/

export type FrameOptions = { width?: number; height?: number };

export type FrameExtensionFn = (
  svg: SVGElement,
  options: FrameOptions,
) => void;

export function frameExtension(frame: FrameText): FrameExtensionFn {
  return (svg, options) => {
    if (!textSafe(frame.text)) {
      return;
    }
    const doc = svg.ownerDocument;
    if (!doc) return;
    const width = options.width ?? 0;
    const height = options.height ?? 0;

    const inset = Math.round(width * 0.05);
    const strokeWidth = Math.max(2, Math.round(width * 0.014));

    const border = doc.createElementNS(SVG_NS, "rect");
    border.setAttribute("x", String(inset));
    border.setAttribute("y", String(inset));
    border.setAttribute("width", String(width - inset * 2));
    border.setAttribute("height", String(height - inset * 2));
    border.setAttribute("rx", String(Math.round(width * 0.08)));
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", frame.foregroundColor);
    border.setAttribute("stroke-width", String(strokeWidth));
    svg.appendChild(border);

    const bandHeight = Math.round(height * 0.11);
    const bandWidth = Math.round(width * 0.52);
    const bandX = Math.round((width - bandWidth) / 2);
    const bandY = height - inset - Math.round(bandHeight / 2);
    const pill = doc.createElementNS(SVG_NS, "rect");
    pill.setAttribute("x", String(bandX));
    pill.setAttribute("y", String(bandY));
    pill.setAttribute("width", String(bandWidth));
    pill.setAttribute("height", String(bandHeight));
    pill.setAttribute("rx", String(Math.round(bandHeight / 2)));
    pill.setAttribute("fill", frame.backgroundColor);
    pill.setAttribute("stroke", frame.foregroundColor);
    pill.setAttribute("stroke-width", String(Math.max(2, strokeWidth / 2)));
    svg.appendChild(pill);

    const label = doc.createElementNS(SVG_NS, "text");
    label.setAttribute("x", String(width / 2));
    label.setAttribute(
      "y",
      String(bandY + bandHeight / 2 + bandHeight * 0.2),
    );
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("textLength", String(Math.round(bandWidth * 0.86)));
    label.setAttribute("lengthAdjust", "spacingAndGlyphs");
    label.setAttribute(
      "style",
      `font-family: system-ui, sans-serif; font-weight: 700; font-size: ${Math.round(
        bandHeight * 0.62,
      )}px; fill: ${frame.foregroundColor};`,
    );
    label.textContent = frame.text;
    svg.appendChild(label);
  };
}

function textSafe(text: string): boolean {
  return /^[A-Za-z0-9 .,!?&:'-]{0,24}$/.test(text) && text.length > 0;
}
