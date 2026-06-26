import { Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { ProfileGrid } from '@/components/ProfileGrid';
import { PostGrid } from '@/components/ui/postGrid';
import { ROUTES } from '@/constants/menu.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';

const getLatestPosts = <T extends { slug: string }>(posts: T[]) => posts.slice(0, 2);

const HomePage = async () => {
  const allPosts = await getAllPosts();
  const posts = getLatestPosts(allPosts);

  return (
    <div className='column pb-16.25'>
      <h1 className='sr-only'>노현수의 QA 엔지니어링 및 취미 블로그</h1>
      <ProfileGrid />

      <ActivityHeatmap />

      <section aria-labelledby='updates-heading' className='column gap-7.5 pt-17.5'>
        <div className='row-between'>
          <h2 className='section-heading' id='updates-heading'>
            Latest Updates
          </h2>
          <Link
            aria-label='Expand to see more posts'
            className='section-action-chip'
            href={ROUTES.POSTS}
          >
            Expand
            <Plus size={16} />
          </Link>
        </div>
        <PostGrid posts={posts} />
      </section>
    </div>
  );
};

export default HomePage;

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    path: ROUTES.HOME,
  });
