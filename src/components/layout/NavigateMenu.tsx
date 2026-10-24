'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU } from '@/constants/menu.constants';
import { twMerge } from '@/design-system/tw-merge';

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
                'h-10 w-full rounded-md text-tertiary transition-colors duration-fast ease-in-out hover:bg-fill-weak hover:text-primary',
                isActive && 'bg-fill-weak text-primary'
              )}
              key={menu.link}
            >
              <Link
                aria-current={isActive ? 'page' : undefined}
                className='center-y h-full w-full px-2.5 font-medium text-label'
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
