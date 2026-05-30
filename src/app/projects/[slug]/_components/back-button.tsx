'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      className='focus-ring center-y h3 w-fit cursor-pointer select-none gap-2 py-1.25 pr-2.25 text-gray-accent opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70'
      onClick={() => router.back()}
      type='button'
    >
      <ChevronLeftIcon className='h-4 w-4' />
      Back
    </button>
  );
};
