import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { ProfileGrid } from '@/components/ProfileGrid';
import { PostGrid } from '@/components/ui/postGrid';
import { ROUTES } from '@/constants/menu.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';

const getLatestPosts = <T,>(posts: T[]) => posts.slice(0, 2);

const HomePage = async () => {
  const allPosts = await getAllPosts();
  const posts = getLatestPosts(allPosts);

  return (
    <>
      <ProfileGrid />

      <ActivityHeatmap />

      <section aria-labelledby='updates-heading' className='column gap-7.5 pt-17.5 pb-16.25'>
        <div className='row-between'>
          <h3 className='h3 text-gray-light' id='updates-heading'>
            Update
          </h3>
          <Link
            aria-label='Expand to see more posts'
            className='center h4 h-8 gap-1.5 rounded-md border border-border bg-toggle px-3 text-gray-light'
            href={ROUTES.POSTS}
          >
            Expand
            <PlusIcon />
          </Link>
        </div>
        <PostGrid posts={posts} />
      </section>
    </>
  );
};

export default HomePage;

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    path: ROUTES.HOME,
  });
