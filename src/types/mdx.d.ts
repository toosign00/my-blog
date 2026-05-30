declare module '*.mdx' {
  import type { MDXContent } from 'mdx/types';
  import type { PostMetadata } from '@/types/post.types';
  import type { ProjectMetadata } from '@/types/project.types';

  const content: MDXContent;
  export default content;
  export const metadata: PostMetadata | ProjectMetadata;
}
