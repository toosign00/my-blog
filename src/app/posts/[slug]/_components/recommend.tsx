import { PostGrid } from '@/components/ui/postGrid';
import type { Post } from '@/types/content.types';

interface RecommendProps {
  posts: Post[];
}

export const Recommend = ({ posts }: RecommendProps) => {
  return (
    <section aria-labelledby='recommendation-heading'>
      <h3 className='font-medium text-gray-accent text-lg' id='recommendation-heading'>
        🦾 Check them out
      </h3>
      <PostGrid className='mt-9 mb-14' posts={posts} />
    </section>
  );
};
