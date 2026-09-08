# Per-asset UTM attribution (task 605)

The application form is one Calendly link, reused across the whole funnel:
`https://calendly.com/belkenbot/free-30-min-discovery-call`

Because it is a single link, attribution has to ride in on the visit. The homepage
(`index.html`) has a passthrough script: on load it reads the incoming `utm_*`
(plus `gclid`/`fbclid`) query params and copies them onto every Calendly CTA on the
page. Calendly records those params against the booking, so each booking traces back
to the exact asset that drove the click. No UTM params present means the CTA links are
left untouched.

## How to tag an asset

Point the asset at the site (or straight at the funnel page) with a distinct
`utm_content` slug. Keep `utm_source` = the platform and `utm_medium` = the format.

```
https://belken.ai/?utm_source=<platform>&utm_medium=<format>&utm_campaign=<campaign>&utm_content=<asset-slug>
```

Example — LinkedIn fleet demo video #3:
```
https://belken.ai/?utm_source=linkedin&utm_medium=video&utm_campaign=fleet_launch&utm_content=fleet-demo-3
```

## Slug convention

`utm_content` = `<theme>-<format>-<n>`, lowercase, hyphenated, one distinct slug per
published asset. Never reuse a slug across two assets — the whole point is per-asset
resolution.

| Field | Value |
|-------|-------|
| utm_source | linkedin, x, youtube, tiktok, email, gumroad, qr |
| utm_medium | video, post, pdf, bio, social, email |
| utm_campaign | the push it belongs to (fleet_launch, gbp_audit, studio_q4) |
| utm_content | the unique asset slug (fleet-demo-3, silent-failures-pdf, aria-teardown-1) |

## Registry

Log every published asset's slug here so slugs stay unique and Calendly's numbers map
back to something.

| utm_content | asset | channel | date |
|-------------|-------|---------|------|
| _(add on publish)_ | | | |

## Verify

Load the homepage with a test slug and confirm the Calendly button carries it:
```
node -e 'const fs=require("fs");const h=fs.readFileSync("dist/index.html","utf8");
const a=[...h.matchAll(/href="(https:\/\/calendly\.com[^"]*)"/g)].map(m=>m[1]);
const c=new URLSearchParams("utm_content=test-slug");
a.forEach(x=>{const u=new URL(x);c.forEach((v,k)=>u.searchParams.set(k,v));console.log(u.searchParams.get("utm_content"))});'
```
Expect `test-slug` printed once per CTA (6 on the homepage as of 2026-09-07).
