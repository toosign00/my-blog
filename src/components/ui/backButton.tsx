'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { ICON_SIZE } from '@/styles/tokens/icon';

const BACK_BUTTON_CLASS =
  'focus-ring hover-fade center-y w-fit cursor-pointer select-none gap-2 py-1 pr-2 font-semibold text-body text-primary leading-none tracking-tight';

type BackButtonProps = {
  iconSize?: number;
  label?: string;
};

export const BackButton = ({ iconSize = ICON_SIZE.md, label = 'Back' }: BackButtonProps) => {
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
