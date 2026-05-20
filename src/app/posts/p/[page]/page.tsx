import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { getPostsViews } from '@/utils/views-util';

interface PostsPageProps {
  params: Promise<{ page: string }>;
}

const PostsPage = async ({ params }: PostsPageProps) => {
  const { page } = await params;
  const currentPage = Number.parseInt(page, 10);
  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;

  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POST.PER_PAGE);
  if (currentPage < 1 || currentPage > totalPages) notFound();

  const pagePosts = allPosts.slice(start, end);
  const views = await getPostsViews(pagePosts.map((p) => p.slug));
  const currentPosts = pagePosts.map((p) => ({ ...p, views: views[`/posts/${p.slug}`] ?? 0 }));

  return (
    <>
      <h1 className='section-heading mb-7.5'>Posts ({allPosts.length})</h1>
      <PostList posts={currentPosts} />
      <Pagination basePath={ROUTES.POSTS} currentPage={currentPage} totalPages={totalPages} />
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

export const generateMetadata = async ({ params }: PostsPageProps): Promise<Metadata> => {
  const { page } = await params;
  const current = Number.parseInt(page, 10);

  return generatePageMetadata({
    title: `Posts - Page ${current}`,
    description: METADATA.PAGES.POSTS,
    path: `${ROUTES.POSTS}/p/${current}`,
    canonicalPath: ROUTES.POSTS,
  });
};
