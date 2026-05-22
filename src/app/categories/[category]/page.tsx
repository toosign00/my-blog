import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { slugify } from '@/utils/text-util';

interface CategoriesPageProps {
  params: Promise<{ category: string }>;
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { category } = await params;

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);
  const currentPosts = categoryPosts.slice(0, POST.PER_PAGE);

  return (
    <>
      <h1 className='section-heading mb-7.5'>
        {categoryPosts.length > 0
          ? `${categoryPosts[0].category} (${categoryPosts.length})`
          : `${category} (0 posts)`}
      </h1>

      <PostList posts={currentPosts} />

      <Pagination
        basePath={`${ROUTES.CATEGORIES}/${category}`}
        currentPage={1}
        totalPages={Math.ceil(categoryPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default CategoriesPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];

  return categories.map((category) => ({
    category: slugify(category),
  }));
};

export const generateMetadata = async ({ params }: CategoriesPageProps): Promise<Metadata> => {
  const { category } = await params;

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => slugify(post.category) === category);
  const categoryName = categoryPosts[0]?.category ?? category;

  return generatePageMetadata({
    title: categoryName,
    description: METADATA.PAGES.CATEGORY(categoryName),
    path: `${ROUTES.CATEGORIES}/${category}`,
  });
};
