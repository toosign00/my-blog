import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { POST_CARD_INTERACTION_CLASS } from '@/constants/style.constants';
import type { Post } from '@/types/post.types';

import { PostViews } from './postViews';
import { PostViewsProvider } from './postViewsProvider';
import { RelativeTime } from './relativeTime';

type PostGridProps = ComponentProps<'div'> & {
  className?: string;
  posts: Post[];
  preloadFirstImage?: boolean;
};

export const PostGrid = ({
  posts,
  className,
  preloadFirstImage = true,
  ...props
}: PostGridProps) => {
  return (
    <PostViewsProvider slugs={posts.map((post) => post.slug)}>
      <div
        className={twMerge('grid w-full grid-cols-1 tablet:grid-cols-2 gap-16', className)}
        {...props}
      >
        {posts.map(({ _id, slug, title, coverImage, coverImageBlur, createdAt }, index) => {
          return (
            <Link
              aria-label={`Read post: ${title}`}
              className={twMerge(
                'flex w-full cursor-pointer flex-col',
                POST_CARD_INTERACTION_CLASS
              )}
              href={`/posts/${slug}`}
              key={_id}
            >
              <div className='relative aspect-cover w-full overflow-hidden rounded-lg border border-default'>
                <Image
                  alt={title}
                  className='h-full w-full object-cover object-center'
                  draggable={false}
                  fill
                  preload={preloadFirstImage && index === 0}
                  quality={100}
                  sizes='(max-width: 60rem) 100vw, (max-width: 80rem) calc(50vw - 9rem), 22rem'
                  src={coverImage}
                  {...(coverImageBlur && { placeholder: 'blur', blurDataURL: coverImageBlur })}
                />
              </div>

              <h2 className='title -mx-2.5 mt-4 -mb-0.5 line-clamp-2 flex overflow-hidden text-ellipsis rounded-sm px-2.5 py-0.5 font-medium text-body transition-colors duration-base ease-in-out'>
                {title}
              </h2>

              <p className='description center-y -mx-2.5 mt-4 -mb-0.5 w-fit rounded-sm px-2.5 py-0.5 font-medium text-caption text-muted transition-colors duration-base ease-in-out'>
                <RelativeTime time={createdAt} />
                <PostViews slug={slug} />
              </p>
            </Link>
          );
        })}
      </div>
    </PostViewsProvider>
  );
};
