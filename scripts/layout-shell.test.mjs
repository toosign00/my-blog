import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('site shell layout is server-rendered and route groups select the content variant', async () => {
  const root = await readFile('src/components/layout/Root.tsx', 'utf-8');
  const defaultLayout = await readFile('src/app/(default)/layout.tsx', 'utf-8');
  const wideLayout = await readFile('src/app/(wide)/layout.tsx', 'utf-8');

  assert.equal(root.includes("'use client'"), false);
  assert.equal(root.includes('usePathname'), false);
  assert.match(root, /variant\?: 'default' \| 'wide'/);
  assert.match(defaultLayout, /variant='default'/);
  assert.match(wideLayout, /variant='wide'/);
});
