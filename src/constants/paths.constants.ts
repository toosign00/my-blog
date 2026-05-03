import path from 'node:path';

export const PATHS = {
  POSTS_ARTICLES_DIR: path.join(process.cwd(), 'src', 'app', 'posts', '_articles'),
} as const;
