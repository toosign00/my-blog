'use client';

import { ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ICON_SIZE } from '@/styles/tokens/icon';

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
    <Button aria-label='Go back' onClick={handleBack} variant='ghost'>
      {content}
    </Button>
  );
};
