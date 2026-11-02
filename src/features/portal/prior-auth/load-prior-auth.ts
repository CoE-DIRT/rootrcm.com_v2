import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PortalPriorAuthRow } from './types.ts';

type PriorAuthSeed = { rows: PortalPriorAuthRow[] };

function readPriorAuthSeed(): PriorAuthSeed {
  const file = join(process.cwd(), 'data', 'seed', 'portal-prior-auth.example.json');
  return JSON.parse(readFileSync(file, 'utf8')) as PriorAuthSeed;
}

let cached: readonly PortalPriorAuthRow[] | null = null;

export function loadPortalPriorAuth(): readonly PortalPriorAuthRow[] {
  if (!cached) cached = readPriorAuthSeed().rows;
  return cached;
}
