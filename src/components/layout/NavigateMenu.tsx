'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { MENU } from '@/constants/menu.constants';

export const NavigateMenu = () => {
  const pathname = usePathname();
  const normalizedPathname = pathname || '/';

  return (
    <nav aria-label='Main navigation'>
      <ul className='column w-full gap-1.5'>
        {MENU.map((menu) => {
          const isActive =
            menu.link === '/'
              ? normalizedPathname === '/'
              : normalizedPathname === menu.link || normalizedPathname.startsWith(`${menu.link}/`);
          return (
            <li
              className={twMerge(
                'theme-color-transition h-10 w-full rounded-md text-gray-mid hover:bg-background02 hover:text-gray-accent',
                isActive && 'bg-background02 text-gray-accent'
              )}
              key={menu.link}
            >
              <Link
                aria-current={isActive ? 'page' : undefined}
                className='center-y a h-full w-full px-2.5'
                href={menu.link}
              >
                {menu.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
