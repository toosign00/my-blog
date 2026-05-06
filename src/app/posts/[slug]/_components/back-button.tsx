'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon';

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (pathname === '/') {
      router.back();
      return;
    }

    const path: string[] = pathname.split('/').filter(Boolean);
    if (path.length > 1) {
      const parent = `/${path.slice(0, -1).join('/')}`;
      router.replace(parent);
    } else {
      router.replace('/');
    }
  };

  return (
    <button
      aria-label='Go back'
      className='section-action-chip-strong w-fit cursor-pointer select-none'
      onClick={handleBack}
      type='button'
    >
      <ChevronLeftIcon size={18} />
      <span>Back</span>
    </button>
  );
};
