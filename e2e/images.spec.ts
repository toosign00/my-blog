import { readFileSync } from 'node:fs';
import { expect, test } from './fixtures';

const ownedImage = 'https://files.toosign.me/image/how-appium-works/appium-execution-flow.webp';

test('serves the fixed image for source and optimization requests', async ({ page, next }) => {
  void next;
  await page.goto('/indexnow-key.txt');
  const originalResponse = page.waitForResponse(ownedImage);
  await page.setContent(`<img src="${ownedImage}" alt="Owned image">`);
  expect(
    (await (await originalResponse).body()).equals(
      readFileSync('public/assets/images/profile.webp')
    )
  ).toBe(true);
  const image = page.getByRole('img', { name: 'Owned image' });
  expect(
    await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)
  ).toBeGreaterThan(0);

  const query = new URLSearchParams({ url: ownedImage, w: '640', q: '75' });
  const optimizedResponse = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return url.pathname === '/_next/image' && url.searchParams.get('url') === ownedImage;
  });
  await page.setContent(`<img src="/_next/image?${query}" alt="Optimized owned image">`);
  const response = await optimizedResponse;
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^image\//);
  expect((await response.body()).equals(readFileSync('public/assets/images/profile.webp'))).toBe(
    true
  );
  expect(
    await page
      .getByRole('img', { name: 'Optimized owned image' })
      .evaluate((element) => (element as HTMLImageElement).naturalWidth)
  ).toBeGreaterThan(0);
});

test('reuses image metadata when revisiting an image-bearing post', async ({ page, next }) => {
  let sourceDownloads = 0;
  next.onFetch((request) => {
    if (request.url === ownedImage) sourceDownloads++;
    return undefined;
  });
  const openPost = async () => {
    await page.goto('/posts/how-appium-works');
    const image = page.getByRole('article').getByRole('img', { name: 'Appium의 실행 흐름' });
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  };
  await openPost();
  const firstVisitDownloads = sourceDownloads;
  await page.goto('/about');
  await openPost();
  expect(sourceDownloads).toBe(firstVisitDownloads);
});

test('blocks unregistered image origins including lookalike hostnames', async ({
  context,
  page,
  next,
}) => {
  void next;
  // A lower-priority context route keeps an accidentally allowed request off the network.
  await context.route('https://*.invalid/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/>',
    })
  );
  await page.goto('/indexnow-key.txt');
  for (const origin of [
    'https://unregistered.invalid',
    'https://files.toosign.me.unregistered.invalid',
  ]) {
    const source = `${origin}/image.svg`;
    const blocked = page.waitForEvent('requestfailed', {
      predicate: (request) => request.url() === source,
    });
    await page.setContent(`<img src="${source}" alt="Blocked image">`);
    await blocked;
    expect(
      await page
        .getByRole('img', { name: 'Blocked image' })
        .evaluate((element) => (element as HTMLImageElement).naturalWidth)
    ).toBe(0);
  }
});
