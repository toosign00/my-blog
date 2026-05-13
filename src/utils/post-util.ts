import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import { cache } from 'react';
import { PATHS } from '@/constants/paths.constants';
import type { Post, PostMetadata, TocItem } from '@/types/content.types';

interface PostModule {
  default: ComponentType;
  metadata?: PostMetadata;
}

interface PostPageData {
  post: Post;
  content: PostModule['default'];
}

const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm;

export const getPostToc = async (slug: string): Promise<TocItem[]> => {
  const filePath = path.join(PATHS.POSTS_ARTICLES_DIR, slug, 'post.mdx');
  const content = await readFile(filePath, 'utf-8');
  const items: TocItem[] = [];

  for (const match of content.matchAll(HEADING_REGEX)) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\sㄱ-힣]/g, '')
      .replace(/\s+/g, '-');
    items.push({ id, text, level });
  }

  return items;
};

const resolveCoverImage = (slug: string, coverImage: string): string => {
  if (coverImage.startsWith('https://')) {
    return coverImage;
  }
  return `/covers/${slug}/${coverImage}`;
};

const buildPost = (slug: string, metadata: PostMetadata): Post => {
  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage: resolveCoverImage(slug, metadata.coverImage),
  };
};

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const entries = await readdir(PATHS.POSTS_ARTICLES_DIR, {
    withFileTypes: true,
  });

  const items: Post[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const postModule = (await import(`@/app/posts/_articles/${slug}/post.mdx`)) as PostModule;
    if (!postModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}/post.mdx`);
    }

    items.push(buildPost(slug, postModule.metadata));
  }

  items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  return items;
});

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { post } = await getPostPageDataBySlug(slug);
  return post;
};

export const getPostPageDataBySlug = async (slug: string): Promise<PostPageData> => {
  try {
    const postModule = (await import(`@/app/posts/_articles/${slug}/post.mdx`)) as PostModule;

    if (!postModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}/post.mdx`);
    }

    return {
      post: buildPost(slug, postModule.metadata),
      content: postModule.default,
    };
  } catch {
    throw new Error(`Post not found: ${slug}`);
  }
};
