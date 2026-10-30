import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('EN and ES copy live in one messages module', () => {
  const src = fs.readFileSync('src/content/messages.ts', 'utf8');
  assert.match(src, /const en =/);
  assert.match(src, /const es: Messages/);
  assert.match(src, /Handing Over the Keys/);
  assert.match(src, /Entregar las llaves/);
  assert.match(src, /Talk with a revenue expert/);
  assert.match(src, /Hable con un experto en ingresos/);
  assert.match(src, /tabletTiles/);
  assert.match(src, /concernOptions/);
  assert.match(src, /Practice owners: control/);
  assert.match(src, /Dueños: control/);
  assert.match(src, /Revenue leakage/);
  assert.match(src, /Fuga de ingresos/);
});

test('inner IA pages ship EN/ES sections instead of empty shells', async () => {
  const { messages } = await import('../src/content/messages.ts');
  for (const locale of ['en', 'es']) {
    const pack = messages[locale];
    assert.ok(pack.why.sections.length >= 5);
    assert.ok(pack.solutions.sections.length >= 5);
    assert.ok(pack.technology.sections.length >= 3);
    assert.ok(pack.resources.sections.length >= 3);
    assert.ok(pack.company.sections.length >= 5);
    assert.equal(pack.why.sections.length, messages.en.why.sections.length);
    assert.equal(pack.resources.faqs.length, messages.en.resources.faqs.length);
  }
});
