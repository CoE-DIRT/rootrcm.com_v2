/**
 * Generates one 1200×630 Open Graph PNG per public route from an SVG template.
 * Usage: node scripts/media/build-og-images.mjs   (requires rsvg-convert on PATH)
 * Output: public/imagery/og/<slug>.png — every file is listed in docs/media/manifest.md.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const ogRoutes = [
  ['home', '/', 'Take control of your revenue — without giving up your EHR.'],
  ['login', '/login', 'Log in to your ROOT workspace'],
  ['signup', '/signup', 'Create your ROOT practice account'],
  ['forgot-password', '/forgot-password', 'Reset access to your ROOT account'],
  ['reset-password', '/reset-password', 'Choose a new ROOT password'],
  ['contact', '/contact', 'Talk with the ROOT revenue team'],
  ['pricing', '/pricing', 'What does it cost to start with ROOT?'],
  ['faq', '/faq', 'Questions practice leaders ask before switching'],
  ['services', '/services', 'Who handles each part of my revenue cycle?'],
  ['technology', '/technology', 'Can I keep my software? Yes.'],
  ['why-root', '/why-root', 'An operating partner, not a black box.'],
  ['specialties', '/specialties', 'Does ROOT know how my specialty bills?'],
  ['consultation', '/consultation', 'Book a free consultation with ROOT'],
  ['diagnostic', '/diagnostic', 'Where is my money? Start with a diagnostic.'],
  ['company', '/company', 'Infrastructure for independent practices'],
  ['resources', '/resources', 'Methods you can put to work this week'],
  ['solutions', '/solutions', 'Your systems stay. The process gets sharper.'],
];

function escape(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrap(text, max = 24) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > max) {
      lines.push(line.trim());
      line = word;
    } else line += ' ' + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

function svg(title, path) {
  const lines = wrap(title);
  const grid = [];
  for (let x = 0; x <= 1200; x += 24) grid.push(`<path d="M${x} 0V630"/>`);
  for (let y = 0; y <= 630; y += 24) grid.push(`<path d="M0 ${y}H1200"/>`);
  const text = lines
    .map((l, i) => `<text x="80" y="${260 + i * 78}" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-size="62" font-weight="700" letter-spacing="-2" fill="#F2F8FF">${escape(l)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#061225"/>
  <g stroke="#11E1EE" stroke-opacity="0.06" stroke-width="1">${grid.join('')}</g>
  <circle cx="1060" cy="120" r="260" fill="#11E1EE" fill-opacity="0.06"/>
  <rect x="80" y="96" width="12" height="12" rx="6" fill="#11E1EE"/>
  <text x="104" y="108" font-family="DejaVu Sans Mono, monospace" font-size="22" letter-spacing="3" fill="#11E1EE">ROOT · RCM AND REVENUE OPERATIONS</text>
  ${text}
  <rect x="80" y="520" width="200" height="4" fill="#11E1EE"/>
  <text x="80" y="570" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#9BB4CE">rootrcm.com${escape(path === '/' ? '' : path)}</text>
  <g transform="translate(900 420)" fill="none" stroke="#11E1EE" stroke-width="2" stroke-linejoin="round">
    <path d="M0 80 L120 10 L240 80 L120 150 Z" fill="#11E1EE" fill-opacity="0.08"/>
    <path d="M0 80 V120 L120 190 V150"/><path d="M240 80 V120 L120 190"/>
    <path d="M40 40 L120 -6 L200 40" stroke-opacity="0.5"/>
    <path d="M80 18 L120 -6 L160 18" stroke-opacity="0.3"/>
  </g>
</svg>`;
}

const outDir = 'public/imagery/og';
mkdirSync(outDir, { recursive: true });
const tmp = join(tmpdir(), 'root-og');
mkdirSync(tmp, { recursive: true });
for (const [slug, path, title] of ogRoutes) {
  const file = join(tmp, `${slug}.svg`);
  writeFileSync(file, svg(title, path));
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', file, '-o', join(outDir, `${slug}.png`)]);
}
rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${ogRoutes.length} OG images to ${outDir}`);
