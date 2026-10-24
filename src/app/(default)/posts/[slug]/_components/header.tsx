import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { RelativeTime } from '@/components/ui/relativeTime';
import { ROUTES } from '@/constants/menu.constants';
import type { Post } from '@/types/post.types';
import { slugify } from '@/utils/text-util';

interface HeaderProps extends Post {
  viewCounter: ReactNode;
}

export const Header = ({
  coverImage,
  coverImageBlur,
  title,
  subtitle,
  createdAt,
  category,
  tags,
  viewCounter,
}: HeaderProps) => {
  return (
    <header className='mt-5 mb-14'>
      <div className='center relative aspect-cover w-full select-none overflow-hidden rounded-lg border border-default'>
        <Image
          alt={`${title} Cover Image`}
          className='h-full w-full object-cover object-center'
          draggable={false}
          fill
          priority
          quality={100}
          sizes='(max-width: 60rem) 100vw, 47.375rem'
          src={coverImage}
          {...(coverImageBlur && { placeholder: 'blur', blurDataURL: coverImageBlur })}
        />
      </div>

      <h1 className='text-title font-semibold mt-4 break-keep p-0 text-primary'>{title}</h1>

      <h2 className='text-body font-medium mt-2 p-0 text-secondary'>{subtitle}</h2>

      <p className='center-y text-caption-sm font-medium mt-4 break-keep text-muted'>
        <RelativeTime time={createdAt} />
        {category && (
          <>
            <span className='text-secondary'>&nbsp;&middot;&nbsp;</span>
            <Link
              className='focus-ring text-secondary no-underline hover-fade'
              href={`/categories/${slugify(category)}`}
            >
              {category}
            </Link>
          </>
        )}
        <span className='ml-auto mr-2'>{viewCounter}</span>
      </p>

      {tags && tags?.length > 0 && (
        <ul className='center-y mt-6 w-full flex-wrap gap-2'>
          {tags.map((tag) => (
            <li
              className='ui-chip center rounded-sm px-1.5 py-0.5 text-tertiary text-caption-sm'
              key={tag}
            >
              <Link
                className='focus-ring font-medium no-underline hover-fade'
                href={`${ROUTES.TAGS}/${slugify(tag)}`}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};
