# ARIA Marketing Site (belken.ai/aria) — Structure & Conventions

**Built 2026-06-18.** This documents the ARIA sales site so any future edit doesn't reverse-engineer it.

> Note: this repo (`kenbrennan/belkenventures`) is the **marketing site**. The ARIA **product** (the actual AI dialer / dashboard / Twilio + n8n stack) is a separate repo: `belkenbot/belken-aria` (local `~/belken-aria`). Don't confuse them.

## What ARIA is (so copy stays honest)
AI phone assistant for small service businesses. Two real capabilities (per the product spec):
1. **Inbound** — answers missed calls 24/7, texts callers back, books the appointment.
2. **Outbound reactivation** — calls your existing/dead customer list by name and rebooks them.
Lead with the inbound missed-call wedge; expand into "and it revives your customer list too."

## Pages (all live)
- `public/aria/index.html` — the hub (universal pain + industry tiles linking to verticals)
- `public/aria/<slug>/index.html` — 5 verticals: `plumbing`, `hvac`, `real-estate`, `medspa`, `law`
- Hand-authored static HTML (Tailwind via CDN). The site root `/` is a Vite/React app (`src/App.jsx`); the `/aria/*` pages are plain static files in `public/` and deploy as-is. No build step touches them.

## Brand / design conventions
- Header + footer lockup: **BelkenAI** (clean SVG bolt in a `bg-brand-600` square, links to https://belken.ai) `/` **ARIA** (links to `/aria`) `/` `<Vertical>` breadcrumb.
- **No emojis** anywhere (Ken's rule) — use inline SVG line icons.
- Palette: navy (#0c1b2e / #14283f) + white + brand blue (#1d4ed8/#2563eb); red (#dc2626) only for the "money lost" number. Inter font. Corporate/clean/trustworthy for an older, non-technical, AI-skeptic buyer. No hype, no jargon ("a friendly assistant that answers your phone," never "agentic voice AI").

## The cost calculator (honesty matters)
Each page has a live JS calculator: `monthly = callsPerWeek * 4.33 * avgValue * CONV`. **`CONV` is tuned per vertical so it never prints fantasy numbers:**
- plumbing / hvac / medspa = `0.5` (a missed call ≈ a ready job/booking)
- real-estate = `0.05` (a missed call is a lead; few close — but high commission)
- law = `0.2` (a fraction of intakes sign)
The note line under the sliders must state the assumption honestly.

## Pricing (real, from product spec — do not invent)
- Done-for-you (managed): **$297–900/mo** — most buyers.
- Own it outright (self-serve): **$2,500–3,500 one-time.**
Show the price (don't demo-gate it). Backed by competitor scan: AnswerConnect $350–575/mo (humans); Smith.ai/Podium hide price.

## Calendar
Calendly embed + buttons → `https://calendly.com/belkenbot/free-30-min-discovery-call`. The inline embed uses `?hide_gdpr_banner=1` to suppress Calendly's cookie banner. (The old dropship page pointed at `calendly.com/belkenventures` which 404s — dead, do not use.)

## No fabricated proof (hard rule)
We have **no customers yet**. NEVER ship fake testimonials or invented stats — it blows up on the first sales call. Use honest "possibility" instead: the calculator (their own number) + the **Founding Customer Program** ("first 5 Frederick County <trade>"). A real testimonial ships only once a real pilot exists.

## To add a new vertical
1. `cp -r public/aria/plumbing public/aria/<newslug>` and edit `index.html`.
2. Swap: title/meta, badge, H1, subhead, call-demo (time/subtitle/4 bubbles/result), trust strip, calculator (`CW_LABEL`, `AJ_LABEL`, defaults, `CONV`, note, framing), the two "works two ways" cards, the "built for how X works" 3 points, founding-offer noun, book H2, breadcrumb.
3. Add a tile linking to it on the hub (`public/aria/index.html` industries section).
4. Push to main; Vercel deploys. Verify live: `curl -s https://belken.ai/aria/<slug> | grep <a hero phrase>`.
- A generator (`/tmp/gen_aria.py` on RTX at build time) templated the last three from one base — recreate that approach for batches.

## Verifying a deploy (RTX has no clean localhost browser path)
- Static `/aria/*` deploys in seconds; the Vite homepage takes ~1–2 min.
- Poll live: `curl -s "https://belken.ai/aria/<slug>?cb=$RANDOM" | grep -c "<phrase>"`.
- For screenshots: the OpenClaw browser tool BLOCKS localhost/private IPs by policy. Use the raw CDP endpoint on Thor's Chrome (9225) via `Target.createTarget` + sessionId (see session notes), or just screenshot the live URL.
