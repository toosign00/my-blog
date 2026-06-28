import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPosting, WithContext } from 'schema-dts';
import JsonLd from '@/components/JsonLd';
import { BackButton } from '@/components/ui/backButton';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import type { Post } from '@/types/post.types';
import { generatePageMetadata } from '@/utils/metadata-util';
import {
  getAllPosts,
  getPostBySlug,
  getPostPageDataBySlug,
  getPostToc,
  PostNotFoundError,
} from '@/utils/post-util';
import { Footer } from './_components/footer';
import { Giscus } from './_components/giscus';
import { Header } from './_components/header';
import { Recommend } from './_components/recommend';
import { Toc } from './_components/toc';
import { ViewCounter } from './_components/view-counter';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

const RECOMMEND_COUNT = 4;

const toAbsoluteUrl = (url: string) => {
  return url.startsWith('http') ? url : `${METADATA.SITE.URL}${url}`;
};

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  let MDXContent: Awaited<ReturnType<typeof getPostPageDataBySlug>>['content'];
  let post: Awaited<ReturnType<typeof getPostPageDataBySlug>>['post'];
  try {
    const pageData = await getPostPageDataBySlug(slug);
    MDXContent = pageData.content;
    post = pageData.post;
  } catch (error) {
    if (!(error instanceof PostNotFoundError)) {
      throw error;
    }

    notFound();
  }

  const pathname = `/posts/${slug}`;
  const [allPosts, tocItems] = await Promise.all([getAllPosts(), getPostToc(slug)]);

  const blogPostingSchema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.subtitle,
    datePublished: post.createdAt,
    dateModified: post.modifiedAt ?? post.createdAt,
    image: toAbsoluteUrl(post.coverImage),
    url: `${METADATA.SITE.URL}${pathname}`,
    author: {
      '@type': 'Person',
      name: METADATA.AUTHOR.NAME,
      url: METADATA.SITE.URL,
    },
    publisher: {
      '@type': 'Person',
      name: METADATA.AUTHOR.NAME,
      url: METADATA.SITE.URL,
    },
    keywords: post.tags?.join(', '),
    inLanguage: METADATA.SITE.LANGUAGE,
  };

  return (
    <>
      <JsonLd data={blogPostingSchema} />
      <Toc items={tocItems} />
      <BackButton />

      <article>
        <Header {...post} viewCounter={<ViewCounter pathname={pathname} />} />
        <MDXContent />

        {post.comments && <Giscus className='mt-14' />}

        <Footer {...post} />
      </article>

      <Divider className='my-14' />
      <Recommend posts={getRecommendedPosts(allPosts, slug)} />
    </>
  );
};

export default PostPage;

export const generateMetadata = async ({ params }: PostPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    return generatePageMetadata({
      title: post.title,
      description: post.subtitle,
      path: `${ROUTES.POSTS}/${slug}`,
      image: toAbsoluteUrl(post.coverImage),
      type: 'article',
      openGraph: {
        publishedTime: post.createdAt,
        modifiedTime: post.modifiedAt,
        authors: [METADATA.AUTHOR.NAME],
        tags: post.tags,
      },
    });
  } catch (error) {
    if (!(error instanceof PostNotFoundError)) {
      throw error;
    }

    notFound();
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
    const isIncluded = (post: Post) => recommended.some((p) => p.slug === post.slug);

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
