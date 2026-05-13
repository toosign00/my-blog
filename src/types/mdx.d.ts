declare module '*.mdx' {
  import type { MDXContent } from 'mdx/types';
  import type { PostMetadata } from '@/types/content.types';

  const content: MDXContent;
  export default content;
  export const metadata: PostMetadata;
}
