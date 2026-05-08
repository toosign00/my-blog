import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { getPostsViews } from '@/utils/stats-util';
import { decodeSlugSegment, slugify } from '@/utils/text-util';

interface TagsPageProps {
  params: Promise<{ tag: string; page: string }>;
}

const TagsPage = async ({ params }: TagsPageProps) => {
  const { tag: rawTag, page } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));
  const currentPage = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));
  const totalPages = Math.ceil(tagPosts.length / POST.PER_PAGE);
  if (tagPosts.length === 0 || currentPage < 1 || currentPage > totalPages) notFound();

  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;
  const pageTagPosts = tagPosts.slice(start, end);
  const views = await getPostsViews(pageTagPosts.map((p) => p.slug));
  const currentPosts = pageTagPosts.map((p) => ({ ...p, views: views[`/posts/${p.slug}`] ?? 0 }));

  const tagName =
    tagPosts[0]?.tags?.find((t) => slugify(t) === tagKey) ?? decodeSlugSegment(rawTag);

  return (
    <>
      <h1 className='section-heading mb-7.5'>
        {tagName} ({tagPosts.length})
      </h1>
      <PostList posts={currentPosts} />
      <Pagination
        basePath={`${ROUTES.TAGS}/${encodeURIComponent(tagKey)}`}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
};

export default TagsPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const tags = [...new Set(allPosts.flatMap((post) => post.tags || []))];

  return tags.flatMap((tag) => {
    const tagSlug = slugify(tag);
    const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagSlug));
    const totalPages = Math.ceil(tagPosts.length / POST.PER_PAGE);

    return Array.from({ length: totalPages }, (_, i) => ({
      tag: tagSlug,
      page: (i + 1).toString(),
    }));
  });
};

export const generateMetadata = async ({ params }: TagsPageProps): Promise<Metadata> => {
  const { tag: rawTag, page } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));
  const current = Number.parseInt(page, 10);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));
  const tagName =
    tagPosts[0]?.tags?.find((t) => slugify(t) === tagKey) ?? decodeSlugSegment(rawTag);

  return generatePageMetadata({
    title: `${tagName} - Page ${current}`,
    description: `${tagName} 태그의 글 목록입니다.`,
    path: `${ROUTES.TAGS}/${encodeURIComponent(tagKey)}/p/${current}`,
    canonicalPath: `${ROUTES.TAGS}/${encodeURIComponent(tagKey)}`,
  });
};
