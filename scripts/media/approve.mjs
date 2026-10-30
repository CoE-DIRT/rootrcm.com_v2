#!/usr/bin/env node
/**
 * Human-approval helper. Never marks a photo approved.
 * Edit docs/design/media-reviews.json after inspecting the candidate page.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const forbidden = process.argv.some((arg) =>
  ['--approve', '--set-approved', '--force', '--auto'].includes(arg),
);

if (forbidden) {
  console.error(
    'ROOT media approve error: this command cannot mark photos approved. Edit docs/design/media-reviews.json after a human rights review.',
  );
  process.exit(1);
}

const reviews = JSON.parse(await readFile(path.join(root, 'docs/design/media-reviews.json'), 'utf8'));
const requests = JSON.parse(await readFile(path.join(root, 'scripts/media/asset-requests.json'), 'utf8'));
const missing = [];
const premature = [];

for (const asset of requests.assets) {
  const review = reviews[asset.id];
  if (!review) {
    missing.push(asset.id);
    continue;
  }
  if (review.approved === true) {
    premature.push(asset.id);
  }
}

if (missing.length) {
  console.error(`ROOT media approve error: missing review records: ${missing.join(', ')}`);
  process.exit(1);
}

if (premature.length) {
  console.error(
    `ROOT media approve error: ${premature.join(', ')} already have approved=true. Confirm photographer, license, people, and trademark rights before download.`,
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      records: requests.assets.length,
      approved: 0,
      next: 'Set PEXELS_API_KEY locally, run npm run media:search -- --asset=<id>, review the photo page, then edit docs/design/media-reviews.json. Do not portray stock models as ROOT staff, clients, or patients.',
    },
    null,
    2,
  ),
);
