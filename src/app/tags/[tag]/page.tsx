import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { parsePageParam } from '@/utils/page-param-util';
import { getAllPosts } from '@/utils/post-util';
import { getPostsViews } from '@/utils/stats-util';
import { decodeSlugSegment, slugify } from '@/utils/text-util';

interface TagsPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page: string }>;
}

const TagsPage = async ({ params, searchParams }: TagsPageProps) => {
  const { tag: rawTag } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));

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
        totalPages={Math.ceil(tagPosts.length / POST.PER_PAGE)}
      />
    </>
  );
};

export default TagsPage;

export const generateStaticParams = async () => {
  const allPosts = await getAllPosts();
  const tags = [...new Set(allPosts.flatMap((post) => post.tags || []))];

  return tags.map((tag) => ({
    tag: slugify(tag),
  }));
};

export const generateMetadata = async ({
  params,
  searchParams,
}: TagsPageProps): Promise<Metadata> => {
  const { tag: rawTag } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));
  const { page } = await searchParams;
  const current = parsePageParam(page);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));

  const tagName =
    tagPosts[0]?.tags?.find((t) => slugify(t) === tagKey) ?? decodeSlugSegment(rawTag);

  const tagPathSegment = encodeURIComponent(tagKey);

  return generatePageMetadata({
    title: current === 1 ? tagName : `${tagName} - Page ${current}`,
    path:
      current === 1
        ? `${ROUTES.TAGS}/${tagPathSegment}`
        : `${ROUTES.TAGS}/${tagPathSegment}?page=${current}`,
  });
};
