#!/usr/bin/env node
/**
 * ROOT V2 — safe Pexels media candidate discovery and reviewed-download helper.
 * Node.js >= 20. No external dependencies. No implicit publication, no page scraping.
 * Usage (from repo root after copying files into scripts/media/):
 *  PEXELS_API_KEY=<key> node scripts/media/source-free-stock.mjs search --asset=home-clinical
 *  node scripts/media/source-free-stock.mjs download --asset=home-clinical
 *  node scripts/media/source-free-stock.mjs validate
 *
 * Approvals are deliberate manual edits to docs/design/media-reviews.json.
 * Download puts original into assets-inbox/raw (never directly public/).
 * Cursor must subsequently strip metadata, transform to WebP/AVIF, verify rights,
 * and include the approved image in a separate reviewable PR.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.ROOT_V2_REPO_ROOT ? path.resolve(process.env.ROOT_V2_REPO_ROOT) : path.resolve(here, '../..');
const requestsPath = path.join(here, 'asset-requests.json');
const candidatesPath = path.join(root, 'docs/design/media-candidates.json');
const reviewsPath = path.join(root, 'docs/design/media-reviews.json');
const rawDir = path.join(root, 'assets-inbox/raw');
const command = process.argv[2];
const assetArg = process.argv.find(s => s.startsWith('--asset='));
const assetId = assetArg?.slice(8);
const license = 'https://www.pexels.com/license/';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function readJSON(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (e) { if (e.code === 'ENOENT' && fallback !== undefined) return fallback; throw e; }
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function jsonSave(target, data) { return mkdir(path.dirname(target), { recursive: true }).then(() => writeFile(target, JSON.stringify(data, null, 2) + '\n', { flag: 'w' })); }
function safeAsset(id) { assert(/^[a-z0-9-]{3,64}$/.test(id), `Invalid asset id: ${id}`); return id; }
async function requestWithRetry(url, options = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    let response;
    try { response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) }); }
    catch (e) { if (i === tries - 1) throw e; await wait(Math.min(5000, 500 * 2 ** i)); continue; }
    if ([429, 500, 502, 503, 504].includes(response.status) && i < tries - 1) {
      const retryAfter = Number(response.headers.get('retry-after'));
      await wait(Number.isFinite(retryAfter) && retryAfter >= 1 ? Math.min(retryAfter * 1000, 10000) : 1000 * 2 ** i);
      continue;
    }
    if (!response.ok) throw new Error(`Source HTTP ${response.status}. No fallback to scraping.`);
    return response;
  }
  throw new Error('Fetch failed');
}
function safePexelsPage(value) {
  const u = new URL(value);
  return u.protocol === 'https:' && ['www.pexels.com','pexels.com'].includes(u.hostname) && u.pathname.startsWith('/photo/');
}
function safePexelsImage(value) {
  const u = new URL(value);
  return u.protocol === 'https:' && u.hostname === 'images.pexels.com' && u.pathname.startsWith('/photos/');
}
async function main() {
  assert(['search','download','validate'].includes(command), 'Usage: search --asset=id | download --asset=id | validate');
  const req = await readJSON(requestsPath);
  assert(Array.isArray(req.assets) && req.assets.length, 'asset-requests.json has no entries');
  const ids = new Set();
  for (const a of req.assets) { safeAsset(a.id); assert(!ids.has(a.id), `Duplicate asset id ${a.id}`); ids.add(a.id); }
  if (command === 'search') {
    assert(assetId, 'Select exactly one --asset; do not fetch all queries in bulk');
    const asset = req.assets.find(a => a.id === safeAsset(assetId));
    assert(asset, `Unknown asset ${assetId}`);
    const key = process.env.PEXELS_API_KEY;
    assert(key && key.trim().length > 10, 'PEXELS_API_KEY missing: request a free Pexels API key and store in local developer env only.');
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', asset.query);
    url.searchParams.set('orientation', asset.orientation || 'landscape');
    url.searchParams.set('per_page', '8');
    const response = await requestWithRetry(url, { headers: { Authorization: key } });
    const payload = await response.json();
    const photos = (payload.photos || []).filter(p => p.id && safePexelsPage(p.url) && safePexelsImage(p.src?.large2x || p.src?.large)).map(p => ({
      photoId: String(p.id), pageUrl: p.url, photographer: p.photographer,
      photographerUrl: p.photographer_url, previewUrl: p.src.medium,
      originalDownloadUrl: p.src.large2x || p.src.large, width: p.width, height: p.height,
      source: 'Pexels', proposedLicenseUrl: license, status: 'CANDIDATE_ONLY'
    }));
    const current = await readJSON(candidatesPath, { updatedAt: null, assets: {} });
    current.updatedAt = new Date().toISOString();
    current.assets[asset.id] = { ...asset, photos };
    await jsonSave(candidatesPath, current);
    console.log(JSON.stringify({ asset: asset.id, candidates: photos.length, output: candidatesPath, hourlyRemaining: response.headers.get('x-ratelimit-remaining'), monthlyRemaining: response.headers.get('x-ratelimit-remaining-month'), next: 'Human review/approve by photoId in docs/design/media-reviews.json; no automatic publication.' }, null, 2));
    return;
  }
  if (command === 'download') {
    assert(assetId, 'Select --asset=id for approved download');
    const id = safeAsset(assetId);
    const asset = req.assets.find(a => a.id === id);
    assert(asset, `Unknown asset ${id}`);
    const reviews = await readJSON(reviewsPath, {});
    const review = reviews[id];
    assert(review?.approved === true && review?.reviewer && /^\d{4}-\d{2}-\d{2}/.test(review.licenseReviewedAt || '') && review?.peopleRightsReviewed === true && review?.trademarkRightsReviewed === true, `Not approved: ${id}. Set explicit reviewer, reviewed date and subject/trademark review; never self-approve based on API response.`);
    const candidates = await readJSON(candidatesPath);
    const photo = candidates.assets?.[id]?.photos?.find(p => p.photoId === String(review.photoId));
    assert(photo && safePexelsPage(photo.pageUrl) && safePexelsImage(photo.originalDownloadUrl), `Review photo ID missing from current safe Pexels candidates: ${id}`);
    assert(review.sourcePageUrl === photo.pageUrl && review.licenseUrl === license, 'Review source/licence mismatch');
    const imageResponse = await requestWithRetry(photo.originalDownloadUrl);
    const contentType = imageResponse.headers.get('content-type') || '';
    assert(/^image\/(jpeg|png|webp)(;|$)/i.test(contentType), `Unexpected image content type: ${contentType}`);
    const bytes = Buffer.from(await imageResponse.arrayBuffer());
    assert(bytes.length > 1024 && bytes.length <= 15 * 1024 * 1024, 'Unexpected media size: rejects empty or >15 MB files');
    const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isPng = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const isWebp = bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP';
    assert(isJpg || isPng || isWebp, 'Image magic bytes invalid');
    const ext = isJpg ? 'jpg' : isPng ? 'png' : 'webp';
    await mkdir(rawDir, { recursive: true });
    const file = path.join(rawDir, `${id}-${photo.photoId}.${ext}`);
    try { await access(file); throw new Error(`Refusing to overwrite existing file: ${file}`); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
    await writeFile(file, bytes, { flag: 'wx' });
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const output = { assetId: id, photoId: photo.photoId, sourcePageUrl: photo.pageUrl, photographer: photo.photographer, photographerUrl: photo.photographerUrl, licenseUrl: license, licenseReviewedAt: review.licenseReviewedAt, reviewer: review.reviewer, peopleRightsReviewed: true, trademarkRightsReviewed: true, sha256, bytes: bytes.length, rawFile: path.relative(root, file), status: 'DOWNLOADED_RAW_REQUIRES_TRANSFORM_AND_FINAL_EDITORIAL_REVIEW', altEn: asset.altEn, altEs: asset.altEs };
    await jsonSave(path.join(root, 'docs/design/media-download-records', `${id}.json`), output);
    console.log(JSON.stringify(output, null, 2));
    return;
  }
  const candidates = await readJSON(candidatesPath, { assets: {} });
  const reviews = await readJSON(reviewsPath, {});
  const status = req.assets.map(a => {
    const reviewed = reviews[a.id];
    const ids = candidates.assets[a.id]?.photos?.map(p => p.photoId) || [];
    const approved = reviewed?.approved === true && ids.includes(String(reviewed.photoId)) && reviewed?.licenseUrl === license && reviewed?.sourcePageUrl === candidates.assets[a.id].photos.find(p => p.photoId === String(reviewed.photoId))?.pageUrl && Boolean(reviewed.reviewer && reviewed.licenseReviewedAt && reviewed.peopleRightsReviewed && reviewed.trademarkRightsReviewed);
    return { asset: a.id, candidateCount: ids.length, approved: Boolean(approved), status: approved ? 'APPROVED_FOR_RAW_DOWNLOAD_ONLY' : ids.length ? 'CANDIDATES_ONLY' : 'NOT_RESEARCHED' };
  });
  console.log(JSON.stringify({ status, approvedCount: status.filter(s=>s.approved).length, reminder: 'Downloaded raw photos are not deployable until EXIF stripping, WebP/AVIF transform, final legal/editorial review, checksum and manifest checks.' }, null, 2));
}
main().catch(e => { console.error(`ROOT media source error: ${e.message}`); process.exitCode = 1; });
