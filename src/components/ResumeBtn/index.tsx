'use client';

import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ComponentProps, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const popup = window.open(fileUrl, '_blank');
      if (!popup) {
        throw new Error('Failed to open download link');
      }
    } catch {
      toast.error('다운로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type='button'
      onClick={() => {
        void handleClick();
      }}
      className={twMerge('relative', className)}
      style={style}
      {...props}
    >
      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 flex items-center justify-center gap-2'
          >
            <Loader2 className='w-5 h-5 animate-spin' />
            <span className='font-medium text-sm'>다운로드 중...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
