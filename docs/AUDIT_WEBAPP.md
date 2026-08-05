# Audit web app — v0 build notes

**Status:** v0 front-end + API scaffolding shipped to branch `audit-v1`.
**Built:** 2026-06-29 by Thor.
**Aria's lane:** RTX render back-end (see `workspace-aria/memory/HANDOFF-FROM-THOR-2026-06-29.md`).

## What v0 includes

### Front-end (`public/audit/`)
- `index.html` — landing + lead-capture form. Free audit, no Stripe, no credit card. Drives ARIA upsell on the delivery page.
- `processing.html` — status page that polls `/api/audit/status` every 5 seconds.
- `ready.html` — delivery page with download button + ARIA demo CTA.

Design matches existing `/aria/*` static-page system (Bricolage Grotesque + Hanken Grotesk, paper/ink/ultra palette). No build step required for these — pure HTML+CSS+vanilla JS.

### API (`api/`)
- `POST /api/audit/request` — validates form, creates audit record, fires RTX render webhook (best-effort), returns `audit_id`.
- `GET /api/audit/status?id=...` — returns current status + pdf_url when ready.
- `POST /api/audit/render-callback` — receives Aria's RTX webhook when render completes/fails. Requires `x-webhook-secret` header.
- `api/_lib/store.js` — thin storage layer. Prefers Vercel KV; falls back to in-memory Map for local dev.

### What's intentionally NOT in v0
- **No Stripe.** Audits are free for v0 (lead-magnet model). Stripe gets added in v0.5 once funnel proves out.
- **No email delivery.** RTX render side will email PDFs directly via Resend/Postmark (Aria's call). v0 front-end just displays the download link.
- **No admin dashboard.** Status is queryable by ID; admin UI deferred to v1.
- **No Postgres.** Using Vercel KV interim. Migration target: `core.audit_requests` in belken Postgres.
- **No multi-industry.** Plumbing only. Other industries marked "coming soon" in the form dropdown.

## Required environment variables (set in Vercel dashboard)

| Variable | Required? | Purpose | Example |
|---|---|---|---|
| `KV_REST_API_URL` | Yes for persistence | Vercel KV REST endpoint | `https://...kv.vercel-storage.com` |
| `KV_REST_API_TOKEN` | Yes for persistence | Vercel KV auth token | `AY...` |
| `RTX_RENDER_WEBHOOK_URL` | Yes for renders | URL of Aria's RTX webhook (Cloudflare tunnel public URL) | `https://render.aria.belken.ai/render` |
| `RTX_WEBHOOK_SECRET` | Yes for prod | Shared secret between Vercel and RTX webhook | random 32+ char string |
| `PUBLIC_BASE_URL` | Yes | Public base URL of this site (used to build callback URL) | `https://belken.ai` |

To provision Vercel KV: Vercel dashboard → project → Storage → Create → KV. Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` into the project's env.

## Open TODOs (in priority order)

1. **[Aria]** Build the RTX render webhook receiver matching the contract in `api/audit/request.js` (see handoff doc).
2. **[Aria]** Stand up Cloudflare tunnel for `RTX_RENDER_WEBHOOK_URL` and set the env var in Vercel.
3. **[Aria or Thor]** Wire email delivery (Resend recommended). Trigger: render-callback receives `status: 'complete'` → enqueue email with PDF link.
4. **[Ken/Thor]** Provision Vercel KV (one-time setup in dashboard) and verify persistence works across function invocations.
5. **[Thor]** End-to-end test with a real Frederick MD plumbing business after Aria's webhook is live.
6. **[Thor]** Merge `audit-v1` → `main` once smoke-tested → Vercel auto-deploys to belken.ai/audit.

## Future (v0.5 → v1)

- Stripe Checkout: $97 paid tier (one-shot deep-dive) above the free tier.
- Admin dashboard at `/admin/audits` (auth-gated): list, retry, manual-deliver.
- Multi-industry: HVAC, med spa, real estate, law firm. Add templates as Aria ships them.
- Migrate storage from Vercel KV → belken Postgres `core.audit_*` schema.
- Analytics: posthog or plausible on the funnel.
- Subscription tier: $297/mo monthly audit drips.

## Architecture sketch

```
[Customer browser]
      │
      │  POST /api/audit/request (form data)
      ▼
[Vercel serverless: request.js]
      │  store audit in KV
      │  fire RTX webhook (best-effort)
      ▼  return { audit_id }
[processing.html polls /api/audit/status every 5s]

      Meanwhile, async:
[Vercel → RTX webhook] ──HTTP──> [Cloudflare tunnel] ──> [RTX render worker (Aria)]
                                                             │
                                                             │  runs belken-audit/engine
                                                             ▼
                                                          [PDF on disk / R2]
                                                             │
            ┌────────────────────────────────────────────────┘
            │  POST /api/audit/render-callback (with x-webhook-secret)
            ▼
[Vercel serverless: render-callback.js]
      │  update KV → status=complete, pdf_url=...
      │  (TODO) trigger email via Resend
      ▼
[Customer's processing.html sees status=complete → redirects to ready.html → download]
```

## Files added in this branch

```
public/audit/index.html         — landing + form
public/audit/processing.html    — status polling
public/audit/ready.html         — delivery + ARIA upsell
api/_lib/store.js               — KV/memory storage abstraction
api/audit/request.js            — POST form handler
api/audit/status.js             — GET status
api/audit/render-callback.js    — POST from RTX webhook
docs/AUDIT_WEBAPP.md            — this file
package.json                    — added @vercel/kv dependency
```
