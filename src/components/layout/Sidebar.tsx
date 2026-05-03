import { Network, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { ThemeToggle } from '../ThemeToggle';
import { NavigateMenu } from './NavigateMenu';

const CURRENT_YEAR = new Date().getFullYear();

export const Sidebar = () => {
  return (
    <aside
      aria-label='Sidebar navigation'
      className='fixed top-0 left-0 tablet:flex hidden h-dvh w-sidebar flex-col justify-between px-10 py-11'
    >
      <div className='column w-full gap-6'>
        <Link aria-label={METADATA.SITE.NAME} className='px-2.5 py-3' href={ROUTES.HOME}>
          <Image
            alt={METADATA.SITE.NAME}
            className='h-3 w-10 shrink-0 border-0 rounded-none'
            height={12}
            src='/static/favicon.svg'
            width={40}
          />
        </Link>
        <Divider />
        <NavigateMenu />
      </div>

      <div className='column w-full gap-5'>
        <ThemeToggle />
        <div className='column w-full gap-1.5'>
          <p className='h6 w-full text-license'>
            Copyright © {CURRENT_YEAR} {METADATA.AUTHOR.NAME}, All rights reserved.
          </p>
          <div className='row-between'>
            <Link
              aria-label='RSS feed'
              className='flex h6 items-center gap-1 text-license no-underline opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70'
              href={ROUTES.RSS}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Rss size={16} />
              RSS
            </Link>
            <Link
              aria-label='XML sitemap'
              className='flex h6 items-center gap-1 text-license no-underline opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70'
              href={ROUTES.SITEMAP}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Network size={16} />
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
