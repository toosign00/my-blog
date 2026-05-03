import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import { ROUTES } from '@/constants/menu.constants';
import { POST_CARD_INTERACTION_CLASS } from '@/constants/style.constants';
import type { Post } from '@/types/content.types';
import { RelativeTime } from './relativeTime';

type PostListProps = ComponentProps<'ul'> & {
  className?: string;
  posts: Post[];
};

export const PostList = ({ posts, className, ...props }: PostListProps) => {
  return (
    <ul className={twMerge('column list-none gap-7.5', className)} {...props}>
      {posts.map(({ _id, slug, title, subtitle, coverImage, category, createdAt }) => (
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
            <div className='relative aspect-[1.8/1] w-full overflow-hidden rounded-lg border border-border tablet:w-86.5'>
              <Image
                alt={`${title} Cover Image`}
                className='h-full w-full object-cover object-center'
                draggable={false}
                fill
                priority={false}
                quality={100}
                sizes='(max-width: 59.9375rem) 100vw, 21.625rem'
                src={coverImage}
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
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
