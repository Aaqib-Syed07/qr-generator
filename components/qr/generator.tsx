"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorInput } from "@/components/ui/color-input";
import { DownloadAdModal } from "@/components/ui/download-ad-modal";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Toast } from "@/components/ui/toast";
import { DownloadBar } from "@/components/layout/download-bar";
import { HistoryList } from "@/components/qr/history-list";
import { QrPreview } from "@/components/qr/qr-preview";
import { ScanReadinessPanel } from "@/components/qr/scan-readiness-panel";
import {
  defaultDesign,
  defaultExport,
  designFromTemplate,
  qrTemplates,
  type Ecc,
  type QrConfig,
  type QrDesign,
} from "@/lib/qr/config";
import {
  buildPayload,
  requiredFieldsMissing,
  typeDefinitions,
  type FieldDef,
} from "@/lib/qr/fields";
import { evaluateReadiness } from "@/lib/qr/readiness";
import { beforeDownload, type DownloadFormat } from "@/lib/qr/before-download";
import { QrEngine } from "@/lib/qr/engine";
import { downloadBlob, downloadBytes, downloadSvgText } from "@/lib/qr/download";
import {
  forgetAll,
  rememberCode,
  type HistoryEntry,
} from "@/lib/qr/history";
import { useSavedHistory } from "@/lib/qr/use-history";
import { qrTypes, qrTypeBySlug, type QrTypeListItem } from "@/lib/qr/types";
import { pdfBytesForUpiSheet } from "@/lib/qr/print-template";

/*
  The real generator per docs/PRD.md Phase 1 (FR-1 to FR-5): one
  serializable QrConfig in state, form fields from the type registry,
  live preview through QrEngine, a live scan readiness panel, PNG, SVG
  and PDF exports at exact sizes, and every download routed through
  beforeDownload. No account, no watermark, nothing leaves the
  browser except the generated file.
*/

export type GeneratorProps = {
  /** Initial QR type. Tool pages fix one; home lets the user switch. */
  type: QrTypeListItem;
  allowTypeSwitch?: boolean;
};

const PNG_SIZE_OPTIONS = [
  { value: "512", label: "512 px, screen" },
  { value: "1024", label: "1024 px, screens and small prints" },
  { value: "2048", label: "2048 px, poster" },
  { value: "4000", label: "4000 px, maximum print" },
];

const ECC_OPTIONS = [
  { value: "L", label: "L, smallest, dense data" },
  { value: "M", label: "M, default" },
  { value: "Q", label: "Q, with a logo" },
  { value: "H", label: "H, survives heavy damage" },
];

/** Local date stamp for file names, no payload content in the name. */
function fileBase(type: string): string {
  return `signet-${type}-${new Date().toISOString().slice(0, 10)}`;
}

export function Generator({ type, allowTypeSwitch = false }: GeneratorProps) {
  const [config, setConfig] = useState<QrConfig>(() => ({
    type: type.slug as QrConfig["type"],
    payload: "",
    ecc: "M",
    design: {
      ...defaultDesign,
      dotStyle: "square",
    },
    export: defaultExport,
    values: { ...typeDefinitions[type.slug as QrConfig["type"]].defaults },
  }));
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<DownloadFormat | null>(null);
  const [provider, setProvider] = useState<"house" | "fail-open">("house");
  const [toast, setToast] = useState<string | null>(null);
  const history = useSavedHistory();
  const [templateId, setTemplateId] = useState("classic");

  const activeTypeSlug = config.type;
  const activeType = qrTypeBySlug(activeTypeSlug) ?? type;

  const built = useMemo(
    () => buildPayload(activeTypeSlug, config.values),
    [activeTypeSlug, config.values],
  );

  const errors = useMemo(() => {
    const fieldErrors = { ...(built.errors ?? {}) };
    const missing = requiredFieldsMissing(activeTypeSlug, config.values);
    for (const fieldId of missing) {
      const def = typeDefinitions[activeTypeSlug].fields.find(
        (field) => field.id === fieldId,
      );
      fieldErrors[fieldId] = `${def?.label ?? fieldId} is required.`;
    }
    return fieldErrors;
  }, [built, activeTypeSlug, config.values]);

  const liveConfig = useMemo<QrConfig | null>(
    () => (built.ok ? { ...config, payload: built.payload } : null),
    [built, config],
  );

  const checks = useMemo(
    () => (liveConfig ? evaluateReadiness(liveConfig) : []),
    [liveConfig],
  );

  function setValues(patch: Partial<Record<string, string | boolean>>) {
    setConfig((prev) => ({
      ...prev,
      values: { ...prev.values, ...patch },
    }));
  }

  function setDesign(patch: Partial<QrDesign>) {
    setConfig((prev) => ({
      ...prev,
      design: { ...prev.design, ...patch },
    }));
  }

  function changeType(slug: string) {
    setConfig((prev) => ({
      ...prev,
      payload: "",
      type: slug as QrConfig["type"],
      values: {
        ...typeDefinitions[slug as QrConfig["type"]].defaults,
      },
    }));
  }

  function changeEcc(value: string) {
    setConfig((prev) => ({
      ...prev,
      ecc: value as Ecc,
    }));
  }

  function attachLogo(file: File) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const dataUrl = String(reader.result);
      setConfig((prev) => {
        const design: QrDesign = {
          ...prev.design,
          logo: {
            dataUrl,
            sizePercent: prev.design.logo?.sizePercent ?? 20,
          },
        };
        // Q with a logo, per docs/PRD.md FR-2.
        const ecc: Ecc = prev.ecc === "M" ? "Q" : prev.ecc;
        return { ...prev, design, ecc };
      });
      setToast("Logo added. Error correction raised to Q for safety.");
    });
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setDesign({ logo: null });
  }

  function requestDownload(format: DownloadFormat | "upi-sheet") {
    if (!liveConfig || busy) return;
    if (format === "upi-sheet") {
      void performUpiSheet();
      return;
    }
    setPendingFormat(format);
    setProvider("house");
    setModalOpen(true);
  }

  async function runDownload(format: DownloadFormat) {
    if (!liveConfig) return;
    setBusy(true);
    try {
      // Every download goes through beforeDownload, per docs/PRD.md P1-6.
      const allowed = await beforeDownload({ format });
      if (!allowed) return;
      const name = fileBase(liveConfig.type);
      const engine = new QrEngine();
      if (format === "svg") {
        const svg = await engine.toSvg(liveConfig);
        downloadSvgText(svg, name);
      } else if (format === "png") {
        const blob = await engine.toPng(liveConfig, liveConfig.export.pngSize);
        downloadBlob(blob, name, "png");
      } else {
        const bytes = await engine.toPdf(liveConfig, {
          sizeMm: liveConfig.export.pdfSizeMm,
        });
        downloadBytes(bytes, name, "pdf", "application/pdf");
      }
      rememberCode(liveConfig, liveConfig.payload.length);
      setToast("Your QR code is downloading.");
    } catch (error) {
      console.error(error);
      setToast("The export failed. Try the PNG format, or reload the page.");
    } finally {
      setBusy(false);
    }
  }

  async function performUpiSheet() {
    if (!liveConfig) return;
    setBusy(true);
    try {
      const engine = new QrEngine();
      const png = await engine.toPng(liveConfig, 1200);
      const bytes = new Uint8Array(await png.arrayBuffer());
      const upiId = String(liveConfig.values.pa ?? "");
      const payeeName = String(liveConfig.values.pn ?? upiId);
      const pdf = await pdfBytesForUpiSheet({
        upiId,
        payeeName,
        codePng: bytes,
      });
      downloadBytes(pdf, fileBase("upi-a5"), "pdf", "application/pdf");
      rememberCode(liveConfig, liveConfig.payload.length);
      setToast("Your A5 payment sheet is downloading.");
    } catch (error) {
      console.error(error);
      setToast("The A5 sheet failed. Try reloading the page.");
    } finally {
      setBusy(false);
    }
  }

  async function onAdResult(result: "download" | "cancelled") {
    if (result === "cancelled") {
      setModalOpen(false);
      setPendingFormat(null);
      return;
    }
    setModalOpen(false);
    const format = pendingFormat;
    setPendingFormat(null);
    if (format) {
      await runDownload(format);
    }
  }

  function restore(entry: HistoryEntry) {
    setConfig(entry.config);
    setToast("Restored from your recent downloads.");
  }

  function renderField(field: FieldDef) {
    const value = config.values[field.id];
    const stringValue = value === undefined ? "" : String(value);

    switch (field.kind) {
      case "textarea":
        return (
          <Textarea
            id={`gen-${field.id}`}
            label={field.label}
            helper={field.helper}
            error={errors[field.id]}
            value={stringValue}
            onChange={(event) => setValues({ [field.id]: event.target.value })}
          />
        );
      case "switch":
        return (
          <Switch
            id={`gen-${field.id}`}
            label={field.label}
            helper={field.helper}
            checked={Boolean(value)}
            onChange={(checked) => setValues({ [field.id]: checked })}
          />
        );
      case "select":
        return (
          <Select
            id={`gen-${field.id}`}
            label={field.label}
            helper={field.helper}
            error={errors[field.id]}
            options={field.options}
            value={stringValue}
            onChange={(event) => setValues({ [field.id]: event.target.value })}
          />
        );
      default:
        return (
          <Input
            id={`gen-${field.id}`}
            type={field.kind === "text" ? "text" : field.kind}
            label={field.label}
            helper={field.helper}
            error={errors[field.id]}
            placeholder={field.placeholder}
            value={stringValue}
            onChange={(event) => setValues({ [field.id]: event.target.value })}
          />
        );
    }
  }

  const contentFields = (
    <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
      {allowTypeSwitch ? (
        <Select
          id="gen-type"
          label="QR type"
          helper={activeType.description}
          options={qrTypes.map((item) => ({
            value: item.slug,
            label: item.label,
          }))}
          value={activeTypeSlug}
          onChange={(event) => changeType(event.target.value)}
        />
      ) : null}
      {typeDefinitions[activeTypeSlug].fields.map((field) => renderField(field))}
      <Select
        id="gen-ecc"
        label="Error correction"
        helper="M by default. Q and H survive more damage but are denser."
        options={ECC_OPTIONS}
        value={config.ecc}
        onChange={(event) => changeEcc(event.target.value)}
      />
    </div>
  );

  const designFields = (
    <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
      <Select
        id="gen-template"
        label="Template"
        helper="Templates only change shapes and colors. Sizes and details stay yours."
        options={qrTemplates.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        value={templateId}
        onChange={(event) => {
          setTemplateId(event.target.value);
          setConfig((prev) => designFromTemplate(prev, event.target.value));
        }}
      />
      <ColorInput
        key={`tmpl-fg-${templateId}`}
        id="gen-fg"
        label="Dot color"
        defaultValue={config.design.fg}
        onChange={(value) => setDesign({ fg: value })}
      />
      <ColorInput
        key={`tmpl-bg-${templateId}`}
        id="gen-bg"
        label="Background color"
        defaultValue={config.design.bg}
        onChange={(value) => setDesign({ bg: value })}
      />
      <Select
        id="gen-dot-style"
        label="Dot style"
        options={[
          { value: "square", label: "Square" },
          { value: "rounded", label: "Rounded" },
          { value: "dots", label: "Dots" },
          { value: "classy", label: "Classy" },
          { value: "classy-rounded", label: "Classy rounded" },
          { value: "extra-rounded", label: "Extra rounded" },
        ]}
        value={config.design.dotStyle}
        onChange={(event) =>
          setDesign({ dotStyle: event.target.value as QrDesign["dotStyle"] })
        }
      />
      <Select
        id="gen-corner-square-style"
        label="Corner square style"
        options={[
          { value: "square", label: "Square" },
          { value: "rounded", label: "Rounded" },
          { value: "extra-rounded", label: "Extra rounded" },
          { value: "dot", label: "Dot" },
          { value: "classy", label: "Classy" },
          { value: "classy-rounded", label: "Classy rounded" },
        ]}
        value={config.design.cornerSquareStyle}
        onChange={(event) =>
          setDesign({
            cornerSquareStyle: event.target
              .value as QrDesign["cornerSquareStyle"],
          })
        }
      />
      <Select
        id="gen-corner-dot-style"
        label="Corner dot style"
        options={[
          { value: "square", label: "Square" },
          { value: "rounded", label: "Rounded" },
          { value: "dot", label: "Dot" },
          { value: "classy", label: "Classy" },
          { value: "classy-rounded", label: "Classy rounded" },
          { value: "extra-rounded", label: "Extra rounded" },
        ]}
        value={config.design.cornerDotStyle}
        onChange={(event) =>
          setDesign({
            cornerDotStyle: event.target.value as QrDesign["cornerDotStyle"],
          })
        }
      />
      <Switch
        id="gen-gradient"
        label="Gradient fill"
        helper="A vertical to diagonal fade across the dots."
        checked={config.design.gradient !== null}
        onChange={(checked) =>
          setDesign({
            gradient: checked
              ? {
                  rotation: 0.75,
                  from: config.design.fg,
                  to: config.design.cornerFg ?? "#9333ea",
                }
              : null,
          })
        }
      />
      {config.design.gradient ? (
        <div className="space-y-4 rounded-lg bg-surface-raised p-4">
          <ColorInput
            id="gen-gradient-from"
            label="Gradient start"
            defaultValue={config.design.gradient.from}
            onChange={(value) =>
              setDesign({ gradient: { ...config.design.gradient!, from: value } })
            }
          />
          <ColorInput
            id="gen-gradient-to"
            label="Gradient end"
            defaultValue={config.design.gradient.to}
            onChange={(value) =>
              setDesign({ gradient: { ...config.design.gradient!, to: value } })
            }
          />
        </div>
      ) : null}
      <Slider
        id="gen-margin"
        label="Quiet zone, modules"
        min={0}
        max={8}
        value={config.design.marginModules}
        onChange={(event) =>
          setDesign({ marginModules: Number(event.target.value) })
        }
        helper="Four modules or more, per the QR spec."
      />
      <Switch
        id="gen-invert"
        label="Invert colors"
        helper="Light dots on a dark background. Warned below; some scanners cannot read it."
        checked={config.design.invert}
        onChange={(checked) => setDesign({ invert: checked })}
      />
      <FileDropzone
        id="gen-logo"
        label="Logo in the middle"
        accept="image/png,image/svg+xml"
        helper="PNG or SVG, up to 500 KB. Stays in your browser."
        onFile={attachLogo}
      />
      {config.design.logo ? (
        <>
          <Slider
            id="gen-logo-size"
            label="Logo size, percent of the code"
            min={5}
            max={30}
            value={config.design.logo.sizePercent}
            onChange={(event) =>
              setDesign({
                logo: {
                  ...config.design.logo!,
                  sizePercent: Number(event.target.value),
                },
              })
            }
            helper="At or under 20 percent, with error correction Q or H."
          />
          <Button variant="secondary" size="sm" onClick={removeLogo}>
            Remove logo
          </Button>
        </>
      ) : null}
      <Switch
        id="gen-frame"
        label="Frame with call to action"
        checked={config.design.frame?.enabled === true}
        onChange={(checked) =>
          setDesign({
            frame: {
              enabled: checked,
              text: config.design.frame?.text ?? "Scan me.",
            },
          })
        }
      />
      {config.design.frame?.enabled ? (
        <Input
          id="gen-frame-text"
          label="Frame text"
          helper="Short text on the bottom band of the frame."
          value={config.design.frame.text}
          onChange={(event) =>
            setDesign({
              frame: { enabled: true, text: event.target.value },
            })
          }
        />
      ) : null}
    </div>
  );

  const exportFields = (
    <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
      <p className="text-body text-text-muted">
        Formats: PNG up to 4000 px, SVG and PDF. The download always goes
        through the ad gate for free visitors.
      </p>
      <Select
        id="gen-png-size"
        label="PNG size"
        options={PNG_SIZE_OPTIONS}
        value={String(config.export.pngSize)}
        onChange={(event) =>
          setConfig((prev) => ({
            ...prev,
            export: { ...prev.export, pngSize: Number(event.target.value) },
          }))
        }
      />
      <Input
        id="gen-pdf-mm"
        type="number"
        label="PDF print size, mm"
        min={10}
        max={200}
        value={String(config.export.pdfSizeMm)}
        onChange={(event) =>
          setConfig((prev) => ({
            ...prev,
            export: { ...prev.export, pdfSizeMm: Number(event.target.value) || 40 },
          }))
        }
        helper="The exact printed side of the code on the PDF page."
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button disabled={!liveConfig || busy} onClick={() => requestDownload("png")}>
          Download PNG
        </Button>
        <Button
          variant="secondary"
          disabled={!liveConfig || busy}
          onClick={() => requestDownload("svg")}
        >
          Download SVG
        </Button>
        <Button
          variant="secondary"
          disabled={!liveConfig || busy}
          onClick={() => requestDownload("pdf")}
        >
          Download PDF
        </Button>
        {activeTypeSlug === "upi" ? (
          <Button
            variant="secondary"
            disabled={!liveConfig || busy}
            onClick={() => requestDownload("upi-sheet")}
          >
            A5 payment sheet
          </Button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            if (!liveConfig) return;
            setProvider("fail-open");
            setPendingFormat("png");
            setModalOpen(true);
          }}
          className="text-caption text-text-muted underline"
        >
          Demo control: no ad fill (fail open)
        </button>
      </div>
      {!liveConfig ? (
        <p className="text-small text-error" role="alert">
          Fill the highlighted fields above to enable the downloads.
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,28rem)]">
        <div>
          <Tabs
            label="Generator control groups"
            items={[
              { id: "content", label: typeDefinitions[activeTypeSlug].summaryLabel ?? "Content", content: contentFields },
              { id: "design", label: "Design", content: designFields },
              { id: "export", label: "Export", content: exportFields },
            ]}
          />

          <div className="mt-6">
            {liveConfig ? (
              <ScanReadinessPanel checks={checks} />
            ) : (
              <section
                aria-label="Scan readiness"
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h2 className="text-h3 font-semibold">Scan readiness</h2>
                <p className="mt-4 text-small text-text-muted">
                  Checks appear once the details are ready to encode.
                </p>
              </section>
            )}
          </div>

          <div className="mt-6">
            <HistoryList
              entries={history}
              onRestore={restore}
              onClear={() => forgetAll()}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <QrPreview
            config={liveConfig}
            invalidHint={
              Object.keys(errors).length > 0
                ? "Fill the highlighted fields to see your code."
                : undefined
            }
          />
        </div>
      </div>

      <DownloadBar />

      <DownloadAdModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onResult={onAdResult}
        provider={provider}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-4 right-4 z-30 lg:bottom-6 lg:right-auto lg:w-96"
        >
          <Toast title={toast} />
        </div>
      ) : null}
    </>
  );
}
