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
  assert.match(src, /nameShort/);
  assert.match(src, /Introduzca un nombre de contacto empresarial/);
  assert.match(src, /Su práctica, bajo control/);
  assert.match(src, /Pause scrolling platforms/);
  assert.match(src, /Pausar plataformas en desplazamiento/);
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
  assert.match(messages.en.commercial.nyNoOffice, /no published New York City office/);
  assert.match(messages.es.commercial.nyNoOffice, /no tiene una oficina publicada/);
  assert.match(messages.en.commercial.nyNoContract, /not a ROOT contract/);
  assert.match(messages.es.commercial.nyNoContract, /no es un contrato/);
  assert.doesNotMatch(messages.en.commercial.nyPageBody, /HIPAA|SOC 2|ISO|guarantee/i);
  assert.doesNotMatch(messages.es.commercial.nyPageBody, /HIPAA|SOC 2|ISO|garantiz/i);
  assert.doesNotMatch(
    `${messages.en.commercial.nyPageBody} ${messages.en.commercial.nycBody}`,
    /\d{1,5}\s+\w+\s+(Street|Avenue|Blvd)/i,
  );
});
