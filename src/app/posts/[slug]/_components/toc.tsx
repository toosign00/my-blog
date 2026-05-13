'use client';

import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/types/content.types';

interface TocProps {
  items: TocItem[];
}

export const Toc = ({ items }: TocProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    for (const el of headingElements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label='Table of contents'
      className='subtle-scrollbar fixed top-36.5 hidden max-h-[calc(100vh-12rem)] w-44 overflow-y-auto desktop:block'
      style={{
        left: 'calc(50% + var(--spacing-app) / 2 + 2rem)',
      }}
    >
      <p className='mb-3 text-xs font-semibold tracking-wide text-gray-light uppercase'>
        On this page
      </p>
      <ul className='flex flex-col gap-1'>
        {items.map(({ id, text, level }) => (
          <li key={id}>
            <a
              className={`block truncate text-xs leading-relaxed transition-colors duration-150 ease-in-out hover:text-gray-accent ${
                level === 3 ? 'pl-3' : ''
              } ${activeId === id ? 'font-medium text-gray-accent' : 'text-gray-light'}`}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(id);
                if (!el) return;
                const top = el.getBoundingClientRect().top + window.scrollY - 10;
                window.scrollTo({ top, behavior: 'smooth' });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
