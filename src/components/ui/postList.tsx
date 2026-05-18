'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { ROUTES } from '@/constants/menu.constants';
import { POST_CARD_INTERACTION_CLASS } from '@/constants/style.constants';
import { usePostViews } from '@/hooks/usePostViews';
import type { Post } from '@/types/content.types';
import { RelativeTime } from './relativeTime';

type PostListProps = ComponentProps<'ul'> & {
  className?: string;
  posts: Post[];
};

export const PostList = ({ posts, className, ...props }: PostListProps) => {
  const slugs = useMemo(() => posts.map((p) => p.slug), [posts]);
  const viewsState = usePostViews(slugs);

  return (
    <ul className={twMerge('column list-none gap-7.5', className)} {...props}>
      {posts.map(
        (
          { _id, slug, title, subtitle, coverImage, coverImageBlur, category, createdAt },
          index
        ) => {
          const viewCount =
            viewsState.status === 'done' ? viewsState.data[`/posts/${slug}`] : undefined;
          return (
            <li key={_id}>
              <Link
                aria-label={`Read post: ${title}`}
                className={twMerge(
                  'flex cursor-pointer flex-col gap-4.5 tablet:flex-row tablet:gap-8.75',
                  POST_CARD_INTERACTION_CLASS,
                  'hover:[&_.subtitle]:bg-gray-hover active:[&_.subtitle]:bg-border'
                )}
                href={`${ROUTES.POSTS}/${slug}`}
              >
                <div className='relative aspect-[1.8/1] w-full shrink-0 overflow-hidden rounded-lg border border-border tablet:w-86.5'>
                  <Image
                    alt={`${title} Cover Image`}
                    className='h-full w-full object-cover object-center'
                    draggable={false}
                    fill
                    priority={index === 0}
                    quality={75}
                    sizes='(max-width: 59.9375rem) 100vw, 21.625rem'
                    src={coverImage}
                    {...(coverImageBlur && { placeholder: 'blur', blurDataURL: coverImageBlur })}
                  />
                </div>

                <div className='column flex-1'>
                  <h2 className='title post-subtitle -mx-2.5 -mb-0.5 rounded-sm px-2.5 py-0.5 text-gray-accent transition-colors duration-250 ease-in-out'>
                    {title}
                  </h2>
                  <p className='subtitle post-description -mx-2.5 mt-3 -mb-0.5 rounded-sm px-2.5 py-0.5 text-gray-mid transition-colors duration-250 ease-in-out tablet:mt-5'>
                    {subtitle}
                  </p>
                  <p className='description center-y h5 -mx-2.5 mt-2 -mb-0.5 w-fit rounded-sm px-2.5 py-0.5 text-gray-light transition-colors duration-250 ease-in-out tablet:mt-4.5'>
                    <RelativeTime time={createdAt} />
                    {category && (
                      <>
                        <span className='text-gray-bold'>&nbsp;&middot;&nbsp;</span>
                        {category}
                      </>
                    )}
                    <span className='ml-4 tabular-nums'>
                      {viewsState.status === 'loading'
                        ? '-'
                        : `${(viewCount ?? 0).toLocaleString()} views`}
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          );
        }
      )}
    </ul>
  );
};
