import type { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';
import { PostList } from '@/components/ui/postList';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA, POST } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllPosts } from '@/utils/post-util';
import { getPostsViews } from '@/utils/stats-util';
import { decodeSlugSegment, slugify } from '@/utils/text-util';

interface TagsPageProps {
  params: Promise<{ tag: string }>;
}

const TagsPage = async ({ params }: TagsPageProps) => {
  const { tag: rawTag } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));
  const pageTagPosts = tagPosts.slice(0, POST.PER_PAGE);
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
        currentPage={1}
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

export const generateMetadata = async ({ params }: TagsPageProps): Promise<Metadata> => {
  const { tag: rawTag } = await params;
  const tagKey = slugify(decodeSlugSegment(rawTag));

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) => post.tags?.some((t) => slugify(t) === tagKey));
  const tagName =
    tagPosts[0]?.tags?.find((t) => slugify(t) === tagKey) ?? decodeSlugSegment(rawTag);

  return generatePageMetadata({
    title: tagName,
    description: METADATA.PAGES.TAG(tagName),
    path: `${ROUTES.TAGS}/${encodeURIComponent(tagKey)}`,
  });
};
