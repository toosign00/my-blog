import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ComponentType } from 'react';
import { cache } from 'react';
import { PATHS } from '@/constants/paths.constants';
import type { Post, PostMetadata, TocItem } from '@/types/post.types';
import { createBlur } from '@/utils/blur-util';

interface PostModule {
  default: ComponentType;
  metadata?: PostMetadata;
}

interface PostPageData {
  post: Post;
  content: PostModule['default'];
}

export class PostNotFoundError extends Error {
  constructor(slug: string) {
    super(`Post not found: ${slug}`);
    this.name = 'PostNotFoundError';
  }
}

const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm;
const POST_FILE = 'post.mdx';

const hasPostFile = async (slug: string): Promise<boolean> => {
  try {
    await access(path.join(PATHS.POSTS_ARTICLES_DIR, slug, POST_FILE));
    return true;
  } catch {
    return false;
  }
};

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
  return `/covers/posts/${slug}/${coverImage}`;
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(isNonEmptyString);
};

const isValidDateString = (value: string) => {
  return Number.isFinite(Date.parse(value));
};

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const validatePostMetadata = (slug: string, metadata: PostMetadata) => {
  const errors: string[] = [];

  if (!isNonEmptyString(metadata.title)) errors.push('title is required');
  if (!isNonEmptyString(metadata.subtitle)) errors.push('subtitle is required');
  if (!isNonEmptyString(metadata.createdAt)) errors.push('createdAt is required');
  if (!isNonEmptyString(metadata.modifiedAt)) errors.push('modifiedAt is required');
  if (!isNonEmptyString(metadata.coverImage)) errors.push('coverImage is required');
  if (!isNonEmptyString(metadata.category)) errors.push('category is required');
  if (metadata.tags !== undefined && !isStringArray(metadata.tags)) {
    errors.push('tags must be a string array');
  }
  if (metadata.createdAt && !isValidDateString(metadata.createdAt)) {
    errors.push('createdAt must be a valid date');
  }
  if (metadata.modifiedAt && !isValidDateString(metadata.modifiedAt)) {
    errors.push('modifiedAt must be a valid date');
  }
  if (isNonEmptyString(metadata.coverImage) && metadata.coverImage.includes('://')) {
    if (!isValidUrl(metadata.coverImage)) {
      errors.push('coverImage must be a valid URL or local file name');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid post metadata in ${slug}: ${errors.join(', ')}`);
  }
};

const buildPost = async (slug: string, metadata: PostMetadata): Promise<Post> => {
  validatePostMetadata(slug, metadata);

  const coverImage = resolveCoverImage(slug, metadata.coverImage);
  let coverImageBlur: string | undefined;

  try {
    const systemPath = path.join(PATHS.POSTS_ARTICLES_DIR, slug, metadata.coverImage);
    coverImageBlur = await createBlur(systemPath);
  } catch {
    // blur 생성 실패 시 무시
  }

  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage,
    coverImageBlur,
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

    items.push(await buildPost(slug, postModule.metadata));
  }

  items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  return items;
});

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { post } = await getPostPageDataBySlug(slug);
  return post;
};

export const getPostPageDataBySlug = async (slug: string): Promise<PostPageData> => {
  if (!(await hasPostFile(slug))) {
    throw new PostNotFoundError(slug);
  }

  const postModule = (await import(`@/app/posts/_articles/${slug}/post.mdx`)) as PostModule;

  if (!postModule.metadata) {
    throw new Error(`Missing \`metadata\` in ${slug}/post.mdx`);
  }

  return {
    post: await buildPost(slug, postModule.metadata),
    content: postModule.default,
  };
};
