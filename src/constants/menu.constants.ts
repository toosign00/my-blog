export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  POSTS: '/posts',
  PROJECTS: '/projects',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  RSS: '/rss.xml',
  SECURITY_POLICY: '/security-policy',
  ACKNOWLEDGMENTS: '/acknowledgments',
  SITEMAP: '/sitemap.xml',
} as const;

export const MENU = [
  { title: 'Home', link: ROUTES.HOME },
  { title: 'About', link: ROUTES.ABOUT },
  { title: 'Posts', link: ROUTES.POSTS },
  { title: 'Projects', link: ROUTES.PROJECTS },
] as const;
