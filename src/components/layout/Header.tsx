'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Network, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { ICON_SIZE } from '@/styles/tokens/icon';
import { ThemeToggle } from '../ThemeToggle';
import { NavigateMenu } from './NavigateMenu';

export const Header = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname change is the intended trigger
  useEffect(() => {
    setAccordionOpen(false);
  }, [pathname]);

  useEffect(() => {
    const tabletMediaQuery = window.matchMedia('(min-width: 60rem)');
    const closeMenu = (event: MediaQueryListEvent) => {
      if (event.matches) setAccordionOpen(false);
    };

    tabletMediaQuery.addEventListener('change', closeMenu);
    return () => tabletMediaQuery.removeEventListener('change', closeMenu);
  }, []);

  const overlayClassName =
    'fixed inset-0 z-overlay bg-scrim backdrop-blur-md transition-opacity duration-slow';

  return (
    <>
      <Accordion.Root collapsible type='single' value={accordionOpen ? 'menu' : ''}>
        <button
          aria-label='Close menu'
          className={
            accordionOpen
              ? `${overlayClassName} opacity-100`
              : `${overlayClassName} pointer-events-none opacity-0`
          }
          onClick={() => setAccordionOpen(false)}
          type='button'
        />

        <header className='fixed top-0 left-0 z-header flex h-header w-full items-center border-b border-default bg-canvas px-inline tablet:hidden'>
          <div className='row-between mx-auto w-full max-w-app'>
            <Link aria-label={METADATA.SITE.NAME} href={ROUTES.HOME}>
              <Image
                alt={METADATA.SITE.NAME}
                className='h-auto w-10 shrink-0 border-0 rounded-none'
                height={32}
                src='/favicon.svg'
                width={112}
              />
            </Link>

            <Accordion.Item
              aria-label='Menu Accordion'
              className='mt-px overflow-hidden'
              id='menu-accordion-item'
              value='menu'
            >
              <button
                aria-controls='menu-accordion-content'
                aria-expanded={accordionOpen}
                className='ui-button px-4 font-medium text-caption text-tertiary hover:bg-fill-weak'
                onClick={() => setAccordionOpen((open) => !open)}
                type='button'
              >
                {accordionOpen ? '-' : 'menu'}
              </button>
              <Accordion.Content
                aria-labelledby='menu-accordion-item'
                className='fixed top-header left-0 w-full overflow-hidden border-b border-default bg-canvas px-inline'
                id='menu-accordion-content'
              >
                <div className='column mx-auto w-full max-w-app pt-6 pb-5'>
                  <div className='column w-full max-w-32 gap-8'>
                    <NavigateMenu />
                    <ThemeToggle />
                  </div>
                  <p className='mt-11 w-full text-center font-medium text-micro text-muted'>
                    © 2025 - <span suppressHydrationWarning>{new Date().getFullYear()}</span>
                    {'. '}
                    {METADATA.SITE.NAME} All rights reserved.
                  </p>
                  <div className='row-between mx-auto mt-4 max-w-32 gap-2'>
                    <a
                      aria-label='RSS feed'
                      className='hover-fade flex items-center gap-1 font-medium text-micro text-muted no-underline'
                      href={ROUTES.RSS}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <Rss size={ICON_SIZE.xs} />
                      RSS
                    </a>
                    <a
                      aria-label='XML sitemap'
                      className='hover-fade flex items-center gap-1 font-medium text-micro text-muted no-underline'
                      href={ROUTES.SITEMAP}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <Network size={ICON_SIZE.xs} />
                      Sitemap
                    </a>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </div>
        </header>
      </Accordion.Root>

      <div className='block pt-header tablet:hidden'>
        <Divider />
      </div>
    </>
  );
};
