import { PostGrid } from '@/components/ui/postGrid';
import type { Post } from '@/types/content.types';

interface RecommendProps {
  posts: Post[];
}

export const Recommend = ({ posts }: RecommendProps) => {
  return (
    <section aria-labelledby='recommendation-heading' className='column gap-6'>
      <h3 className='section-heading text-gray-accent' id='recommendation-heading'>
        Check them out
      </h3>
      <PostGrid className='mb-14' posts={posts} />
    </section>
  );
};
