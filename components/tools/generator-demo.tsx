"use client";

import { useState } from "react";
import { ColorInput } from "@/components/ui/color-input";
import { DownloadAdModal } from "@/components/ui/download-ad-modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { DownloadBar } from "@/components/layout/download-bar";
import { PreviewTile } from "@/components/qr/preview-tile";
import {
  ScanReadinessPanel,
  type ReadinessCheck,
} from "@/components/qr/scan-readiness-panel";
import type { QrTypeListItem } from "@/lib/qr/types";

/*
  Phase 0 mock of the generator. All controls are inert mockups: the real
  encoders, QrConfig and exports arrive in Phase 1. The download click
  opens the ad modal and runs the full gate flow, which is the one part
  the PRD wants proven with all its states now.
*/

export type GeneratorDemoProps = {
  type?: QrTypeListItem;
};

const mockChecks: ReadinessCheck[] = [
  {
    state: "pass",
    name: "Contrast",
    detail: "Foreground and background have enough contrast to scan.",
  },
  {
    state: "warn",
    name: "Quiet zone",
    detail: "Add a wider margin. Four modules or more is safer.",
  },
  {
    state: "pass",
    name: "Logo coverage",
    detail: "The logo stays at or under 20 percent of the code area.",
  },
  {
    state: "pass",
    name: "Print size",
    detail: "At 40 mm this scans at arm's length for most phones.",
  },
];

export function GeneratorDemo({ type }: GeneratorDemoProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [provider, setProvider] = useState<"house" | "fail-open">("house");
  const [toast, setToast] = useState<string | null>(null);

  function startDownload(failOpen: boolean) {
    setProvider(failOpen ? "fail-open" : "house");
    setModalOpen(true);
  }

  function onDownloadResult(result: "download" | "cancelled") {
    if (result === "download") {
      setToast("Your QR code is downloading");
    }
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,28rem)]">
        <div>
          <Tabs
            label="Generator control groups"
            items={[
              {
                id: "content",
                label: "Content",
                content: (
                  <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
                    {type?.slug === "url" || !type ? (
                      <Input
                        id="gen-url"
                        label="Destination URL"
                        placeholder="https://example.com/menu"
                        helper="This link is what the code opens."
                      />
                    ) : (
                      <Input
                        id="gen-payload"
                        label={`${type.label} content`}
                        placeholder="Phase 1 adds the real form for this type"
                        helper={type.description}
                      />
                    )}
                    <Select
                      id="gen-ecc"
                      label="Error correction"
                      defaultValue="M"
                      helper="M by default. Q and H survive more damage but are denser."
                      options={[
                        { value: "L", label: "L, smallest" },
                        { value: "M", label: "M, default" },
                        { value: "Q", label: "Q, with a logo" },
                        { value: "H", label: "H, heavy damage" },
                      ]}
                    />
                  </div>
                ),
              },
              {
                id: "design",
                label: "Design",
                content: (
                  <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
                    <ColorInput id="gen-dot-color" label="Dot color" defaultValue="#0f172a" />
                    <Select
                      id="gen-dot-style"
                      label="Dot style"
                      defaultValue="square"
                      options={[
                        { value: "square", label: "Square" },
                        { value: "rounded", label: "Rounded" },
                        { value: "dots", label: "Dots" },
                      ]}
                    />
                    <Slider
                      id="gen-logo-size"
                      label="Logo size, percent of the code"
                      defaultValue={20}
                      min={0}
                      max={30}
                      helper="Keep it at 20 percent or less."
                    />
                    <Switch
                      id="gen-invert"
                      label="Invert colors"
                      helper="Warns in the readiness panel. Inverted codes scan worse."
                    />
                    <p className="text-small text-text-muted">
                      12 style templates arrive with the design studio in
                      Phase 1.
                    </p>
                  </div>
                ),
              },
              {
                id: "export",
                label: "Export",
                content: (
                  <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
                    <p className="text-body text-text-muted">
                      Formats: PNG up to 4000 px, SVG and PDF. The download
                      always goes through the ad gate for free visitors.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button onClick={() => startDownload(false)}>
                        Download PNG
                      </Button>
                      <Button variant="secondary" onClick={() => startDownload(false)}>
                        Download SVG
                      </Button>
                      <Button variant="secondary" onClick={() => startDownload(false)}>
                        Download PDF
                      </Button>
                      <button
                        type="button"
                        onClick={() => startDownload(true)}
                        className="text-caption text-text-muted underline"
                      >
                        Demo control: no ad fill (fail open)
                      </button>
                    </div>
                  </div>
                ),
              },
            ]}
          />

          <div className="mt-6">
            <ScanReadinessPanel checks={mockChecks} />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PreviewTile type={type} />
        </div>
      </div>

      <DownloadBar />

      <DownloadAdModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onResult={onDownloadResult}
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
