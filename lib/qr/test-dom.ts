/*
  Test-only DOM shim. The real jsdom chain (@asamuzakjp/css-color and
  below) ships ESM-only builds today, which Node 20 consumers cannot
  require, so the decode suite renders SVG with a minimal DOM shim
  instead: qr-code-styling draws with createElementNS, appendChild,
  setAttribute, ownerDocument and an XMLSerializer, nothing more in the
  SVG paths. Not part of the app bundle; decode tests only.
*/

export class ShimElement {
  tag: string;
  attrs: Record<string, string> = {};
  children: ShimElement[] = [];
  textContent = "";
  ownerDocument: ShimDocument;

  constructor(tag: string, ownerDocument: ShimDocument) {
    this.tag = tag;
    this.ownerDocument = ownerDocument;
  }

  setAttribute(name: string, value: string): void {
    this.attrs[name] = String(value);
  }
  appendChild(child: ShimElement): ShimElement {
    this.children.push(child);
    return child;
  }
}

export class ShimDocument {
  createElementNS(_ns: string, tag: string): ShimElement {
    return new ShimElement(tag, this);
  }
}

export class ShimXmlSerializer {
  serializeToString(root: ShimElement): string {
    return serialize(root, true);
  }
}

export class ShimJsdomFacade {
  window: {
    document: ShimDocument;
    XMLSerializer: typeof ShimXmlSerializer;
  };

  constructor() {
    this.window = {
      document: new ShimDocument(),
      XMLSerializer: ShimXmlSerializer,
    };
  }
}

export function shimWindow(): ShimJsdomFacade {
  return new ShimJsdomFacade();
}

function serialize(element: ShimElement, isRoot: boolean): string {
  const attributes = Object.entries(element.attrs)
    .map(([name, value]) => ` ${name}="${escapeAttr(value)}"`)
    .join("");
  const xmlns = isRoot ? ' xmlns="http://www.w3.org/2000/svg"' : "";
  const open = `<${element.tag}${attributes}${xmlns}>`;
  const inner = element.textContent
    ? escapeText(element.textContent)
    : element.children.map((child) => serialize(child, false)).join("");
  return `${open}${inner}</${element.tag}>`;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
