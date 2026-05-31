'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const BACK_BUTTON_CLASS =
  'focus-ring center-y h3 w-fit cursor-pointer select-none gap-2 py-1.25 pr-2.25 text-gray-accent opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70';

type BackButtonProps = {
  iconSize?: number;
  label?: string;
};

export const BackButton = ({ iconSize = 18, label = 'Back' }: BackButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const path: string[] = pathname.split('/').filter(Boolean);
    const parent = path.length > 1 ? `/${path.slice(0, -1).join('/')}` : '/';
    router.replace(parent);
  };

  const content = (
    <>
      <ChevronLeft size={iconSize} />
      <span>{label}</span>
    </>
  );

  return (
    <button aria-label='Go back' className={BACK_BUTTON_CLASS} onClick={handleBack} type='button'>
      {content}
    </button>
  );
};
