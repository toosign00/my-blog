'use client';

import { Share } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

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
        className='theme-color-opacity-transition focus-ring center-y h3 w-fit cursor-pointer select-none gap-2 py-1.25 pr-2.25 text-gray-accent opacity-100 hover:opacity-70'
        onClick={handleShare}
        type='button'
      >
        {shareButtonLabel}
        <Share size={18} />
      </button>
    </footer>
  );
};
