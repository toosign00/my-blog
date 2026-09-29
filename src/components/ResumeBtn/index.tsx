'use client';

import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

type ResumeDownloadButtonProps = {
  fileUrl: string;
  children: React.ReactNode;
} & Omit<ComponentProps<'button'>, 'onClick' | 'type'>;

export const ResumeDownloadButton = ({
  fileUrl,
  children,
  className,
  style,
  ...props
}: ResumeDownloadButtonProps) => {
  const handleClick = () => {
    try {
      const popup = window.open(fileUrl, '_blank');
      if (!popup) {
        throw new Error('Failed to open download link');
      }
    } catch {
      toast.error('다운로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={twMerge('relative', className)}
      style={style}
      {...props}
    >
      <div>{children}</div>
    </button>
  );
};
