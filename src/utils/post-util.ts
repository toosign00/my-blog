import { readdir } from "node:fs/promises";
import type { ComponentType } from "react";
import { cache } from "react";
import { PATHS } from "@/constants/paths.constants";
import type { Post, PostCoverImage, PostMetadata } from "@/types/content.types";

interface PostModule {
  default: ComponentType;
  metadata?: PostMetadata;
}

interface PostPageData {
  post: Post;
  content: PostModule["default"];
}

const resolveCoverImage = async (
  slug: string,
  coverImage: string,
): Promise<PostCoverImage> => {
  if (coverImage.startsWith("https://")) {
    return coverImage;
  }

  try {
    const image = await import(`@/app/posts/_articles/${slug}/${coverImage}`);
    return image.default;
  } catch {
    return coverImage;
  }
};

const buildPost = async (
  slug: string,
  metadata: PostMetadata,
): Promise<Post> => {
  const coverImage = await resolveCoverImage(slug, metadata.coverImage);
  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage,
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
    const postModule = (await import(
      `@/app/posts/_articles/${slug}/post.mdx`
    )) as PostModule;
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

export const getPostPageDataBySlug = async (
  slug: string,
): Promise<PostPageData> => {
  try {
    const postModule = (await import(
      `@/app/posts/_articles/${slug}/post.mdx`
    )) as PostModule;

    if (!postModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}/post.mdx`);
    }

    return {
      post: await buildPost(slug, postModule.metadata),
      content: postModule.default,
    };
  } catch {
    throw new Error(`Post not found: ${slug}`);
  }
};
