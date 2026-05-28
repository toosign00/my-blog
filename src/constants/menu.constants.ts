export const MENU = [
  { title: 'Home', link: '/' },
  { title: 'About', link: '/about' },
  { title: 'Posts', link: '/posts' },
] as const;

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  POSTS: '/posts',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  RSS: '/rss.xml',
  SECURITY_POLICY: '/security-policy',
  ACKNOWLEDGMENTS: '/acknowledgments',
  SITEMAP: '/sitemap.xml',
} as const;
