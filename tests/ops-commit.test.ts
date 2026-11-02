import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldCommitOpsResult } from '../src/components/operations/ops-commit.ts';

const bayview = { orgId: 'bayview', persona: 'staff' as const };
const cedar = { orgId: 'cedar-grove', persona: 'staff' as const };

test('ops result commits only for the same generation and active practice', () => {
  assert.equal(shouldCommitOpsResult(4, 4, bayview, bayview), true);
  assert.equal(shouldCommitOpsResult(4, 5, bayview, bayview), false);
  assert.equal(shouldCommitOpsResult(4, 4, bayview, cedar), false);
  assert.equal(shouldCommitOpsResult(4, 4, bayview, { orgId: 'bayview', persona: 'client' }), false);
});

test('a later await cannot commit after the practice generation moves on', async () => {
  let generation = 2;
  const captured = generation;
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const active = { ...bayview };
  const commits: string[] = [];

  const task = (async () => {
    await Promise.resolve();
    if (!shouldCommitOpsResult(captured, generation, bayview, active)) return;
    await gate;
    if (!shouldCommitOpsResult(captured, generation, bayview, active)) return;
    commits.push('applied');
  })();

  generation += 1;
  active.orgId = 'cedar-grove';
  release();
  await task;
  assert.deepEqual(commits, []);
});
