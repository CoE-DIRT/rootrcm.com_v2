import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('EN and ES copy live in one messages module', () => {
  const src = fs.readFileSync('src/content/messages.ts', 'utf8');
  assert.match(src, /const en =/);
  assert.match(src, /const es: Messages/);
  assert.match(src, /Handing Over the Keys/);
  assert.match(src, /Entregar las llaves/);
});
