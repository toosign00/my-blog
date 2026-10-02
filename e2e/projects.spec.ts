import { expect, test } from './fixtures';

const projectLinks = /^Read project:/;

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
