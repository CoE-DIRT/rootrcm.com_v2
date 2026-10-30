import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { publishedMedia } from '../src/content/media-manifest.ts';

const requests = JSON.parse(readFileSync('scripts/media/asset-requests.json', 'utf8')) as {
  assets: { id: string }[];
};
const reviews = JSON.parse(readFileSync('docs/design/media-reviews.json', 'utf8')) as Record<
  string,
  { approved: boolean }
>;

test('asset requests cover fifteen unique slots and every slot has an unapproved review record', () => {
  const ids = requests.assets.map((asset) => asset.id);
  assert.equal(ids.length, 15);
  assert.equal(new Set(ids).size, 15);
  for (const id of ids) {
    assert.equal(reviews[id]?.approved, false, `${id} must stay unapproved until human review`);
  }
});

test('published manifest only lists original ROOT files that exist locally', () => {
  assert.ok(publishedMedia.length >= 2);
  for (const asset of publishedMedia) {
    assert.equal(asset.origin, 'root-original');
    assert.ok(asset.publicPath.startsWith('/media/') || asset.publicPath.startsWith('/brand/'));
    assert.equal(existsSync(`public${asset.publicPath}`), true);
  }
});

test('source and src trees do not hotlink Pexels or Unsplash image CDNs', () => {
  const stack = ['src', 'public'];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!/\.(ts|tsx|js|mjs|css)$/.test(entry.name)) continue;
      const text = readFileSync(full, 'utf8');
      assert.doesNotMatch(text, /images\.pexels\.com/);
      assert.doesNotMatch(text, /images\.unsplash\.com/);
    }
  }
});

test('media validate and approve CLIs stay fail-closed without human signoff', () => {
  const validate = execFileSync(process.execPath, ['scripts/media/source-free-stock.mjs', 'validate'], {
    encoding: 'utf8',
  });
  const report = JSON.parse(validate);
  assert.equal(report.approvedCount, 0);

  const approve = execFileSync(process.execPath, ['scripts/media/approve.mjs'], { encoding: 'utf8' });
  assert.equal(JSON.parse(approve).approved, 0);

  assert.throws(() => {
    execFileSync(process.execPath, ['scripts/media/approve.mjs', '--approve'], { encoding: 'utf8' });
  });
});
