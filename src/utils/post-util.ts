import { readdir } from "node:fs/promises";
import type { ComponentType } from "react";
import { cache } from "react";
import { PATHS } from "@/constants/paths.constants";
import type { Post, PostCoverImage, PostMetadata } from "@/types/content.types";

const MDX_EXTENSION = ".mdx";

interface PostModule {
  default: ComponentType;
  metadata?: PostMetadata;
}

interface PostPageData {
  post: Post;
  content: PostModule["default"];
}

const resolveCoverImage = async (
  coverImage: string,
): Promise<PostCoverImage> => {
  if (coverImage.startsWith("https://")) {
    return coverImage;
  }

  try {
    const image = await import(`../assets/images/${coverImage}`);
    return image.default;
  } catch {
    // Error is handled by falling back to the original coverImage string
    return coverImage;
  }
};

const buildPost = async (
  slug: string,
  metadata: PostMetadata,
): Promise<Post> => {
  const coverImage = await resolveCoverImage(metadata.coverImage);
  return {
    _id: slug,
    slug,
    ...metadata,
    coverImage,
  };
};

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const entries = await readdir(PATHS.POSTS_ARTICLES_DIR);

  const items: Post[] = [];
  for (const filename of entries) {
    if (!filename.endsWith(MDX_EXTENSION)) {
      continue;
    }

    const postModule = (await import(
      `@/app/posts/_articles/${filename}`
    )) as PostModule;
    if (!postModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${filename}`);
    }

    const slug = filename.slice(0, -MDX_EXTENSION.length);
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
      `@/app/posts/_articles/${slug}.mdx`
    )) as PostModule;

    if (!postModule.metadata) {
      throw new Error(`Missing \`metadata\` in ${slug}.mdx`);
    }

    return {
      post: await buildPost(slug, postModule.metadata),
      content: postModule.default,
    };
  } catch {
    throw new Error(`Post not found: ${slug}`);
  }
};
