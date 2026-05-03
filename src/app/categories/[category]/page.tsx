import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { parsePageParam } from '@/utils/page-param-util';
import { getAllPosts } from '@/utils/post-util';
import { slugify } from '@/utils/text-util';

interface CategoriesPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page: string }>;
}

const CategoriesPage = async ({ params, searchParams }: CategoriesPageProps) => {
  const { category } = await params;

  const { page } = await searchParams;
  const currentPage = parsePageParam(page);

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);

  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;
  const currentPosts = categoryPosts.slice(start, end);

  return (
    <>
      <h1 className='h3 mb-7.5 text-gray-light'>
        {categoryPosts.length > 0
          ? `${categoryPosts[0].category} (${categoryPosts.length})`
          : `${category} (0 posts)`}
      </h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={`${ROUTES.CATEGORIES}/${category}`}
        currentPage={currentPage}
        totalPages={Math.ceil(categoryPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default CategoriesPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];

  return categories.flatMap((category) => {
    const categoryPosts = allPosts.filter((post) => post.category === category);
    const totalPages = Math.ceil(categoryPosts.length / POST.PER_PAGE);

    return Array.from({ length: totalPages }, (_, i) => ({
      category: slugify(category),
      page: (i + 1).toString(),
    }));
  });
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CategoriesPageProps): Promise<Metadata> => {
  const { category } = await params;

  const { page } = await searchParams;
  const current = parsePageParam(page);
  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);
  const categoryName = categoryPosts[0]?.category ?? category;

  return generatePageMetadata({
    title: current === 1 ? categoryName : `${categoryName} - Page ${current}`,
    path:
      current === 1
        ? `${ROUTES.CATEGORIES}/${category}`
        : `${ROUTES.CATEGORIES}/${category}?page=${current}`,
  });
};
