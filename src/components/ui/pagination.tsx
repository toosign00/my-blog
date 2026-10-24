'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ICON_SIZE } from '@/design-system/tokens/icon';

const TRAILING_SLASH = /\/$/;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  const generatePageRange = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 2) {
      end = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(totalPages - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const buildPageHref = (page: number) => {
    const path = basePath.replace(TRAILING_SLASH, '');
    return page === 1 ? path : `${path}/p/${page}`;
  };

  const pageList = generatePageRange();

  return (
    <nav aria-label='Pagination navigation' className='center gap-3 py-11'>
      {currentPage > 1 && (
        <Link
          aria-label='Go to previous page'
          className='center h-8 w-8 cursor-pointer rounded-full border border-default bg-surface text-label text-primary transition-colors duration-fast ease-in-out hover:bg-fill-weak'
          href={buildPageHref(currentPage - 1)}
        >
          <ChevronLeft size={ICON_SIZE.sm} />
        </Link>
      )}

      {pageList.map((pageNumber) =>
        pageNumber === currentPage ? (
          <span
            aria-current='page'
            className='center h-8 w-8 rounded-full border border-fill bg-inverse text-inverse text-label'
            key={pageNumber}
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            aria-label={`Go to page ${pageNumber}`}
            className='center h-8 w-8 cursor-pointer rounded-full border border-default bg-surface text-label text-primary transition-colors duration-fast ease-in-out hover:bg-fill-weak'
            href={buildPageHref(pageNumber)}
            key={pageNumber}
          >
            {pageNumber}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          aria-label='Go to next page'
          className='center h-8 w-8 cursor-pointer rounded-full border border-default bg-surface text-label text-primary transition-colors duration-fast ease-in-out hover:bg-fill-weak'
          href={buildPageHref(currentPage + 1)}
        >
          <ChevronRight size={ICON_SIZE.sm} />
        </Link>
      )}
    </nav>
  );
};
