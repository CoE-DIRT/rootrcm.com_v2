import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { publishedMedia } from '../src/content/media-manifest.ts';

const expected = {
  'mark.webp': '27a8a3f275f7bff729aa7b22001a80919d09686207fa19f57d8a118ce2ea459e',
  'logo.webp': '837ca87d16d11eef1bbb44f3a333fce5b34e1056dc491aeef6686575672d3395',
  'banner.webp': '211d5e88fb489fcb56716b7bd84e48bdbb5e765d1bb22215d567f6251282b32b',
  'story.webp': '419459ac6a7fb318cada8b0c0b0351d15f3d57718cc9c633039bd778631d86e8',
  'poster.webp': '6cdc657bf3d1bd8a9a89ab9941c2e8c9f6ab5c8055893dd8a0ae5b7baf99416a',
  'waveLower.webp': '6316738d4b99de9d4b416135953743711097db378b473af8b3cea8e60f12521e',
} as const;

test('Demo 6 brand originals are present with founder SHA-256 hashes', () => {
  for (const [file, digest] of Object.entries(expected)) {
    const bytes = readFileSync(`public/brand/${file}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), digest, file);
  }
});

test('published media manifest includes every Demo 6 brand file', () => {
  const paths = publishedMedia.map((item) => item.publicPath);
  for (const file of Object.keys(expected)) {
    assert.ok(paths.includes(`/brand/${file}`), file);
  }
});
