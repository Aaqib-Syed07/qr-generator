/*
  Phase 0 only: the design system reference page, reachable at /design-system.
  The real home screen with generator is app/(marketing)/page.tsx.
*/
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { DownloadBar } from "@/components/layout/download-bar";
import { AdSlot } from "@/components/layout/ad-slot";
import { Badge } from "@/components/ui/badge";
import { AccordionItem } from "@/components/ui/accordion";
import { Button, IconButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorInput } from "@/components/ui/color-input";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { Input, NumberInput, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton, Loading } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { Toast, ToastDemo } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";

const colorTokens = [
  { name: "--background", className: "bg-background", use: "Page" },
  { name: "--surface", className: "bg-surface", use: "Cards, panels" },
  { name: "--surface-raised", className: "bg-surface-raised", use: "Modals, popovers" },
  { name: "--text", className: "bg-text", use: "Body and headings" },
  { name: "--text-muted", className: "bg-text-muted", use: "Secondary text" },
  { name: "--border", className: "bg-border", use: "Dividers, inputs" },
  { name: "--primary", className: "bg-primary", use: "Buttons, links" },
  { name: "--primary-hover", className: "bg-primary-hover", use: "Hover and pressed" },
  { name: "--primary-text", className: "bg-primary-text", use: "Text on primary" },
  { name: "--success", className: "bg-success", use: "Success states" },
  { name: "--warning", className: "bg-warning", use: "Scan warnings" },
  { name: "--error", className: "bg-error", use: "Errors" },
  { name: "--ad-surface", className: "bg-ad-surface", use: "Ad slot background" },
  { name: "--ad-border", className: "bg-ad-border", use: "Ad slot border" },
];

const spacingSteps = [
  { token: "4px (p-1)", className: "p-1" },
  { token: "8px (p-2)", className: "p-2" },
  { token: "16px (p-4)", className: "p-4" },
  { token: "24px (p-6)", className: "p-6" },
  { token: "32px (p-8)", className: "p-8" },
  { token: "48px (p-12)", className: "p-12" },
  { token: "64px (p-16)", className: "p-16" },
  { token: "96px (p-24)", className: "p-24" },
];

/*
  Copy from docs/DESIGN_SYSTEM.md, one card per modal state. The live
  version runs in the generator demo on the home and tool pages.
*/
const modalStates = [
  {
    state: "Explainer",
    copy: "Watch a short ad to download your QR code. Paid plans have no ads.",
    extra: "Buttons: Watch ad and download (primary), Upgrade (secondary).",
  },
  {
    state: "Loading",
    copy: "Loading your ad. If it cannot load in 4 seconds, your download starts anyway.",
    extra: "Spinner and visible 4 second limit.",
  },
  {
    state: "Playing",
    copy: "Provider takes over the playback area. Nothing of ours looks like the ad.",
    extra: "Escape cannot close while the ad plays.",
  },
  {
    state: "Granted",
    copy: "Closes, file downloads, toast: Your QR code is downloading.",
    extra: "Download happens immediately.",
  },
  {
    state: "Failed (fail open)",
    copy: "We could not load an ad. Your download is starting.",
    extra: "Download proceeds with no waiting.",
  },
  {
    state: "Abandoned",
    copy: "The ad was closed early, so the download did not start.",
    extra: "Retry button and Upgrade link.",
  },
];

export default function DesignSystemReferencePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-12 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-medium uppercase tracking-wider">
            Phase 0, working name
          </p>
          <h1 className="text-h1 font-bold">Signet design system</h1>
          <p className="mt-2 max-w-xl text-body text-text-muted">
            Every color, type size, spacing step and component in this theme in
            one view. Use the theme control to check both themes.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <section aria-labelledby="colors" className="mb-12">
        <h2 id="colors" className="text-h2 font-semibold">
          Colors
        </h2>
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {colorTokens.map((token) => (
            <li
              key={token.name}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4"
            >
              <span
                className={
                  "inline-block h-12 w-12 shrink-0 rounded-lg border border-border " +
                  token.className
                }
                aria-hidden="true"
              />
              <span>
                <code className="font-mono text-small">{token.name}</code>
                <span className="block text-small text-text-muted">
                  {token.use}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="typography" className="mb-12">
        <h2 id="typography" className="text-h2 font-semibold">
          Typography
        </h2>
        <div className="mt-4 space-y-4 rounded-xl border border-border bg-surface p-6">
          <p className="text-h1 font-bold">H1 heading, 40/48</p>
          <p className="text-h2 font-semibold">H2 heading, 30/38</p>
          <p className="text-h3 font-semibold">H3 heading, 22/30</p>
          <p className="text-body">
            Body text, 16/24. Plain, honest, short sentences that say what
            happens before it happens.
          </p>
          <p className="text-small text-text-muted">
            Small text, 14/20, for helper text and secondary details.
          </p>
          <p className="text-caption font-medium uppercase tracking-wider">
            Caption, 12/16, ad labels
          </p>
          <p className="font-mono text-small">
            Monospace for payload previews: WIFI:T:WPA;S:ssid;P:redacted;H:false;;
          </p>
        </div>
      </section>

      <section aria-labelledby="spacing" className="mb-12">
        <h2 id="spacing" className="text-h2 font-semibold">
          Spacing, 8px system
        </h2>
        <ul className="mt-4 flex flex-wrap items-end gap-6">
          {spacingSteps.map((step) => (
            <li key={step.token} className="text-center">
              <span className="block rounded-md bg-primary" aria-hidden="true">
                <span className={step.className + " block"}></span>
              </span>
              <span className="mt-2 block text-caption text-text-muted">
                {step.token}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-text-muted">
          Allowed spacing values only: 4, 8, 16, 24, 32, 48, 64 and 96 px.
        </p>
      </section>

      <section aria-labelledby="buttons" className="mb-12">
        <h2 id="buttons" className="text-h2 font-semibold">
          Buttons
        </h2>
        <Card className="mt-4 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Primary:</span>
            <Button variant="primary">Download</Button>
            <Button variant="primary" loading>
              Download
            </Button>
            <Button variant="primary" disabled>
              Download
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Secondary:</span>
            <Button variant="secondary">Upgrade</Button>
            <Button variant="secondary" loading>
              Upgrade
            </Button>
            <Button variant="secondary" disabled>
              Upgrade
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Ghost:</span>
            <Button variant="ghost">Learn more</Button>
            <Button variant="ghost" disabled>
              Learn more
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Destructive:</span>
            <Button variant="destructive">Delete code</Button>
            <Button variant="destructive" disabled>
              Delete code
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Sizes:</span>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Icon only:</span>
            <IconButton
              label="Edit destination"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              }
            />
          </div>
        </Card>
      </section>

      <section aria-labelledby="inputs" className="mb-12">
        <h2 id="inputs" className="text-h2 font-semibold">
          Inputs
        </h2>
        <div className="mt-4 space-y-6 rounded-xl border border-border bg-surface p-6">
          <Input
            id="demo-url"
            label="Destination URL"
            placeholder="https://example.com/menu"
            helper="The link this QR code opens."
          />
          <Input
            id="demo-url-error"
            label="Destination URL with an error"
            defaultValue="example"
            helper="Start with https://."
            error="This is not a complete URL. Add https:// at the start, like https://example.com."
          />
          <Input id="demo-disabled" label="Disabled input" disabled placeholder="Not editable" />
          <NumberInput
            id="demo-size"
            label="Print size in mm"
            defaultValue={40}
            helper="Width of the printed QR code."
            min={20}
            max={4000}
          />
          <Textarea
            id="demo-text"
            label="Text payload"
            helper="Plain text stays private. Nothing is stored."
          />
          <Select
            id="demo-select"
            label="Error correction"
            helper="M by default. Q and H survive more damage but are denser."
            options={[
              { value: "L", label: "L, smallest" },
              { value: "M", label: "M, default" },
              { value: "Q", label: "Q, with a logo" },
              { value: "H", label: "H, heavy damage" },
            ]}
            defaultValue="M"
          />
          <Select
            id="demo-select-error"
            label="Select with an error"
            placeholder="Pick a format"
            options={[{ value: "png", label: "PNG" }]}
            error="Pick a format before downloading. PNG is the most common choice."
          />
        </div>
      </section>

      <section aria-labelledby="controls" className="mb-12">
        <h2 id="controls" className="text-h2 font-semibold">
          Toggle, slider, color picker, dropzone
        </h2>
        <div className="mt-4 space-y-6 rounded-xl border border-border bg-surface p-6">
          <Switch
            id="demo-switch"
            label="Add a quiet zone"
            helper="A quiet margin helps scanners find the code."
          />
          <Slider
            id="demo-slider"
            label="Logo size, percent of the code"
            defaultValue={20}
            min={0}
            max={30}
            helper="Keep it at 20 percent or less."
          />
          <ColorInput id="demo-color" label="Foreground color" defaultValue="#0f172a" />
          <FileDropzone
            id="demo-dropzone"
            label="Logo upload"
            accept="image/png,image/svg+xml"
          />
        </div>
      </section>

      <section aria-labelledby="tabs-accordion" className="mb-12">
        <h2 id="tabs-accordion" className="text-h2 font-semibold">
          Tabs and accordion
        </h2>
        <div className="mt-4 space-y-6 rounded-xl border border-border bg-surface p-6">
          <Tabs
            label="Generator control groups"
            items={[
              {
                id: "content",
                label: "Content",
                content: (
                  <p className="text-body text-text-muted">
                    Form fields for the 13 QR types arrive in Phase 1.
                  </p>
                ),
              },
              {
                id: "design",
                label: "Design",
                content: (
                  <p className="text-body text-text-muted">
                    Colors, dot styles, eye shapes, logo and frames.
                  </p>
                ),
              },
              {
                id: "export",
                label: "Export",
                content: (
                  <p className="text-body text-text-muted">
                    PNG up to 4000 px, SVG and PDF.
                  </p>
                ),
              },
            ]}
          />
          <div className="space-y-4">
            <AccordionItem question="Do QR codes expire?">
              Static codes never expire and cost nothing. Dynamic codes keep
              redirecting for at least 90 days after a plan lapses, then show
              a page that still shows the destination. Read the{" "}
              <Link href="/learn/qr-expiry" className="font-medium text-primary underline">
                lapse policy
              </Link>
              .
            </AccordionItem>
            <AccordionItem question="Is there a watermark?">
              No.
            </AccordionItem>
          </div>
        </div>
      </section>

      <section aria-labelledby="feedback" className="mb-12">
        <h2 id="feedback" className="text-h2 font-semibold">
          Tooltip, badge, toast, skeleton
        </h2>
        <div className="mt-4 space-y-6 rounded-xl border border-border bg-surface p-6">
          <p className="flex flex-wrap items-center gap-4">
            <span className="text-body text-text">Hover or focus this link:</span>
            <Tooltip id="demo-tooltip" tooltip="Codes stay live for 90 days after a lapse.">
              <button
                type="button"
                aria-describedby="demo-tooltip"
                className="min-h-11 cursor-pointer font-medium text-primary underline"
              >
                Lapse policy
              </button>
            </Tooltip>
          </p>
          <p className="flex flex-wrap items-center gap-4">
            <span className="text-small text-text-muted">Badges:</span>
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="success">Live</Badge>
            <Badge tone="warning">Low contrast</Badge>
            <Badge tone="error">Scans failed</Badge>
          </p>
          <div>
            <p className="mb-4 text-small text-text-muted">Toast:</p>
            <ToastDemo />
          </div>
          <div>
            <p className="mb-4 text-small text-text-muted">Toast inline:</p>
            <Toast title="Your QR code is downloading" />
          </div>
          <div>
            <p className="mb-4 text-small text-text-muted">Skeleton and loading:</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Loading text="Checking scan readiness" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="download-bar" className="mb-12">
        <h2 id="download-bar" className="text-h2 font-semibold">
          Sticky mobile download bar
        </h2>
        <p className="mt-2 text-body text-text-muted">
          Sticky at the bottom under 1024px, inline above 1024px. In real pages
          it sits below the preview tile and the generator controls.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <div className="bg-surface p-8 text-center text-small text-text-muted">
            Generator controls go here
          </div>
          <DownloadBar />
        </div>
      </section>

      <section aria-labelledby="modal-states" className="mb-12">
        <h2 id="modal-states" className="text-h2 font-semibold">
          Download ad modal, all states
        </h2>
        <p className="mt-2 text-body text-text-muted">
          The live version runs on the home page. Static copy below for
          review, exactly as it appears.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {modalStates.map((state) => (
            <Card key={state.state}>
              <p className="text-small font-medium text-text">{state.state}</p>
              <p className="mt-2 text-body text-text">{state.copy}</p>
              <p className="mt-2 text-small text-text-muted">{state.extra}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="radius-shadows" className="mb-12">
        <h2 id="radius-shadows" className="text-h2 font-semibold">
          Cards, radius and shadows
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <p className="text-small">Default card, 12px radius</p>
          </Card>
          <Card hoverable>
            <p className="text-small">Hoverable card, add shadow-sm on hover</p>
          </Card>
          <div className="rounded-full border border-border bg-surface-raised px-6 py-2 text-small">
            rounded-full, badges and toggles
          </div>
        </div>
      </section>

      <section aria-labelledby="ad-slot" className="mb-12">
        <h2 id="ad-slot" className="text-h2 font-semibold">
          Ad slot placeholder
        </h2>
        <AdSlot placement="below-fold" className="mt-4" />
      </section>

      <footer className="border-t border-border pt-6 text-small text-text-muted">
        Docs: PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md. Owned by Aaqib.
      </footer>
    </div>
  );
}
