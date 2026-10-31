import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

test('Demo 6 brand files match the recorded SHA-256 manifest', () => {
  const manifest = JSON.parse(readFileSync('docs/design/original-brand-assets.json', 'utf8')) as {
    path: string;
    sha256: string;
  }[];
  assert.equal(manifest.length, 6);
  for (const item of manifest) {
    const bytes = readFileSync(`public${item.path}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.path);
  }
});