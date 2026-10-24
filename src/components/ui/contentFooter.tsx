'use client';

import { Share } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { ICON_SIZE } from '@/styles/tokens/icon';

type ContentFooterProps = {
  backButton: ReactNode;
  shareButtonLabel: string;
  shareButtonAriaLabel: string;
  url: string;
};

const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

export const ContentFooter = ({
  backButton,
  shareButtonLabel,
  shareButtonAriaLabel,
  url,
}: ContentFooterProps) => {
  const handleShare = async () => {
    const shareData = { url };

    const canShare =
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare(shareData));

    let shared = false;

    if (canShare) {
      try {
        await navigator.share(shareData);
        shared = true;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        shared = false;
      }
    }

    if (shared) {
      return;
    }

    const copied = await copyText(url);
    if (!copied) {
      toast.error('링크를 복사하지 못했어요');
      return;
    }

    toast.success('링크가 클립보드에 복사되었어요');
  };

  return (
    <footer className='row-between mt-14 flex-wrap gap-2'>
      {backButton}
      <button
        aria-label={shareButtonAriaLabel}
        className='focus-ring hover-fade center-y w-fit cursor-pointer select-none gap-2 py-1 pr-2 font-semibold text-body text-primary leading-none tracking-tight'
        onClick={handleShare}
        type='button'
      >
        {shareButtonLabel}
        <Share size={ICON_SIZE.md} />
      </button>
    </footer>
  );
};
