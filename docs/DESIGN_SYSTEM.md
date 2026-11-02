# Design System: Signet

Status: proposed in Phase 0. The owner approves the palette, font and wordmark before Phase 1 starts. Until approved, build with these values.
Every value below must exist as a CSS variable and Tailwind token. No hardcoded colors, sizes or spacing in components.
Contrast figures are targets. Verify with a contrast checker and report real results.

## Direction
Calm, clear, trustworthy. A tool a shop owner would print on a menu. High contrast, generous whitespace, plain words, no hype, no dark patterns. The QR preview is the hero of every tool page. Ads are visibly separate from content and always labeled.

## Colors
Light theme (default):
| Token | Value | Use |
|---|---|---|
| `--background` | #FFFFFF | Page |
| `--surface` | #F8FAFC | Cards, panels |
| `--surface-raised` | #FFFFFF | Modals, popovers |
| `--text` | #0F172A | Body and headings |
| `--text-muted` | #475569 | Secondary text |
| `--border` | #CBD5E1 | Dividers, inputs |
| `--primary` | #1D4ED8 | Main buttons, links, focus accent |
| `--primary-hover` | #1E40AF | Hover and pressed |
| `--primary-text` | #FFFFFF | Text on primary |
| `--success` | #15803D | Success states |
| `--warning` | #B45309 | Scan warnings |
| `--error` | #B91C1C | Errors |
| `--ad-surface` | #F1F5F9 | Ad slot background |
| `--ad-border` | #94A3B8 | Ad slot border |

Dark theme:
| Token | Value |
|---|---|
| `--background` | #0B1220 |
| `--surface` | #111A2E |
| `--surface-raised` | #172238 |
| `--text` | #E5E7EB |
| `--text-muted` | #94A3B8 |
| `--border` | #334155 |
| `--primary` | #60A5FA |
| `--primary-hover` | #93C5FD |
| `--primary-text` | #0B1220 |
| `--success` | #4ADE80 |
| `--warning` | #FBBF24 |
| `--error` | #F87171 |
| `--ad-surface` | #0F172A |
| `--ad-border` | #475569 |

Rules: text on background must reach at least 4.5:1, large text and UI borders at least 3:1. Never use color alone to carry meaning (pair with an icon or text). The QR preview always sits on a white or high contrast tile, in both themes, so scanning is never hurt by dark mode.

## Typography
Font: Inter (self hosted through the framework font loader, with a system sans fallback). Monospace for payload previews and code.
| Style | Size / line height | Weight |
|---|---|---|
| H1 | 40px / 48px (mobile 32 / 40) | Bold |
| H2 | 30px / 38px (mobile 24 / 32) | Semibold |
| H3 | 22px / 30px | Semibold |
| Body | 16px / 24px | Regular |
| Small | 14px / 20px | Regular |
| Caption and ad label | 12px / 16px | Medium |
Body text never goes below 16px on mobile for form inputs (avoids mobile zoom). Line length for articles 65 to 75 characters.

## Spacing
8px system. Allowed values: 4, 8, 16, 24, 32, 48, 64, 96. Component inner padding 16 or 24. Section gap 48 or 64.

## Radius and Shadows
- Radius: 8px (inputs, buttons), 12px (cards, modals), 999px (badges, toggles).
- Borders over shadows by default. Shadows only for raised layers:
  - sm: `0 1px 2px rgba(15,23,42,0.08)` (cards on hover)
  - md: `0 8px 24px rgba(15,23,42,0.12)` (modals, popovers)
- Motion: 150 to 200 ms ease for hover and focus. Modal fade 200 ms. All motion removed under `prefers-reduced-motion`.

## Components
Reuse before creating. Each needs the states listed under States.
- Buttons: primary, secondary, ghost, destructive. Sizes sm, md, lg. Icon button needs an accessible label.
- Inputs: text, textarea, select, number, toggle, slider, color picker, file dropzone. Each has label, helper text and error text.
- Tabs (content, design, export), accordion (FAQ), tooltip, badge, toast, skeleton loader, card.
- Navigation: header (logo, tool menu, pricing, learn, login), footer (legal, status, comparisons), breadcrumbs, mobile menu.
- QR preview tile with live region announcement ("Preview updated").
- Scan readiness panel: list of checks with pass, warn and fail icons plus text.
- Download bar: sticky on mobile, inline on desktop.
- Download ad modal (see below).
- AdSlot (see below).
- Pricing table, plan card, code list table, analytics chart cards, fallback page layout.

### Download ad modal
Focus trapped, closable with Escape except while an ad is playing, returns focus to the Download button.
| State | Content |
|---|---|
| explainer | "Watch a short ad to download your QR code. Paid plans have no ads." Buttons: Watch ad and download (primary), Upgrade (secondary) |
| loading | Spinner and "Loading your ad", with a visible 4 second limit behavior described in text |
| playing | Provider takes over. Our modal shows nothing that could be mistaken for the ad |
| granted | Closes, file downloads, toast "Your QR code is downloading" |
| failed | "We could not load an ad. Your download is starting." (fail open) |
| abandoned | "The ad was closed early, so the download did not start." Retry button and Upgrade link |
Never use countdown pressure, fake close buttons or guilt copy.

### AdSlot
- Always labeled "Advertisement" (caption style, `--text-muted`) above the unit.
- Neutral box: `--ad-surface` background, 1px `--ad-border`. Never styled like a button or content card.
- Reserved height to prevent layout shift. Starting values from common ad sizes (final values follow the chosen network): in article 280px, sidebar 600px, below fold tool page 280px.
- Placement rules are in `docs/PRD.md`. Never inside the generator controls, dashboard, login, checkout or fallback pages.

## States (every interactive component)
Default, hover, focus (2px outline in `--primary`, 2px offset, always visible), active, disabled (reduced contrast but still readable, not focusable), loading (skeleton or spinner with text), empty (explain what to do next), error (icon, text, how to fix).

## Responsive Rules
- Mobile: under 640px. Tablet: 640 to 1024px. Desktop: over 1024px.
- Mobile first. Generator layout: preview on top, controls below, sticky download bar at the bottom.
- Tablet: two columns when width allows. Desktop: controls left, preview right, sticky preview.
- Sticky sidebar ad appears only at 1024px and wider.
- Touch targets at least 44 by 44px. No horizontal scroll at 360px.

## Accessibility
- WCAG 2.2 AA. Semantic HTML (header, nav, main, footer, headings in order).
- Everything operable by keyboard, logical tab order, visible focus.
- Labels on all inputs, errors linked with `aria-describedby`, live regions for preview updates and toasts.
- Alt text on generated previews describes content type (for example "QR code for a Wi-Fi network"), never the secret payload.
- Respect `prefers-reduced-motion` and `prefers-color-scheme` (with a manual toggle that persists).

## Copy Style
Plain, honest, short. Say what happens before it happens. No em dashes. No exclamation marks in errors. Use "Plus" and "Pro", not marketing names. Never claim "never expires" without the 90 day lapse policy link beside it.
