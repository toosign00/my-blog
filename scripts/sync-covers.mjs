import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const articlesDir = join(process.cwd(), 'src', 'app', 'posts', '_articles');
const projectsDir = join(process.cwd(), 'src', 'app', 'projects', '_projects');
const coversDir = join(process.cwd(), 'public', 'covers');

rmSync(coversDir, { force: true, recursive: true });

const syncCovers = (sourceDir, outputDir) => {
  if (!existsSync(sourceDir)) return;

  for (const slug of readdirSync(sourceDir)) {
    const itemDir = join(sourceDir, slug);
    if (!statSync(itemDir).isDirectory()) continue;

    for (const file of readdirSync(itemDir)) {
      if (!file.startsWith('cover.')) continue;

      mkdirSync(join(outputDir, slug), { recursive: true });
      cpSync(join(itemDir, file), join(outputDir, slug, file));
    }
  }
};

syncCovers(articlesDir, join(coversDir, 'posts'));
syncCovers(projectsDir, join(coversDir, 'projects'));
