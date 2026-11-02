# Architecture: Signet

Technical structure. Product scope is in `PRD.md`. If reality differs from this file (the repo uses another stack), tell the owner and update this file.

## System Overview
```
Visitor browser
  |  generates QR fully client side (QrEngine, SVG source of truth)
  |  Download click -> beforeDownload() -> ad gate (free users)
  v
Next.js on Vercel (server rendered pages, API routes, server actions)
  |
  +--> Supabase (Postgres + Auth + RLS)        source of truth
  +--> KV cache (Upstash Redis or Vercel KV)   short code -> destination
  +--> Safe Browsing API                       destination checks
  +--> Razorpay                                payments and webhooks
  +--> Ad provider (none | Google Ad Manager | AdSense)
  +--> Sentry (errors)   Clarity (behavior)   GA4 (optional)

Scan path:
Phone scans printed code
  -> Edge redirect (middleware or edge function)
  -> KV lookup (fallback: Supabase, fallback: last known good cache)
  -> 302 to destination OR branded fallback page
  -> non blocking scan event -> Postgres -> daily aggregate
```

## Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js App Router, TypeScript strict | Server rendered tool and content pages |
| Styling | Tailwind with design tokens | See `DESIGN_SYSTEM.md` |
| QR rendering | A styled QR library behind `QrEngine` | Chosen in P1-1 after checking docs and license |
| Database and auth | Supabase Postgres and Auth (email, Google) | Region ap-south-1 (Mumbai) |
| Redirect cache | Upstash Redis or Vercel KV | Edge friendly |
| Hosting | Vercel free tier | `*.vercel.app` until a custom domain is bought |
| Payments | Razorpay first (UPI, cards) | Stripe or a merchant of record when going global |
| Ads | `AdProvider` adapter | `none` by default, then `gam`, then `adsense` |
| Errors | Sentry free tier | Alerts by email |
| Behavior analytics | Microsoft Clarity | Free, with masking |
| Search | Google Search Console (URL prefix property), Bing Webmaster Tools | |
| Email | A transactional email service for lapse and dunning mails | Pick in Phase 5 and ask the owner first |
| Tests | A unit test runner plus two QR decoder libraries | Report what is chosen |

## Project Structure
If the repo already has a structure, follow it. Otherwise:
```
/app                 routes and pages (server rendered)
  /(marketing)       home, pricing, learn, compare, use cases
  /tools/[type]      one page per QR type (from the type registry)
  /dashboard         signed in area
  /api               route handlers (webhooks, abuse report, data export)
  /r/[code]          fallback pages (redirect itself runs at the edge)
/components          reusable UI (see DESIGN_SYSTEM.md)
/lib
  /qr                QrEngine, QrConfig, type registry, encoders, checker
  /ads               AdProvider, providers, useDownloadGate, AdSlot helpers
  /billing           entitlements, Razorpay client, webhook handlers
  /redirect          status logic (pure), cache access
  /supabase          clients (browser, server, secret key server only)
  facts.ts           single source of truth for name, prices, limits (Phase 4)
/services            external API wrappers (Safe Browsing, email)
/types               shared TypeScript types
/tests               unit and decode tests
/supabase/migrations SQL migrations
/docs                PRD.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, listings
/geo-tracking        prompts.md (Phase 4)
/public              static assets, llms.txt, robots rules
```

## Data Flow
1. **Generate (client only).** Form input -> validated by the type registry -> encoder builds the payload -> `QrConfig` -> `QrEngine.render()` -> SVG preview. PNG comes from canvas. Nothing is sent to a server for static codes.
2. **Download.** Download click -> `beforeDownload(format)` -> paid: allow. Free: ad modal -> `AdProvider` loads rewarded ad (4 second limit, fail open) -> granted -> export file -> log `download_completed`.
3. **Create dynamic code.** Signed in user -> server validates destination -> Safe Browsing check -> insert into `qr_codes` with an unguessable short code -> write KV mapping -> return short URL that is encoded in the QR.
4. **Edit destination.** Validate -> Safe Browsing -> update Postgres -> update KV.
5. **Scan.** Edge handler reads the short code -> KV -> status logic -> 302 or fallback page -> emits a non blocking scan event.
6. **Billing.** Razorpay checkout -> webhook (signature verified, idempotent) -> `subscriptions` and `profiles.plan` -> KV and entitlements reflect the plan -> cancel or failed payment sets `plan_lapsed_at` and starts the 90 day window.

## Redirect Status Logic (pure function, unit tested)
| Code status | Behavior |
|---|---|
| active | 302 to destination, log scan |
| paused | Paused fallback page |
| lapsed and under 90 days since `plan_lapsed_at` | 302 to last destination, log scan |
| lapsed and 90 days or more | Branded fallback page that shows the destination link |
| suspended | Suspended page with abuse report link |
| unknown short code | Friendly not found page |
Use 302, not 301, so edits take effect (browsers cache 301). Never show an unbranded error page.

## Database and Storage
Postgres on Supabase is the source of truth. Row level security on every table. Users read and write only their own rows. The secret key is server only. RLS policies target the `anon` and `authenticated` Postgres roles; RLS never applies to requests made with the secret key.
| Table | Main columns |
|---|---|
| `profiles` | id, email, plan, plan_status, plan_lapsed_at, created_at |
| `qr_codes` | id, user_id, type, short_code (unique), destination, config (jsonb), status (active, paused, lapsed, suspended), created_at, updated_at |
| `scan_events` | id, qr_id, scanned_at, country, city (coarse), device_type, os, referrer, ip_hash |
| `scan_daily` | qr_id, day, total, unique_count, by_device (jsonb), by_country (jsonb) |
| `abuse_reports` | id, qr_id, reason, created_at, status |
| `subscriptions` | id, user_id, provider, provider_ref, plan, status, current_period_end |
| `ad_events` | id, session_hash, event, format, plan, created_at |
`ad_events.event` values: `gate_shown`, `gate_granted`, `gate_failed`, `gate_abandoned`, `download_completed`. No personal data in scan or ad events.
Files: logo uploads for static codes stay in the browser. If server storage is ever needed (rich types, P1), ask first.

## Ad Architecture
- `AdProvider` interface: `loadRewarded()`, `showRewarded()`, `renderSlot(name)`. Providers: `none` (fake 5 second house ad promoting Plus), `gam`, `adsense`.
- `useDownloadGate()` owns states: idle, loading, ready, playing, granted, failed, abandoned.
- Rewarded ads on the web use Google Publisher Tag through Google Ad Manager. There is no server side reward verification on web, so the gate is a client side convenience, not a lock. This is accepted.
- AdSense needs a domain you own. Ads stay in placeholder mode on vercel.app.
- Ad scripts load only after consent where consent is required.

## External Services
| Service | Purpose | Phase |
|---|---|---|
| Supabase | Database, auth | 2 |
| Upstash Redis or Vercel KV | Redirect cache | 2 |
| Google Safe Browsing | Destination checks | 2 |
| Google OAuth | Google sign in | 2 |
| Sentry | Error monitoring | 2 |
| Search Console and Bing Webmaster | Indexing | 3 |
| Microsoft Clarity | Session recordings, heatmaps | 3 |
| GA4 (optional) | Traffic analytics | 3 |
| Razorpay | Payments | 5 |
| Google Ad Manager, AdSense | Ads | 5 |
Verify every external API in its official docs before using it. Do not rely on memory for endpoints, field names or signature methods.

## Environment Variables
Names live in `.env.example`. Public values use the `NEXT_PUBLIC_` prefix. Secrets only in `.env.local` and Vercel settings.

## Deployment
- Vercel, connected to the GitHub repo. Every push deploys a preview. Production deploys only after the owner says so.
- Supabase project in ap-south-1. Run migrations from `/supabase/migrations`.
- Domain: `*.vercel.app` now. When a custom domain is bought: set `NEXT_PUBLIC_SITE_URL`, add a 301 from vercel.app, add the domain in Search Console, then apply for AdSense.
- Rollback: redeploy the previous Vercel deployment. Database changes ship with a down migration.

## Scalability Notes
- Redirects are cheap. Analytics storage and support are the real cost. Measure cost per 1,000 scans with a load test before promising unlimited scans.
- Aggregate scan events daily so dashboards stay cheap. Move scan storage to ClickHouse or Tinybird only when volume demands it.
- Cache aggressively at the edge. Keep a last known good mapping so redirects survive a database outage.
- Load test redirects at 10 times expected traffic before launch.
- Public status page and uptime monitor before launch.
- Queue the P1 and P2 features (custom slugs, smart routing, bulk, API, teams) behind the same schema and entitlements function.

## Testing
- Decode suite: every template and style combination decoded by at least two libraries, build fails on a miss.
- Unit tests: encoders, scan checker, redirect status, entitlements, ad gate states, webhook idempotency.
- RLS tests: a user cannot read another user's rows.
- Load test: redirect p95 under 100 ms.
