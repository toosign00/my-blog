import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { ProfileGrid } from '@/components/ProfileGrid';
import { PostGrid } from '@/components/ui/postGrid';
import { ROUTES } from '@/constants/menu.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { getPostsViews } from '@/utils/stats-util';

const getLatestPosts = <T extends { slug: string }>(posts: T[]) => posts.slice(0, 2);

const HomePage = async () => {
  const allPosts = await getAllPosts();
  const latestPosts = getLatestPosts(allPosts);
  const views = await getPostsViews(latestPosts.map((p) => p.slug));
  const posts = latestPosts.map((p) => ({ ...p, views: views[`/posts/${p.slug}`] ?? 0 }));

  return (
    <>
      <ProfileGrid />

      <ActivityHeatmap />

      <section aria-labelledby='updates-heading' className='column gap-7.5 pt-17.5 pb-16.25'>
        <div className='row-between'>
          <h3 className='section-heading' id='updates-heading'>
            Update
          </h3>
          <Link
            aria-label='Expand to see more posts'
            className='section-action-chip'
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

export const dynamic = 'force-dynamic';

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    path: ROUTES.HOME,
  });
