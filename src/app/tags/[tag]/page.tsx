import { Pagination } from "@components/ui/pagination";
import { PostList } from "@components/ui/postList";
import { ROUTES } from "@constants/menu.constants";
import { POST } from "@constants/metadata.constants";
import { generatePageMetadata } from "@utils/metadata-util";
import { getAllPosts } from "@utils/post-util";
import { slugify } from "@utils/text-util";
import type { Metadata } from "next";

interface TagsPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page: string }>;
}

const parsePageParam = (raw: string | undefined) => {
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

const TagsPage = async ({ params, searchParams }: TagsPageProps) => {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = parsePageParam(page);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag),
  );

  const sortedPosts = tagPosts.sort((a, b) =>
    a.createdAt > b.createdAt ? -1 : 1,
  );

  const start = (currentPage - 1) * POST.PER_PAGE;
  const end = start + POST.PER_PAGE;
  const currentPosts = sortedPosts.slice(start, end);

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return (
    <>
      <h1 className="h3 mb-7.5 text-gray-light">
        {tagName} ({tagPosts.length})
      </h1>
      <PostList posts={currentPosts} />
      <Pagination
        basePath={`${ROUTES.TAGS}/${tag}`}
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

  return tags.flatMap((tag) => {
    const tagPosts = allPosts.filter((post) => post.tags?.includes(tag));
    const totalPages = Math.ceil(tagPosts.length / POST.PER_PAGE);

    return Array.from({ length: totalPages }, (_, i) => ({
      tag: slugify(tag),
      page: (i + 1).toString(),
    }));
  });
};

export const generateMetadata = async ({
  params,
  searchParams,
}: TagsPageProps): Promise<Metadata> => {
  const { tag } = await params;
  const { page } = await searchParams;
  const current = parsePageParam(page);

  const allPosts = await getAllPosts();
  const tagPosts = allPosts.filter((post) =>
    post.tags?.some((t) => slugify(t) === tag),
  );

  const tagName = tagPosts[0]?.tags?.find((t) => slugify(t) === tag) ?? tag;

  return generatePageMetadata({
    title: current === 1 ? tagName : `${tagName} - Page ${current}`,
    path:
      current === 1
        ? `${ROUTES.TAGS}/${tag}`
        : `${ROUTES.TAGS}/${tag}?page=${current}`,
  });
};
