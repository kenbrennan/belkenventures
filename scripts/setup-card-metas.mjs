/**
 * One-time setup: inject <meta name="belken:card" ...> into each docs/compare page.
 * Safe to re-run: skips files that already have the meta.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = join(ROOT, 'public')

const DOCS_CARDS = [
  {
    slug: 'what-is-multi-agent-ai-automation',
    meta: 'Guide · Multi-agent automation',
    order: 10,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 6l4 4M14 14l4 4M14 10l4-4M6 18l4-4"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist',
    meta: 'Guide · AI Receptionist',
    order: 20,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7A2 2 0 0 1 22 15.92z"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-hvac',
    meta: 'Guide · AI Receptionist',
    order: 30,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-plumbers',
    meta: 'Guide · AI Receptionist',
    order: 40,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-roofing',
    meta: 'Guide · AI Receptionist',
    order: 50,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-electrical',
    meta: 'Guide · AI Receptionist',
    order: 60,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-real-estate',
    meta: 'Guide · AI Receptionist',
    order: 70,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-law-firms',
    meta: 'Guide · AI Receptionist',
    order: 80,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-dental',
    meta: 'Guide · AI Receptionist',
    order: 90,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 11c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.66-1.34 3-3 3"/><circle cx="12" cy="17" r="1"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-chiropractors',
    meta: 'Guide · AI Receptionist',
    order: 100,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 7v8M9 10h6M9 22l3-7 3 7"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-auto-repair',
    meta: 'Guide · AI Receptionist',
    order: 110,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-veterinary-clinics',
    meta: 'Guide · AI Receptionist',
    order: 120,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><circle cx="5.5" cy="10.5" r="1.4"/><circle cx="9" cy="6.5" r="1.4"/><circle cx="15" cy="6.5" r="1.4"/><circle cx="18.5" cy="10.5" r="1.4"/><path d="M12 11c-2.5 0-4.5 2-4.5 4.2 0 1.6 1.2 2.3 2.5 2.3 1 0 1.3-.4 2-.4s1 .4 2 .4c1.3 0 2.5-.7 2.5-2.3C16.5 13 14.5 11 12 11z"/></svg>',
  },
  {
    slug: 'what-is-ai-receptionist-for-pest-control',
    meta: 'Guide · AI Receptionist',
    order: 130,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>',
  },
  {
    slug: 'what-is-missed-call-text-back',
    meta: 'Guide · AI Receptionist',
    order: 140,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8M8 14h5"/></svg>',
  },
  {
    slug: 'what-is-dead-customer-reactivation',
    meta: 'Guide · AI Receptionist',
    order: 150,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
  {
    slug: 'what-is-ai-video-clipping',
    meta: 'Guide · Belken Studio',
    order: 160,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  },
  {
    slug: 'what-is-ai-ugc-ad-generation',
    meta: 'Guide · Belken Studio',
    order: 170,
    icon: '<svg class="ico" width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><circle cx="12" cy="10" r="3"/></svg>',
  },
]

const COMPARE_CARDS = [
  { slug: 'belken-studio-vs-opusclip',      meta: 'Short-form video', order: 10 },
  { slug: 'ai-receptionist-vs-smith-ai',    meta: 'Call answering',   order: 20, title: 'AI Receptionist vs Smith.ai' },
  { slug: 'ai-receptionist-vs-goodcall',    meta: 'Call answering',   order: 30, title: 'AI Receptionist vs Goodcall' },
  { slug: 'ai-receptionist-vs-rosie',       meta: 'Call answering',   order: 40, title: 'AI Receptionist vs Rosie' },
  { slug: 'belken-studio-vs-submagic',      meta: 'Short-form video', order: 50 },
]

function injectMeta(filePath, cardData) {
  const html = readFileSync(filePath, 'utf8')
  if (html.includes('name="belken:card"')) {
    console.log(`  skip (already has belken:card): ${filePath}`)
    return
  }
  const obj = { meta: cardData.meta, order: cardData.order }
  if (cardData.icon) obj.icon = cardData.icon
  if (cardData.title) obj.title = cardData.title
  const metaTag = `<meta name="belken:card" content='${JSON.stringify(obj)}' />`

  // Insert after meta description line
  const updated = html.replace(
    /(<meta name="description" content="[^"]*" ?\/>)/,
    `$1\n${metaTag}`
  )
  if (updated === html) {
    // Try without self-closing slash
    const updated2 = html.replace(
      /(<meta name="description" content="[^"]*"\s*>)/,
      `$1\n${metaTag}`
    )
    if (updated2 === html) {
      console.warn(`  WARN: could not find description meta in ${filePath}`)
      return
    }
    writeFileSync(filePath, updated2)
  } else {
    writeFileSync(filePath, updated)
  }
  console.log(`  wrote: ${filePath}`)
}

for (const card of DOCS_CARDS) {
  injectMeta(join(PUB, 'docs', card.slug, 'index.html'), card)
}
for (const card of COMPARE_CARDS) {
  injectMeta(join(PUB, 'compare', card.slug, 'index.html'), card)
}
console.log('done.')
