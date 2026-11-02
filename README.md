# Signet

The honest QR code generator. Free static QR codes with no signup and no
watermark, supported by one short ad per download. Dynamic codes that never
become a dead end.

Owner: Aaqib. India first, then global.

This repository is early work in progress. It ships the Phase 0 user
interface with mock data only. No QR encoding, no accounts and no payments
exist yet.

## Status

Current phase: Phase 0 (UI), in progress. The phase plan lives in
`docs/PRD.md`. Tasks done so far:

- P0-1 repo audit
- P0-2 design tokens, light and dark themes
- P0-3 core components (buttons, inputs, toggle, slider, color picker,
  dropzone, tabs, accordion, tooltip, badge, toast, skeleton, card)
- P0-4 header, footer, sticky mobile download bar
- P0-5 static screens (home with generator mock, 13 tool pages, pricing,
  login, signup, learn article template, dashboard list and detail,
  branded fallback page, 404 and error pages, download ad modal with all
  six states)
- P0-6 microcopy pass
- P0-7 accessibility baseline pending a Lighthouse run

The Phase 0 design review artifact lives at `/design-system`.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS 4 with design tokens, light and dark themes
- ESLint (flat config)
- Planned: Supabase (publishable and secret API keys), Upstash Redis or
  Vercel KV for the redirect cache, Razorpay, Sentry, Microsoft Clarity

## Getting started

```
npm install
npm run dev
```

Other commands:

```
npm run build    production build (Turbopack)
npm run lint     ESLint
```

Node 20.9 or newer is required. An `.env.example` file lists every planned
environment variable with empty values. Copy it to `.env.local` and fill in
only what a phase needs. Nothing is required for Phase 0.

## Routes in this phase

- `/` home with the generator mock
- `/tools/[type]` one page per QR type (13 types)
- `/pricing` plan cards and lapse policy
- `/login`, `/signup` mock forms
- `/learn` article index and `/learn/[slug]` article template
- `/dashboard` code list and `/dashboard/[id]` detail with mock analytics
- `/r/[code]` branded fallback page preview
- `/design-system` token and component reference

## Docs

- `docs/PRD.md`, what is built and in which order, with the phase gates
- `docs/ARCHITECTURE.md`, system structure, data flow, redirect rules
- `docs/DESIGN_SYSTEM.md`, tokens, components, accessibility rules
- `AGENTS.md`, working rules for coding agents

## License

MIT. See `LICENSE`.
