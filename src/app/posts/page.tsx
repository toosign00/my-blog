import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';

const PostsPage = async () => {
  const allPosts = await getAllPosts();
  const currentPosts = allPosts.slice(0, POST.PER_PAGE);

  return (
    <>
      <h1 className='section-heading mb-7.5'>Posts ({allPosts.length})</h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={ROUTES.POSTS}
        currentPage={1}
        totalPages={Math.ceil(allPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default PostsPage;

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Posts',
    description: METADATA.PAGES.POSTS,
    path: ROUTES.POSTS,
  });
};
