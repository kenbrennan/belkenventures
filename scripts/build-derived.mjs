/**
 * build-derived.mjs
 *
 * Generates two things before vite build runs:
 *  1. Card lists inside <!-- DERIVED:docs-cards:start/end --> and
 *     <!-- DERIVED:compare-cards:start/end --> markers in their index files.
 *  2. public/sitemap.xml from scripts/sitemap-static.json + discovered pages.
 *
 * To add a docs or compare page: create the page folder only.
 * Never edit the card lists or sitemap.xml by hand.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join, dirname, basename } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')

// ---------------------------------------------------------------------------
// 1. Conflict-marker guard
// ---------------------------------------------------------------------------
function checkConflictMarkers() {
  const errors = []
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) { walk(full); continue }
      const content = readFileSync(full, 'utf8')
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        if (/^<{7} /.test(lines[i]) || /^={7}$/.test(lines[i]) || /^>{7} /.test(lines[i])) {
          errors.push(`${full}:${i + 1}: git conflict marker`)
        }
      }
    }
  }
  walk(PUBLIC)
  if (errors.length) {
    console.error('\n❌ Git conflict markers found in public/:\n')
    errors.forEach(e => console.error('  ' + e))
    console.error('\nFix the conflicts before building.\n')
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// 2. HTML parsing helpers
// ---------------------------------------------------------------------------
function parsePageMeta(filePath) {
  const html = readFileSync(filePath, 'utf8')

  // h1: replace <br> with space, strip all other tags
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  let h1 = ''
  if (h1Match) {
    h1 = h1Match[1]
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // meta description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)
  const description = descMatch ? descMatch[1] : ''

  // belken:card override (single-quoted content for embedded double quotes)
  const cardMatch = html.match(/<meta\s+name="belken:card"\s+content='([^']*)'/)
  let card = {}
  if (cardMatch) {
    try { card = JSON.parse(cardMatch[1]) } catch { /* ignore */ }
  }

  // belken:updated
  const updatedMatch = html.match(/<meta\s+name="belken:updated"\s+content="([^"]*)"/)
  const updated = updatedMatch ? updatedMatch[1] : null

  return { h1, description, card, updated }
}

function gitLastCommit(filePath) {
  try {
    const date = execSync(
      `git -C ${JSON.stringify(ROOT)} log -1 --format=%as -- ${JSON.stringify(filePath)}`,
      { encoding: 'utf8' }
    ).trim()
    return date || null
  } catch { return null }
}

// ---------------------------------------------------------------------------
// 3. Discover pages
// ---------------------------------------------------------------------------
function discoverPages(section) {
  const base = join(PUBLIC, section)
  const pages = []
  for (const slug of readdirSync(base)) {
    const dir = join(base, slug)
    if (!statSync(dir).isDirectory()) continue
    const file = join(dir, 'index.html')
    try { statSync(file) } catch { continue }
    if (slug === 'index') continue
    const meta = parsePageMeta(file)
    // Only generate a card for pages that have a belken:card meta;
    // other pages (e.g. workstation-install) appear in the sitemap but
    // not in the generated card list.
    const hasCard = Object.keys(meta.card).length > 0
    const order = meta.card.order ?? 999
    const title = meta.card.title || meta.h1
    pages.push({ slug, file, title, description: meta.description, card: meta.card, updated: meta.updated, order, hasCard })
  }
  pages.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  return pages
}

// ---------------------------------------------------------------------------
// 4. Card HTML generators
// ---------------------------------------------------------------------------
const ARR_SMALL = `<svg class="ico" width="15" height="15" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
const ARR_MED   = `<svg class="ico arr" width="16" height="16" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

function docsCardHtml(page) {
  const { slug, title, description, card } = page
  const icon = card.icon || ''
  const meta = card.meta || ''
  return [
    `    <a class="feat reveal" href="/docs/${slug}">`,
    `      <div class="fi">${icon}</div>`,
    `      <div class="fmeta">${meta}</div>`,
    `      <h3>${title}</h3>`,
    `      <p>${description}</p>`,
    `      <span class="fgo">Read the guide ${ARR_SMALL}</span>`,
    `    </a>`,
  ].join('\n')
}

function compareCardHtml(page) {
  const { slug, title, card } = page
  // card.desc overrides page meta description for the card blurb
  const description = card.desc || page.description
  const meta = card.meta || ''
  return [
    `      <a class="ccard" href="/compare/${slug}">`,
    `        <span class="kick">${meta}</span>`,
    `        <h2>${title}</h2>`,
    `        <p>${description}</p>`,
    `        <span class="go">Read the comparison ${ARR_MED}</span>`,
    `      </a>`,
  ].join('\n')
}

// ---------------------------------------------------------------------------
// 5. Rewrite derived section in an index file
// ---------------------------------------------------------------------------
function rewriteDerived(indexFile, markerKey, cardLines) {
  const html = readFileSync(indexFile, 'utf8')
  const startMarker = `<!-- DERIVED:${markerKey}:start -->`
  const endMarker   = `<!-- DERIVED:${markerKey}:end -->`

  const startIdx = html.indexOf(startMarker)
  const endIdx   = html.indexOf(endMarker)

  if (startIdx === -1 || endIdx === -1) {
    console.error(`❌ Markers not found in ${indexFile}`)
    process.exit(1)
  }

  const before = html.slice(0, startIdx + startMarker.length)
  const after  = html.slice(endIdx)
  const inner  = '\n' + cardLines.join('\n') + '\n'
  writeFileSync(indexFile, before + inner + after)
}

// ---------------------------------------------------------------------------
// 6. Sitemap
// ---------------------------------------------------------------------------
function buildSitemap(docsPages, comparePages) {
  const staticEntries = JSON.parse(
    readFileSync(join(ROOT, 'scripts', 'sitemap-static.json'), 'utf8')
  )

  const seenLocs = new Set()
  const entries = []

  for (const e of staticEntries) {
    seenLocs.add(e.loc)
    entries.push(e)
  }

  for (const page of docsPages) {
    const loc = `https://belken.ai/docs/${page.slug}`
    if (seenLocs.has(loc)) continue
    seenLocs.add(loc)
    const lastmod = page.updated || gitLastCommit(page.file) || '2026-01-01'
    entries.push({ loc, lastmod, priority: '0.6' })
  }

  for (const page of comparePages) {
    const loc = `https://belken.ai/compare/${page.slug}`
    if (seenLocs.has(loc)) continue
    seenLocs.add(loc)
    const lastmod = page.updated || gitLastCommit(page.file) || '2026-01-01'
    entries.push({ loc, lastmod, priority: '0.7' })
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(e =>
      `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`
    ),
    '</urlset>',
    '',
  ].join('\n')

  // Validate: parse the XML (basic check)
  if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
    console.error('❌ Sitemap XML failed basic validation')
    process.exit(1)
  }

  writeFileSync(join(PUBLIC, 'sitemap.xml'), xml)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('build-derived: checking for conflict markers...')
checkConflictMarkers()

console.log('build-derived: discovering docs pages...')
const docsPages = discoverPages('docs')
console.log(`  found ${docsPages.length} docs pages (${docsPages.filter(p => p.hasCard).length} with cards)`)

console.log('build-derived: discovering compare pages...')
const comparePages = discoverPages('compare')
console.log(`  found ${comparePages.length} compare pages`)

console.log('build-derived: rewriting docs/index.html...')
rewriteDerived(
  join(PUBLIC, 'docs', 'index.html'),
  'docs-cards',
  docsPages.filter(p => p.hasCard).map(docsCardHtml)
)

console.log('build-derived: rewriting compare/index.html...')
rewriteDerived(
  join(PUBLIC, 'compare', 'index.html'),
  'compare-cards',
  comparePages.filter(p => p.hasCard).map(compareCardHtml)
)

console.log('build-derived: building sitemap.xml...')
buildSitemap(docsPages, comparePages)

console.log('build-derived: done.')
