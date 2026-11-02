# Product Requirements Document: Signet

Owner: Aaqib | Version 1.2 | November 2, 2026
Source of truth for WHAT we are building. Rules for HOW the agent works are in `AGENTS.md`. Visual rules are in `DESIGN_SYSTEM.md`. Technical structure is in `ARCHITECTURE.md`.
Market numbers below came from research dated June to October 2026. Treat them as directional. Re-check any competitor price on the vendor's own page and add a date before publishing it.

## Product Overview
Product: Signet (working name, final name to be confirmed by the owner)
One line: the honest QR code generator. Free static codes with no signup and no watermark, supported by one short ad per download. Dynamic codes that never become a dead end.
Vision: the QR tool people trust enough to print on a restaurant menu.
Repo: Aaqib-Syed07/qr-generator. Hosting: free Vercel (`*.vercel.app`) until a custom domain is bought.

## Problem
- Many QR vendors deactivate dynamic codes when a trial ends or a plan lapses, after the code is already printed on a menu or poster. Users call this being held to ransom.
- Free tools force signups, add watermarks, or cap scans. Paid tools bill annually only, use confusing quotas, and jump from cheap to expensive plans.
- QR phishing ("quishing") makes people distrust unknown short links.
- Global vendors offer little India pricing or UPI QR support.

## Goal
Be the trustworthy, fairly priced QR product for small businesses, creators, students and shops, starting in India.
First 6 months after launch:
1. Rank for long tail generator queries by QR type and reach steady organic traffic.
2. Convert free users to paid with a simple three tier ladder.
3. Be cited by AI assistants for "free QR code generator with no signup" and "QR code that never expires".
4. Keep redirect reliability above 99.9 percent so the trust promise is real.

## Target Users
| Persona | Job | Needs |
|---|---|---|
| Shop or cafe owner | Menu, UPI payment or Google review QR on a counter or poster | Simple flow, UPI and review types, print ready PDF, a code that never dies |
| Student, club or event organizer | Share a form, schedule or event link | Free, fast, editable link before the event |
| Freelancer or designer | Branded QR for clients | Logo, shapes, SVG and EPS, high resolution, scan checks |
| Small business marketer | Track print and packaging campaigns | Dynamic codes, UTM, analytics, bulk |
| Developer or agency | Generate codes inside other tools | API, embed widget |

## Core Features (version 1)
1. Free browser generator with 13 QR types, design studio, scan readiness checker, PNG, SVG and PDF export.
2. Download ad gate: free users watch one short ad before every download, in every format. Paid plans have no ads.
3. Static display ads in a news article style on content pages.
4. Accounts and dynamic codes with editable destination, pause, delete, convert to static.
5. Trust guarantee: lapsed codes keep redirecting for at least 90 days, then show a branded fallback page.
6. Scan analytics: totals, uniques, day, device, OS, country, city (coarse), referrer.
7. Safety: Google Safe Browsing checks, rate limits, abuse reports.
8. Plans with monthly billing, Razorpay first, INR pricing.
9. SEO and GEO content system.

QR types at launch (13): URL, text, email, phone, SMS, Wi-Fi, vCard, location, calendar event, UPI payment, Google review link, social profile, app store link.

## User Flows
1. **Free download.** Visitor opens a type page, fills the form, styles the code, checks the scan readiness panel, clicks Download, sees the ad modal, watches the ad, file downloads. Target: under 30 seconds to the ad modal, no account.
2. **Ad fails open.** Visitor clicks Download. The ad is not ready in 4 seconds, or an ad blocker is on. The download proceeds and the event is logged.
3. **Create a dynamic code.** User signs in, creates a dynamic code (limit 3 on free), edits the destination later, sees scans.
4. **Lapse.** A plan ends. Codes keep redirecting for 90 days. After that visitors see a branded page that still shows the destination link. The owner can convert to static at any time.
5. **Upgrade.** User picks Plus or Pro, pays with Razorpay (UPI or card), ads disappear, limits rise.
6. **Scan.** A phone scans a printed code, the edge redirect looks up the short code and sends a 302.

## Requirements
### Functional (FR). Priority: P0 launch, P1 within 60 days, P2 later
| ID | Requirement | Priority | Phase |
|---|---|---|---|
| FR-1 | Real time preview and download for the 13 types | P0 | 1 |
| FR-2 | Error correction selector (default M, Q with a logo) and scan readiness checker (contrast, quiet zone, print size, logo coverage) | P0 | 1 |
| FR-3 | Design studio: colors, gradients, dot styles, eye shapes, logo upload, frames with call to action text, 12 or more templates, warnings for inverted and low contrast | P0 | 1 |
| FR-4 | Export PNG up to 4000 px, SVG, PDF. EPS and print templates P1 | P0 | 1 |
| FR-5 | No account for static codes, no watermark, no ads inside the tool controls | P0 | 1 |
| FR-8 | Accounts, dynamic codes, edit destination, pause, delete | P0 | 2 |
| FR-9 | 90 day lapse guarantee and branded fallback page | P0 | 2 |
| FR-10 | Convert dynamic to static | P0 | 2 |
| FR-15 | Scan analytics | P0 | 2 |
| FR-24 | Safe Browsing check on create and edit, rate limits, abuse report link on fallback pages | P0 | 2 |
| FR-25 | Terms, acceptable use, suspend a code and notify the owner | P0 | 2 and 5 |
| FR-21 | Free, Plus, Pro, Business with monthly and annual billing | P0 | 5 |
| FR-22 | Transparent pricing page, plain language lapse policy, cancel anytime | P0 | 5 |
| FR-AD1 | Download ad gate on every free download, all formats, fail open | P0 | 5 |
| FR-AD2 | Static article style ad slots on content pages with consent handling | P0 | 5 |
| Others | FR-6, 7, 11 to 14, 16 to 20, 23, 26 (rich types, AI design, custom slug, password, expiry, smart routing, custom domain for users, retargeting, CSV export, bulk, API, teams, re-scan) | P1 or P2 | queued, do not build |

### Non functional
- Performance: generator LCP under 2 s on mid range mobile. Redirect p95 under 100 ms.
- Reliability: 99.9 percent redirect uptime with a cached last known good mapping.
- Scan quality: decode every template and style with at least two decoder libraries.
- Accessibility: WCAG 2.2 AA, keyboard complete design studio.
- Privacy: hash or truncate IPs, never sell scan data, data export and deletion, India DPDP Act readiness now, GDPR readiness when going global.
- Security: hashed API keys, CSRF protection, strict destination validation, no open redirects.
- SEO and GEO: server rendered pages, clean URLs, structured data, llms.txt.

## Plans (launch pricing, test and adjust)
| Plan | USD | India | Includes |
|---|---|---|---|
| Free | $0 | Rs 0 | Unlimited static codes, full design studio, SVG, PNG, PDF, no watermark, no signup, one short ad before each download. With a free account: 3 dynamic codes that stay live while the account is active, unlimited scans, 30 days analytics |
| Plus | $6 monthly or $5 annual | about Rs 199 monthly | Ad free downloads, 30 dynamic codes, 12 months analytics, custom slugs, password, expiry, UTM, CSV export, print templates |
| Pro | $19 monthly or $15 annual | about Rs 599 monthly | 300 dynamic codes, bulk CSV, API, 1 custom domain, smart routing, retargeting pixels, 3 seats |
| Business | $49 monthly | custom | 1,500 dynamic codes, 5 domains, 10 seats, folders and roles, white label, priority support |
All limits come from ONE entitlements function. Monthly billing on every plan is a differentiator.

## Success Metrics (6 months after launch)
| Area | Metric | Target |
|---|---|---|
| Acquisition | Monthly organic sessions | Month over month growth above 15 percent after a baseline |
| Activation | Visitors who download a code | Above 35 percent |
| Ad gate | Gate completion, abandonment, download completion | Measure first, set targets after two weeks of data |
| Retention | Free accounts creating a second code within 14 days | Above 25 percent |
| Conversion | Free to paid | 3 to 6 percent |
| Revenue | MRR | First milestone $1,000, tracked weekly |
| Reliability | Redirect uptime and p95 latency | Above 99.9 percent, under 100 ms |
| Trust | Support tickets about dead codes | Zero |
| Quality | Scan success in tests | 100 percent of shipped templates |
| Discovery | Rankings and AI citations | Tracked weekly with a fixed prompt list |

## Out of Scope (do not build in v1)
Payment processing for QR users (UPI QR only encodes a link, it never touches money), a mobile scanner app, an enterprise sales motion, a full landing page builder, NFC tools, Hindi and Telugu UI, AI design, Google Ads campaigns run by the agent.

## Locked Decisions
- Ad on EVERY free download, ALL formats, no frequency cap. Paid plans have no ads.
- The ad gate fails open (4 second timeout, ad blocker, no fill).
- Never ask users to click an ad. No ads on dashboard, login, checkout or fallback pages. No ads inside generator controls.
- Free vercel.app domain now. All absolute URLs come from `NEXT_PUBLIC_SITE_URL`. Custom domain bought before applying for ads.
- India first (Razorpay, INR, UPI QR, DPDP consent). Global billing and EEA or UK consent later.
- Coding tool: OpenCode. Redirects use HTTP 302.

## Build Phases
The agent works on ONE phase at a time and ticks tasks here after the checks pass. The owner moves to the next phase.
Current phase: **Phase 0** (edit this line to move on)

### Phase 0: UI
Goal: a clear, fast, trustworthy interface and design system BEFORE any logic. Mock data only.
Gate: owner confirms brand name and that the Vercel project is linked to the repo.
- [x] P0-1 Repo audit (list what exists, no changes)
- [x] P0-2 Tokens and light and dark themes from `DESIGN_SYSTEM.md`
- [x] P0-3 Core components
- [x] P0-4 Layout: header, footer, sticky mobile download bar
- [x] P0-5 Static screens: home with generator, type page template, design studio, scan readiness panel, download ad modal (all states), ad slot placeholders, pricing, login and signup, dashboard (list, detail, analytics), fallback page, learn article template, 404 and error pages
- [x] P0-6 Microcopy for empty states, errors, ad modal, lapse promise, pricing
- [ ] P0-7 Accessibility baseline
Not in this phase: any QR logic, auth, database, real ads, analytics scripts.
Acceptance: all screens fine at 360, 768 and 1280 px. Lighthouse accessibility 95 or higher on home and pricing. Both themes pass contrast. No hardcoded colors outside tokens.
Done: commit `phase-0-ui-complete`.

### Phase 1: Frontend (free generator, no accounts)
Goal: the free generator works fully in the browser. Covers FR-1 to FR-5.
- [ ] P1-1 `QrEngine` wrapper: `render(config)`, `toPng`, `toPdf`. Pick a styled QR library after checking its docs and license, report the choice
- [ ] P1-2 Type registry: form fields, validation and payload encoder for the 13 types
- [ ] P1-3 Design studio and a single serializable `QrConfig` object
- [ ] P1-4 Scan readiness checker as pure functions with unit tests. Thresholds live in one constants file and are labeled adjustable guidance
- [ ] P1-5 Exports: PNG up to 4000 px, SVG, PDF at correct physical size
- [ ] P1-6 `beforeDownload(format): Promise<boolean>` hook. Every download calls it. For now it returns true
- [ ] P1-7 Local history (last 10, clear button, do not store Wi-Fi passwords by default)
- [ ] P1-8 Decode test suite with at least two decoder libraries, build fails on any miss
- [ ] P1-9 UPI A5 print template with shop name
- [ ] P1-10 Performance pass with real Lighthouse numbers
Payload formats to verify with the decode tests (do not trust blindly): `mailto:`, `tel:`, `SMSTO:number:message`, `WIFI:T:WPA;S:ssid;P:password;H:false;;` (escape `\ ; , : "`), vCard 3.0, `geo:lat,lng`, iCalendar VEVENT, `upi://pay?pa=...&pn=...&am=...&cu=INR`. Google review links need the business Place ID or URL from the user: never invent a format.
Acceptance: SVG downloaded in under 30 seconds with no account. Decode suite 100 percent. Checker tests flag low contrast, inverted colors, oversized logo, missing quiet zone. Every download goes through `beforeDownload`. LCP under 2 s on throttled mobile.
Done: commit `phase-1-frontend-complete`, preview deploy on Vercel.

### Phase 2: Backend (accounts, dynamic codes, redirects, safety)
Gate: Supabase URL and anon key (region ap-south-1), redirect cache set up, Safe Browsing key, Google OAuth client ID, Sentry DSN. Never invent any.
- [ ] P2-1 Schema, migrations, RLS policies and RLS tests (see `ARCHITECTURE.md`)
- [ ] P2-2 Auth: email and Google. Protect dashboard routes
- [ ] P2-3 Dynamic code flows: create, edit, pause, delete, convert to static. Free limit 3 until Phase 5 entitlements replace it
- [ ] P2-4 Edge redirect with cache, DB fallback and status logic (unit tested)
- [ ] P2-5 Fallback pages: lapsed (90 days or more), paused, suspended, not found. Destination link, abuse report link. No ads
- [ ] P2-6 Safe Browsing on create and edit, rate limits, abuse report form
- [ ] P2-7 Non blocking scan logging, hashed IPs, daily aggregation
- [ ] P2-8 Dashboard: code list, detail, analytics charts
- [ ] P2-9 Account data export and deletion
- [ ] P2-10 Sentry for frontend and server, alert email on new errors, strip sensitive request bodies
- [ ] P2-11 Redirect load test with real cost per 1,000 scans
Not in this phase: billing, custom slugs, passwords, expiry, smart routing, bulk, API.
Acceptance: redirect p95 under 100 ms and works with the database offline. Lapse logic proven by tests. RLS tests pass (no cross user reads). Unsafe test URLs blocked. No secrets in git history. Sentry test error arrives by email.
Done: commit `phase-2-backend-complete`. Ask before production deploy.

### Phase 3: SEO
Gate: Search Console URL prefix verification token (HTML meta tag, because the domain property needs DNS), Clarity Project ID, optional GA4 ID, owner supplied keyword data. Never invent volumes.
- [ ] P3-1 Server rendering, clean URLs, sitemap, robots, canonicals (all from `NEXT_PUBLIC_SITE_URL`)
- [ ] P3-2 Page templates: answer block, unique title, description, H1, intro, FAQ
- [ ] P3-3 Structured data that is true and matches visible content
- [ ] P3-4 Core Web Vitals pass on mobile
- [ ] P3-5 Internal linking and breadcrumbs
- [ ] P3-6 One tool page per QR type, 20 or more quality pages, no near duplicates
- [ ] P3-7 5 learn pages and 3 comparison templates with dated, cited facts
- [ ] P3-8 Embeddable widget with an attribution link, no ads inside it
- [ ] P3-9 Clarity with masking of UPI IDs, Wi-Fi passwords and emails, optional GA4, load after consent
Acceptance: Lighthouse SEO 95 or higher, Rich Results Test clean, sitemap accepted, no duplicate titles, no hardcoded domain.
Done: commit `phase-3-seo-complete`.

### Phase 4: GEO
- [ ] P4-1 Answer block component and visible last updated date
- [ ] P4-2 `llms.txt`, robots rules for AI crawlers (look up current official crawler names first)
- [ ] P4-3 `lib/facts.ts` as the single source of truth plus a consistency test
- [ ] P4-4 Data pages: scan readiness benchmark, dated pricing tracker, state of QR codes outline
- [ ] P4-5 Trust pages: lapse policy, privacy draft, status link, abuse policy (drafts for the owner to review)
- [ ] P4-6 Listing drafts in `docs/listings/` (drafts only, never post for the owner)
- [ ] P4-7 `geo-tracking/prompts.md` with 20 prompts and a baseline
Acceptance: llms.txt live, every content page has an answer block and date, facts identical everywhere, no unverified number shown as fact.
Done: commit `phase-4-geo-complete`.

### Phase 5: Monetization
Gate: Razorpay KYC approved and keys (secrets only in `.env.local` and Vercel), confirmed plan prices. Ad Manager details only at P5-9.
- [ ] P5-1 Entitlements function (replaces the hardcoded free limit)
- [ ] P5-2 `AdProvider` adapter in `lib/ads/` with `none` (default, fake 5 second house ad promoting Plus), `gam` and `adsense`
- [ ] P5-3 Download ad gate and `useDownloadGate()` states: idle, loading, ready, playing, granted, failed, abandoned, one test per transition
- [ ] P5-4 `AdSlot` placements and consent banner (India DPDP)
- [ ] P5-5 Razorpay checkout and webhooks: read official docs for signature verification, verify signatures, idempotent handlers. Payment Links allowed as a day one fallback
- [ ] P5-6 Billing page, cancel starts the 90 day window, lapse and dunning emails in an honest tone
- [ ] P5-7 Pricing page from `lib/facts.ts` with the plain language lapse policy
- [ ] P5-8 Internal dashboard: MRR, churn, free to paid, gate rates, cost per 1,000 scans (real data only)
- [ ] P5-9 Switch on, owner driven: (1) ship in placeholder mode on vercel.app, (2) buy domain, set `NEXT_PUBLIC_SITE_URL`, 301 from vercel.app, add domain in Search Console, (3) publish Privacy, About, Contact and 15 to 20 quality articles, apply for AdSense, (4) open Google Ad Manager, create the rewarded unit, switch provider to `gam`, (5) optional two week safety check on half of free users
Ad facts to verify in official docs before coding: AdSense requires you to own or control the domain, so a free vercel.app address will not be approved. Rewarded ads on the web are a Google Ad Manager format using Google Publisher Tag, with no server side verification on web and a need for a mobile friendly viewport tag. Whether AdSense alone can serve them is unconfirmed.
Ad gate flow: click Download, `beforeDownload(format)`, paid users pass at once, free users see the modal "Watch a short ad to download your QR code. Paid plans have no ads." with Watch ad and Upgrade buttons, ad loads within 4 seconds or fail open, reward granted then file downloads, early close means no download and a retry offer.
Static ads: reserved height, lazy load, "Advertisement" label. Content pages: after paragraph 2, mid article, end, sticky sidebar at 1024 px and wider, at most 3 in article units per 1,000 words. Tool pages: one unit below the fold, clear of controls. Never on dashboard, login, checkout or fallback pages.
Acceptance: real small payment works including refund and cancel, cancel never breaks a printed code, webhook replay does not double apply, free users download only after reward or fail open, ad blocker still lets download work within 5 seconds, early close does not download, CLS under 0.1, no ad script before consent where required.
Done: commit `phase-5-monetization-complete`.

## Credentials (names only, never values in chat or git)
| Needed in | Item | Provide | Secret? |
|---|---|---|---|
| Phase 0 | Brand name | Final name | No |
| Phase 2 | Supabase | URL and anon key. Service role key only in Vercel env vars | Service role: YES |
| Phase 2 | Redirect cache | Upstash or Vercel KV URL and token | YES |
| Phase 2 | Safe Browsing | API key | YES |
| Phase 2 | Google OAuth | Client ID (no), client secret (YES) | Secret: YES |
| Phase 2 | Sentry | DSN (no), auth token for source maps (YES) | Token: YES |
| Phase 3 | Search Console | HTML meta tag token | No |
| Phase 3 | Clarity | Project ID | No |
| Phase 3 | GA4 (optional) | Measurement ID | No |
| Phase 5 | Razorpay | Key ID (no), key secret and webhook secret (YES) | YES |
| Phase 5 | Ad Manager | Network code, rewarded unit path | No |
| Phase 5 | AdSense | Publisher ID, after domain approval | No |
| Phase 5 | Custom domain | Domain name | No |

## Risks
| Risk | Mitigation |
|---|---|
| Phishing abuse of dynamic codes | Safe Browsing checks, rate limits, abuse reports, quick takedown |
| Ad gate abandonment hurts conversion | Fail open, visible Upgrade button, optional safety check, measure the rates |
| AdSense rejection | Own the domain, publish real content and policy pages first |
| Hard to outrank incumbents | Long tail first, unique tool value, honest dated comparisons, widget and data assets |
| Free tier costs exceed revenue | Cap free dynamic codes, load test, cache, track cost per 1,000 scans |
| Trust promise strains finances | Cheap static fallback after 90 days, convert to static, archive analytics |
| Payments, GST and VAT complexity | Razorpay for India, merchant of record when global, talk to an accountant early |
| Privacy law exposure | Minimize data, hash IPs, clear policy, deletion tools |
| Scope creep | Stick to the current phase, queue the rest |

## Open Questions
1. Final brand name and domain availability (check it does not conflict with existing marks).
2. Budget for domain, tooling and paid tests.
3. Open source the QR rendering component for backlinks?
4. Keep the 90 day lapse window or extend it?
5. Add a small banner for lapsed codes (deferred, ask before adding)?

## Suggestions (the agent writes here, the owner decides)
(none yet)

## Blockers and Questions for the Owner
1. Border contrast: the `--border` and `--ad-border` values in `DESIGN_SYSTEM.md` fail the rule stated in the same doc (UI borders 3:1). Measured: light `#CBD5E1` on white 1.48:1, dark `#334155` on `#0B1220` 1.81:1, light ad-border 2.34:1, dark ad-border 2.36:1. Replacement candidates that pass: light border `#64748B` (4.76:1), dark border `#64748B` (3.93:1), dark ad-border `#64748B` (3.75:1), light ad-border `#64748B` (4.46:1 on `#F1F5F9`). Approve before P0-3 components start using borders. P0-3 used the token names as written, so approving now is a one line change per token.
2. `package.json` has no `typecheck` and `test` scripts. May "typecheck": "tsc --noEmit" be added now? "test" is needed in Phase 1 (P1-8) and its runner will be chosen then.
3. Phase 0 gate item: Vercel project is not linked to the repo yet.
4. Brand name not confirmed. UI uses "Signet" as a marked working placeholder.
5. P0-7: contrast was verified by measurement (see FAQ 1) and keyboard and ARIA patterns are wired into every component, but the Lighthouse accessibility score of 95 or higher on home and pricing needs a real Lighthouse run, which this environment cannot do. Run it against a preview deployment or `npm run dev` and report the numbers before P0-7 is ticked.

## Suggestions (the agent writes here, the owner decides)
1. The Phase 0 verification page lives at `/design-system` (tokens, all component states, all ad modal states in one view). It ships only as a build artifact of this phase; delete it before launch or keep it as a styleguide, your call.
