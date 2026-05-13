export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  POSTS: '/posts',
  POSTS_PAGE: (page: number) => (page === 1 ? '/posts' : `/posts/p/${page}`),
  POST: (slug: string) => `/posts/${slug}`,
  CATEGORIES: '/categories',
  CATEGORY: (slug: string) => `/categories/${slug}`,
  TAGS: '/tags',
  TAG: (slug: string) => `/tags/${slug}`,
} as const;

export const SLUGS = {
  FILM_01: 'filmlog-01',
  FILM_02: 'filmlog-02',
  ISTQB: 'istqb-ctfl-pass-review',
} as const;

export const CATEGORY_SLUGS = {
  FILM: 'film',
} as const;

export const TAG_SLUGS = {
  PHOTO: 'photo',
} as const;
