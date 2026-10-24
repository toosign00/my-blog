import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { ROUTES } from '@/constants/menu.constants';
import { POST_CARD_INTERACTION_CLASS } from '@/constants/style.constants';
import { twMerge } from '@/design-system/tw-merge';
import type { Post } from '@/types/post.types';
import { PostViews } from './postViews';
import { PostViewsProvider } from './postViewsProvider';
import { RelativeTime } from './relativeTime';

type PostListProps = ComponentProps<'ul'> & {
  className?: string;
  posts: Post[];
};

export const PostList = ({ posts, className, ...props }: PostListProps) => {
  return (
    <PostViewsProvider slugs={posts.map((post) => post.slug)}>
      <ul className={twMerge('column list-none gap-8', className)} {...props}>
        {posts.map(
          (
            { _id, slug, title, subtitle, coverImage, coverImageBlur, category, createdAt },
            index
          ) => (
            <li key={_id}>
              <Link
                aria-label={`Read post: ${title}`}
                className={twMerge(
                  'flex cursor-pointer flex-col gap-4 tablet:flex-row tablet:gap-9',
                  POST_CARD_INTERACTION_CLASS,
                  'hover:[&_.subtitle]:bg-muted active:[&_.subtitle]:bg-pressed'
                )}
                href={`${ROUTES.POSTS}/${slug}`}
              >
                <div className='relative aspect-cover w-full shrink-0 overflow-hidden rounded-lg border border-default tablet:w-post-thumb'>
                  <Image
                    alt={`${title} Cover Image`}
                    className='h-full w-full object-cover object-center'
                    draggable={false}
                    fill
                    priority={index === 0}
                    quality={100}
                    sizes='(max-width: 59.9375rem) 100vw, 21.625rem'
                    src={coverImage}
                    {...(coverImageBlur && { placeholder: 'blur', blurDataURL: coverImageBlur })}
                  />
                </div>

                <div className='column flex-1'>
                  <h2 className='title -mx-2.5 -mb-0.5 rounded-sm px-2.5 py-0.5 font-medium text-body text-primary transition-colors duration-base ease-in-out'>
                    {title}
                  </h2>
                  <p className='subtitle -mx-2.5 mt-3 -mb-0.5 rounded-sm px-2.5 py-0.5 font-medium text-caption text-tertiary transition-colors duration-base ease-in-out tablet:mt-5'>
                    {subtitle}
                  </p>
                  <p className='description center-y -mx-2.5 mt-2 -mb-0.5 w-fit rounded-sm px-2.5 py-0.5 font-medium text-caption-sm text-muted transition-colors duration-base ease-in-out tablet:mt-4'>
                    <RelativeTime time={createdAt} />
                    {category && (
                      <>
                        <span className='text-secondary'>&nbsp;&middot;&nbsp;</span>
                        {category}
                      </>
                    )}
                    <PostViews slug={slug} />
                  </p>
                </div>
              </Link>
            </li>
          )
        )}
      </ul>
    </PostViewsProvider>
  );
};
