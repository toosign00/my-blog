import { Network, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { ThemeToggle } from '../ThemeToggle';
import { NavigateMenu } from './NavigateMenu';

export const Sidebar = () => {
  return (
    <aside
      aria-label='Sidebar navigation'
      className='theme-color-transition fixed top-0 left-0 hidden h-dvh w-sidebar flex-col justify-between border-r border-border bg-background px-10 py-11 tablet:flex'
    >
      <div className='column w-full gap-6'>
        <Link aria-label={METADATA.SITE.NAME} className='px-2.5 py-3' href={ROUTES.HOME}>
          <Image
            alt={METADATA.SITE.NAME}
            className='h-3 w-10 shrink-0 border-0 rounded-none'
            height={12}
            src='/favicon.svg'
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
            Copyright © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{' '}
            {METADATA.AUTHOR.NAME}, All rights reserved.
          </p>
          <div className='row-between'>
            <a
              aria-label='RSS feed'
              className='theme-color-opacity-transition flex h6 items-center gap-1 text-license no-underline opacity-100 hover:opacity-70'
              href={ROUTES.RSS}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Rss size={16} />
              RSS
            </a>
            <a
              aria-label='XML sitemap'
              className='theme-color-opacity-transition flex h6 items-center gap-1 text-license no-underline opacity-100 hover:opacity-70'
              href={ROUTES.SITEMAP}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Network size={16} />
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
