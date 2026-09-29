import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  projects: [{ name: 'chromium' }],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm sync-covers && pnpm exec next dev --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100/indexnow-key.txt',
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      E2E_TEST: '1',
      NEXT_TELEMETRY_DISABLED: '1',
      CLOUDFLARE_ACCOUNT_ID: 'e2e-account',
      CLOUDFLARE_D1_DATABASE_ID: 'e2e-database',
      CLOUDFLARE_API_TOKEN: 'e2e-token',
      CLOUDFLARE_IMAGE_PLACEHOLDERS_KV_NAMESPACE_ID: 'e2e-images',
      INDEXNOW_KEY: 'e2e-indexnow-key',
    },
  },
});
