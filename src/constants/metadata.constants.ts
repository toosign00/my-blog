export const METADATA = {
  SITE: {
    URL: 'https://toosign.me',
    NAME: 'Hyunsoo Ro',
    DESCRIPTION: '노현수의 블로그입니다',
    PREVIEW_IMAGE: 'https://toosign.me/og-image.png',
    LANGUAGE: 'ko-KR',
  },
  PAGES: {
    POSTS: '글 목록을 확인할 수 있습니다.',
    CATEGORIES: '카테고리별로 글을 탐색할 수 있습니다.',
    TAGS: '태그별로 글을 탐색할 수 있습니다.',
    CATEGORY: (name: string) => `${name} 카테고리의 글 목록입니다.`,
    TAG: (name: string) => `${name} 태그의 글 목록입니다.`,
  },

  AUTHOR: {
    NAME: '노현수',
    EMAIL: 'kevinsoo1014@gmail.com',
    PROFILE_IMAGE: '/assets/images/profile.webp',
    STUDYING: 'Automation Testing, Load Testing',
    LOCATION: 'Ansan, South Korea',
    BIRTH_DATE: '2000. 11. 07',
  },
};

export const POST = {
  PER_PAGE: 10,
};
