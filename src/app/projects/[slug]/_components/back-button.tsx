'use client';

import Link from 'next/link';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';
import { ROUTES } from '@/constants/menu.constants';

export const BackButton = () => {
  return (
    <Link
      className='focus-ring center-y h3 w-fit cursor-pointer select-none gap-2 py-1.25 pr-2.25 text-gray-accent opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70'
      href={ROUTES.PROJECTS}
    >
      <ChevronLeftIcon className='h-4 w-4' />
      Back
    </Link>
  );
};
