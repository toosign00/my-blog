import { cpSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const articlesDir = join(process.cwd(), 'src', 'app', 'posts', '_articles');
const coversDir = join(process.cwd(), 'public', 'covers');

rmSync(coversDir, { force: true, recursive: true });

for (const slug of readdirSync(articlesDir)) {
  const articleDir = join(articlesDir, slug);
  if (!statSync(articleDir).isDirectory()) continue;

  for (const file of readdirSync(articleDir)) {
    if (!file.startsWith('cover.')) continue;

    mkdirSync(join(coversDir, slug), { recursive: true });
    cpSync(join(articleDir, file), join(coversDir, slug, file));
  }
}
