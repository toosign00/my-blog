import { expect, test } from './fixtures';

const projectLinks = /^Read project:/;

test('enables project controls after hydration and preserves the first search', async ({
  page,
  next,
}) => {
  void next;
  const { promise: scriptsReady, resolve: releaseScripts } = Promise.withResolvers<void>();
  await page.route('**/_next/static/**', async (route) => {
    if (new URL(route.request().url()).pathname.endsWith('.js')) await scriptsReady;
    await route.fallback();
  });
  try {
    await page.goto('/projects', { waitUntil: 'commit' });
    const search = page.getByRole('searchbox', { name: 'Project search' });
    const sort = page.getByRole('combobox', { name: 'Project sort' });
    const tag = page.getByRole('button', { name: 'QA', exact: true });
    await expect(search).toBeVisible();
    await expect(search).toBeDisabled();
    await expect(sort).toBeDisabled();
    await expect(tag).toBeDisabled();

    releaseScripts();
    await expect(search).toBeEnabled();
    await expect(sort).toBeEnabled();
    await expect(tag).toBeEnabled();
    await search.fill('Mobile Bookcase');
    await expect(page).toHaveURL(/\/projects\?q=Mobile\+Bookcase$/);
    await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText([
      'Mobile Bookcase',
    ]);
  } finally {
    releaseScripts();
  }
});

test('filters by tag, sorts alphabetically and restores both after a reload', async ({
  page,
  next,
}) => {
  void next;
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/projects');
  const cards = page.getByRole('link', { name: projectLinks });
  const total = await cards.count();

  await page.getByRole('button', { name: 'QA', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\?tag=QA$/);
  await expect(cards).not.toHaveCount(total);
  for (const card of await cards.all()) {
    await expect(card.getByText('QA', { exact: true })).toHaveCount(1);
  }

  await page.getByRole('combobox', { name: 'Project sort' }).selectOption('alphabetical');
  await expect(page).toHaveURL(/\/projects\?tag=QA&sort=alphabetical$/);
  const titles = await page.getByRole('list').getByRole('heading', { level: 2 }).allTextContents();
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));

  await page.reload();
  await expect(page.getByRole('button', { name: 'QA', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('combobox', { name: 'Project sort' })).toHaveValue('alphabetical');
  await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText(titles);
  expect(errors).toEqual([]);
});

test('syncs the search query to the URL and shows an empty state without matches', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/projects');
  const cards = page.getByRole('link', { name: projectLinks });
  const total = await cards.count();
  const title = (await cards.last().getByRole('heading', { level: 2 }).textContent()) ?? '';
  const search = page.getByRole('searchbox', { name: 'Project search' });

  await search.fill(title);
  await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe(title);
  await expect(page.getByRole('link', { name: `Read project: ${title}` })).toBeVisible();

  await search.fill('zzzz-no-such-project');
  await expect(page.getByText('표시할 프로젝트가 없습니다.')).toBeVisible();
  await expect(cards).toHaveCount(0);

  await search.fill('');
  await expect(page).toHaveURL(/\/projects$/);
  await expect(cards).toHaveCount(total);
});

test('normalizes unknown tag and sort parameters to the defaults', async ({ page, next }) => {
  void next;
  await page.goto('/projects?tag=no-such-tag&sort=bogus');
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('combobox', { name: 'Project sort' })).toHaveValue('recommended');
});

test('combines project search, tag and sort without dropping URL parameters', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/projects');
  await page.getByRole('button', { name: 'QA', exact: true }).click();
  await page.getByRole('combobox', { name: 'Project sort' }).selectOption('alphabetical');
  const titles = page.getByRole('list').getByRole('heading', { level: 2 });
  await expect(titles).toHaveText(['Commerce Flow', 'Project Atlas']);

  await page.getByRole('searchbox', { name: 'Project search' }).fill('Flow');
  await expect(page).toHaveURL(/\/projects\?tag=QA&sort=alphabetical&q=Flow$/);
  await expect(titles).toHaveText(['Commerce Flow']);
  await expect(page.getByRole('button', { name: 'QA', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('combobox', { name: 'Project sort' })).toHaveValue('alphabetical');
});

test('restores project filters and results after returning from a detail with browser back', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/projects?tag=QA&sort=alphabetical&q=Flow');
  await page.getByRole('link', { name: 'Read project: Commerce Flow' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Commerce Flow');

  await page.goBack();
  await expect(page).toHaveURL(/\/projects\?tag=QA&sort=alphabetical&q=Flow$/);
  await expect(page.getByRole('searchbox', { name: 'Project search' })).toHaveValue('Flow');
  await expect(page.getByRole('button', { name: 'QA', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('combobox', { name: 'Project sort' })).toHaveValue('alphabetical');
  await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText([
    'Commerce Flow',
  ]);
});

test('preserves an edited project search across browser forward and back', async ({
  page,
  next,
}) => {
  void next;
  await page.goto('/projects?tag=QA&sort=alphabetical&q=Flow');
  await page.getByRole('link', { name: 'Read project: Commerce Flow' }).click();
  await expect(page).toHaveURL(/\/projects\/commerce-flow$/);
  await page.goBack();
  await expect(page.getByRole('searchbox', { name: 'Project search' })).toHaveValue('Flow');
  await page.getByRole('searchbox', { name: 'Project search' }).fill('Atlas');
  await expect(page).toHaveURL(/\/projects\?tag=QA&sort=alphabetical&q=Atlas$/);
  await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText([
    'Project Atlas',
  ]);

  await page.goForward();
  await expect(page).toHaveURL(/\/projects\/commerce-flow$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Commerce Flow');
  await page.goBack();
  await expect(page).toHaveURL(/\/projects\?tag=QA&sort=alphabetical&q=Atlas$/);
  await expect(page.getByRole('searchbox', { name: 'Project search' })).toHaveValue('Atlas');
  await expect(page.getByRole('button', { name: 'QA', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.getByRole('combobox', { name: 'Project sort' })).toHaveValue('alphabetical');
  await expect(page.getByRole('list').getByRole('heading', { level: 2 })).toHaveText([
    'Project Atlas',
  ]);
});
