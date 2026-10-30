import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { platforms, platformsInRow, platformRows } from '../src/content/ecosystem.ts';
import { featuredSpecialties, specialties, specialtyBySlug } from '../src/content/specialties.ts';
import { nyBoroughs, nyMarketMeta, nyPayers } from '../src/content/markets/ny-payers.ts';
import { proofSlots, publishedProof } from '../src/content/credibility.ts';
import { messages } from '../src/content/messages.ts';

const demo6Ehr = [
  'AdvancedMD',
  'eClinicalWorks',
  'athenahealth',
  'NextGen Healthcare',
  'Tebra',
  'DrChrono',
  'CareCloud',
  'Practice Fusion',
  'ModMed',
  'Epic',
  'Oracle Health',
];

const demo6Clearinghouse = [
  'Waystar',
  'Office Ally',
  'Change Healthcare',
  'TriZetto Provider Solutions',
];

const featuredSlugs = [
  'internal-family-medicine',
  'cardiology',
  'infectious-disease',
  'orthopedics',
  'behavioral-health',
  'pain-management',
  'podiatry',
  'anesthesia',
  'wound-care',
  'otolaryngology',
];

const v4CatalogSlugs = [
  'family-medicine',
  'internal-medicine',
  'psychiatry',
  'ambulatory-surgery',
  'ophthalmology',
  'physical-therapy',
  'occupational-therapy',
  'speech-language-pathology',
  'neurology',
  'dermatology',
  'gastroenterology',
  'urgent-care',
  'radiology',
  'home-health',
  'chiropractic',
  'multi-specialty',
  'vascular',
];

test('ecosystem rows keep the full Demo 6 TECH EHR/PM and clearinghouse lists', () => {
  assert.equal(platformRows.length, 3);
  const ehr = platformsInRow('ehr_pm').map((item) => item.name);
  const clearing = platformsInRow('clearinghouse').map((item) => item.name);
  const enrollment = platformsInRow('enrollment').map((item) => item.name);
  assert.deepEqual(ehr, demo6Ehr);
  assert.deepEqual(clearing, demo6Clearinghouse);
  assert.equal(ehr.length, 11);
  assert.equal(clearing.length, 4);
  assert.ok(enrollment.includes('Availity'));
  assert.ok(enrollment.includes('CAQH'));
  assert.ok(enrollment.includes('PECOS'));
  assert.ok(enrollment.includes('NPPES'));
  assert.equal(enrollment.length, 4);
  assert.equal(platforms.length, 19);
});

test('ecosystem omits invented vendor listings that were not in Demo 6 TECH', () => {
  const names = platforms.map((item) => item.name).join(' | ');
  assert.equal(names.includes('Elation'), false);
  assert.equal(names.includes('OmniMD'), false);
  assert.equal(names.includes('CharmHealth'), false);
  assert.equal(names.includes('HST Pathways'), false);
  assert.equal(names.includes('Resolute'), false);
  assert.equal(names.includes('Kareo'), false);
  assert.ok(!platforms.some((item) => item.id === 'ebo' || item.id === 'ssi'));
});

test('featured ten specialties are first-class and infectious disease is dedicated', () => {
  const featured = featuredSpecialties();
  assert.equal(featured.length, 10);
  assert.deepEqual(
    featured.map((item) => item.slug),
    featuredSlugs,
  );
  const id = specialtyBySlug('infectious-disease');
  assert.ok(id);
  assert.equal(id.dedicatedPage, true);
  assert.match(messages.en.commercial.idHeadline, /Infectious Disease Revenue Operations/);
  assert.match(messages.en.commercial.idHeadline, /From Authorization to Reimbursement/);
});

test('full specialty catalog retains Demo 6 V4_SPEC plus infectious disease', () => {
  for (const slug of [...featuredSlugs, ...v4CatalogSlugs]) {
    assert.ok(specialtyBySlug(slug), `missing specialty ${slug}`);
  }
  assert.ok(specialties.length >= 26);
  const summaries = specialties.map((item) => item.summary.en);
  assert.equal(new Set(summaries).size, summaries.length);
});

test('NY payer records are sourced, dated, and do not claim contracts or an office', () => {
  const required = [
    'Healthfirst',
    'MetroPlusHealth',
    'Fidelis Care',
    'EmblemHealth',
    'Anthem Blue Cross and Blue Shield',
    'UnitedHealthcare',
    'Aetna',
    'Cigna',
    'Oscar',
    'Molina / Affinity',
    'MVP',
  ];
  assert.deepEqual(
    nyPayers.map((payer) => payer.name),
    required,
  );
  for (const payer of nyPayers) {
    assert.equal(payer.lastReviewed, '2026-10-30');
    assert.match(payer.sourceUrl, /^https:\/\//);
    assert.ok(payer.programType);
    assert.ok(payer.sourceLabel.en);
    assert.ok(payer.sourceLabel.es);
  }
  assert.equal(nyBoroughs.length, 5);
  assert.equal(nyMarketMeta.noContractClaim, true);
  assert.equal(nyMarketMeta.noOfficeClaim, true);
});

test('credibility slots default to unpublished empty states', () => {
  assert.ok(proofSlots.length >= 5);
  assert.ok(proofSlots.some((slot) => slot.id === 'case-study'));
  assert.ok(proofSlots.some((slot) => slot.id === 'certification'));
  assert.equal(publishedProof().length, 0);
  for (const slot of proofSlots) {
    assert.equal(slot.editorialStatus, 'unpublished');
    assert.equal(slot.quote, undefined);
  }
});

test('commercial EN/ES keys stay in parity and new routes exist', () => {
  assert.equal(messages.en.commercial.idSections.length, messages.es.commercial.idSections.length);
  assert.equal(messages.en.nav.specialties.length > 0, true);
  assert.equal(messages.es.nav.specialties.length > 0, true);
  const files = [
    path.join('src', 'app', '[locale]', 'specialties', 'page.tsx'),
    path.join('src', 'app', '[locale]', 'specialties', 'infectious-disease', 'page.tsx'),
    path.join('src', 'app', '[locale]', 'locations', 'new-york', 'page.tsx'),
    path.join('src', 'app', '[locale]', 'locations', 'new-york-city', 'page.tsx'),
  ];
  for (const file of files) {
    assert.ok(fs.existsSync(file), `missing ${file}`);
  }
});
