import { Network, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { ICON_SIZE } from '@/design-system/tokens/icon';
import { ThemeToggle } from '../ThemeToggle';
import { NavigateMenu } from './NavigateMenu';

export const Sidebar = () => {
  return (
    <aside
      aria-label='Sidebar navigation'
      className='fixed top-0 left-0 hidden h-dvh w-sidebar flex-col justify-between border-r border-default bg-canvas px-10 py-11 tablet:flex'
    >
      <div className='column w-full gap-6'>
        <Link aria-label={METADATA.SITE.NAME} className='px-2.5 py-3' href={ROUTES.HOME}>
          <Image
            alt={METADATA.SITE.NAME}
            className='h-auto w-10 shrink-0 border-0 rounded-none'
            height={32}
            src='/favicon.svg'
            width={112}
          />
        </Link>
        <Divider />
        <NavigateMenu />
      </div>

      <div className='column w-full gap-5'>
        <ThemeToggle />
        <div className='column w-full gap-1.5'>
          <p className='w-full text-center font-medium text-micro text-muted'>
            © 2025 - <span suppressHydrationWarning>{new Date().getFullYear()}</span>
            {'. '}
            {METADATA.SITE.NAME} All rights reserved.
          </p>
          <div className='row-between'>
            <a
              aria-label='RSS feed'
              className='hover-fade flex items-center gap-1 font-medium text-micro text-muted no-underline'
              href={ROUTES.RSS}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Rss size={ICON_SIZE.sm} />
              RSS
            </a>
            <a
              aria-label='XML sitemap'
              className='hover-fade flex items-center gap-1 font-medium text-micro text-muted no-underline'
              href={ROUTES.SITEMAP}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Network size={ICON_SIZE.sm} />
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
