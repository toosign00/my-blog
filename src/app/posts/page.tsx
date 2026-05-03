import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { parsePageParam } from '@/utils/page-param-util';
import { getAllPosts } from '@/utils/post-util';

interface PostsPageProps {
  searchParams: Promise<{ page: string }>;
}

const PostsPage = async ({ searchParams }: PostsPageProps) => {
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);
  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;

  const allPosts = await getAllPosts();
  const currentPosts = allPosts.slice(start, end);

  return (
    <>
      <h1 className='h3 mb-7.5 text-gray-light'>Posts ({allPosts.length})</h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={ROUTES.POSTS}
        currentPage={currentPage}
        totalPages={Math.ceil(allPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default PostsPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POST.PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
};

export const generateMetadata = async ({ searchParams }: PostsPageProps): Promise<Metadata> => {
  const { page } = await searchParams;
  const current = parsePageParam(page);

  return generatePageMetadata({
    title: current === 1 ? 'Posts' : `Posts - Page ${current}`,
    path: current === 1 ? ROUTES.POSTS : `${ROUTES.POSTS}/p/${current}`,
  });
};
