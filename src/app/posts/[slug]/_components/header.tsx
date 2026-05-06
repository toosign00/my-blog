import Image from 'next/image';
import Link from 'next/link';
import { RelativeTime } from '@/components/ui/relativeTime';
import { ROUTES } from '@/constants/menu.constants';
import type { Post } from '@/types/content.types';
import { slugify } from '@/utils/text-util';

export const Header = ({ coverImage, title, subtitle, createdAt, category, tags }: Post) => {
  return (
    <header className='mt-5 mb-14'>
      <div className='center relative aspect-[1.8/1] w-full select-none overflow-hidden rounded-lg border border-border'>
        <Image
          alt={`${title} Cover Image`}
          className='h-full w-full object-cover object-center'
          draggable={false}
          fill
          priority
          quality={100}
          sizes='(max-width: 60rem) 100vw, 47.375rem'
          src={coverImage}
        />
      </div>

      <h1 className='post-title mt-4.25 break-keep p-0 text-gray-accent'>{title}</h1>

      <h2 className='post-subtitle mt-2 p-0 text-gray-bold'>{subtitle}</h2>

      <p className='center-y h5 mt-4.5 break-keep text-gray-light'>
        <RelativeTime time={createdAt} />
        {category && (
          <>
            <span className='text-gray-bold'>&nbsp;&middot;&nbsp;</span>
            <Link
              className='no-underline opacity-100 transition-opacity duration-200 ease-in-out hover:opacity-70'
              href={`/categories/${slugify(category)}`}
            >
              {category}
            </Link>
          </>
        )}
      </p>

      {tags && tags?.length > 0 && (
        <ul className='center-y mt-6 w-full flex-wrap gap-2'>
          {tags.map((tag) => (
            <li
              className='ui-chip center rounded-sm px-1.5 py-0.5 font-medium text-gray-mid text-xs'
              key={tag}
            >
              <Link href={`${ROUTES.TAGS}/${slugify(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};
