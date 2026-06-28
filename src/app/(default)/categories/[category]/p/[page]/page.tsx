import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { slugify } from '@/utils/text-util';

interface CategoriesPageProps {
  params: Promise<{ category: string; page: string }>;
}

export const dynamicParams = false;

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { category, page } = await params;
  const currentPage = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);
  const totalPages = Math.ceil(categoryPosts.length / POST.PER_PAGE);
  if (categoryPosts.length === 0 || currentPage <= 1 || currentPage > totalPages) notFound();

  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;
  const currentPosts = categoryPosts.slice(start, end);

  return (
    <>
      <h1 className='section-heading mb-7.5'>
        {categoryPosts[0].category} ({categoryPosts.length})
      </h1>
      <PostList posts={currentPosts} />
      <Pagination
        basePath={`${ROUTES.CATEGORIES}/${category}`}
        currentPage={currentPage}
        totalPages={totalPages}
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

    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      category: slugify(category),
      page: (i + 2).toString(),
    }));
  });
};

export const generateMetadata = async ({ params }: CategoriesPageProps): Promise<Metadata> => {
  const { category, page } = await params;
  const current = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);
  if (categoryPosts.length === 0 || current <= 1) notFound();

  const categoryName = categoryPosts[0].category;

  return generatePageMetadata({
    title: `${categoryName} - Page ${current}`,
    description: METADATA.PAGES.CATEGORY(categoryName),
    path: `${ROUTES.CATEGORIES}/${category}/p/${current}`,
    canonicalPath: `${ROUTES.CATEGORIES}/${category}`,
  });
};
