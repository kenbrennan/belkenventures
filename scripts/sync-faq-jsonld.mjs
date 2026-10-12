#!/usr/bin/env node
// Regenerate (or verify) the FAQPage JSON-LD on a doc page directly from its
// VISIBLE FAQ so the structured data can never drift from what users read.
//
//   node scripts/sync-faq-jsonld.mjs <file.html> [--check]
//
// Default: rewrites the FAQPage <script type="application/ld+json"> block in
// place from the visible <h2 id="faq"> section. With --check it exits non-zero
// if the on-page JSON-LD does not already match the visible FAQ.
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
const checkOnly = process.argv.includes('--check');
if (!file) {
  console.error('usage: sync-faq-jsonld.mjs <file.html> [--check]');
  process.exit(2);
}

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const html = readFileSync(file, 'utf8');

// Isolate the visible FAQ: from <h2 id="faq"> to the end of its <main>.
const faqStart = html.search(/<h2[^>]*id=["']faq["']/i);
if (faqStart === -1) {
  console.error(`no <h2 id="faq"> found in ${file}`);
  process.exit(2);
}
const mainEnd = html.indexOf('</main>', faqStart);
const faqBlock = html.slice(faqStart, mainEnd === -1 ? undefined : mainEnd);

// Collect each <h3>question</h3> followed by its first <p>answer</p>.
const pairRe = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
const mainEntity = [];
let m;
while ((m = pairRe.exec(faqBlock)) !== null) {
  const name = decode(m[1]);
  const text = decode(m[2]);
  if (name && text) {
    mainEntity.push({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    });
  }
}
if (mainEntity.length === 0) {
  console.error(`no <h3>/<p> FAQ pairs found in ${file}`);
  process.exit(2);
}

const faqJson = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity,
});

// Find the existing FAQPage ld+json block.
const scriptRe =
  /<script type="application\/ld\+json">(\{[\s\S]*?\})<\/script>/gi;
let faqScriptMatch = null;
let s;
while ((s = scriptRe.exec(html)) !== null) {
  if (/"@type"\s*:\s*"FAQPage"/.test(s[1])) {
    faqScriptMatch = s;
    break;
  }
}
if (!faqScriptMatch) {
  console.error(`no FAQPage ld+json block found in ${file}`);
  process.exit(2);
}

if (checkOnly) {
  const current = JSON.parse(faqScriptMatch[1]);
  const want = JSON.parse(faqJson);
  const norm = (o) =>
    JSON.stringify(
      o.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
    );
  if (norm(current) !== norm(want)) {
    console.error(`FAIL: FAQ JSON-LD does not match visible FAQ in ${file}`);
    process.exit(1);
  }
  console.log(`OK: ${file} FAQ JSON-LD matches ${mainEntity.length} visible Q&As`);
  process.exit(0);
}

const out =
  html.slice(0, faqScriptMatch.index) +
  `<script type="application/ld+json">${faqJson}</script>` +
  html.slice(faqScriptMatch.index + faqScriptMatch[0].length);
writeFileSync(file, out);
console.log(`wrote ${mainEntity.length} Q&As into FAQ JSON-LD of ${file}`);
