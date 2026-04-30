import { Divider } from "@components/ui/divider";
import { ROUTES } from "@constants/menu.constants";
import { METADATA } from "@constants/metadata.constants";
import { generatePageMetadata } from "@utils/metadata-util";
import { getAllPosts, getPostPageDataBySlug } from "@utils/post-util";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Post } from "@/types/content.types";
import { BackButton } from "./_components/back-button";
import { Footer } from "./_components/footer";
import { Giscus } from "./_components/giscus";
import { Header } from "./_components/header";
import { Recommend } from "./_components/recommend";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const RECOMMEND_COUNT = 4;

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  let MDXContent: Awaited<ReturnType<typeof getPostPageDataBySlug>>["content"];
  let post: Awaited<ReturnType<typeof getPostPageDataBySlug>>["post"];
  try {
    const pageData = await getPostPageDataBySlug(slug);
    MDXContent = pageData.content;
    post = pageData.post;
  } catch {
    notFound();
  }

  const allPosts = await getAllPosts();

  return (
    <>
      <BackButton />

      <article>
        <Header {...post} />
        <MDXContent />

        {post.comments && <Giscus className="mt-14" />}

        <Divider className="mb-14" />
        <Footer {...post} />
      </article>

      <Divider className="my-14" />
      <Recommend posts={getRecommendedPosts(allPosts, slug)} />
    </>
  );
};

export default PostPage;

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const { metadata } = await import(`../_articles/${slug}/post.mdx`);
    if (!metadata) {
      return generatePageMetadata({});
    }

    return generatePageMetadata({
      title: metadata.title,
      description: metadata.subtitle,
      path: `${ROUTES.POSTS}/${slug}`,
      image: metadata.coverImage,
      type: "article",
      openGraph: {
        publishedTime: metadata.createdAt,
        modifiedTime: metadata.modifiedAt,
        authors: [METADATA.AUTHOR.NAME],
        tags: metadata.tags,
      },
    });
  } catch {
    return generatePageMetadata({});
  }
};

export async function generateStaticParams() {
  const allPosts = await getAllPosts();
  return allPosts.map((post) => ({ slug: post.slug }));
}

const getRecommendedPosts = (posts: Post[], slug: string): Post[] => {
  const currentIndex = posts.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    return posts.slice(0, RECOMMEND_COUNT);
  }

  const sliceClamped = (start: number, end: number) =>
    posts.slice(Math.max(0, start), Math.min(posts.length, end));

  const prev = sliceClamped(currentIndex - 2, currentIndex);
  const next = sliceClamped(currentIndex + 1, currentIndex + 3);

  let recommended = [...prev, ...next];

  if (recommended.length < RECOMMEND_COUNT) {
    const need = RECOMMEND_COUNT - recommended.length;
    const isFront = currentIndex < posts.length / 2;
    const isIncluded = (post: Post) =>
      recommended.some((p) => p.slug === post.slug);

    if (isFront) {
      const more = sliceClamped(currentIndex + 3, currentIndex + 3 + need * 2)
        .filter((post) => !isIncluded(post))
        .slice(0, need);
      recommended = [...recommended, ...more];
    } else {
      const prevWindowStart = Math.max(0, currentIndex - 2);
      const more = sliceClamped(prevWindowStart - need * 2, prevWindowStart)
        .filter((post) => !isIncluded(post))
        .slice(0, need);
      recommended = [...more, ...recommended];
    }
  }

  return recommended;
};
