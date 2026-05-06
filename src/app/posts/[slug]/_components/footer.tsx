'use client';

import { toast } from 'sonner';
import { ShareIcon } from '@/components/icons/ShareIcon';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';

import type { Post } from '@/types/content.types';
import { BackButton } from './back-button';

export const Footer = ({ slug, title, subtitle }: Post) => {
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

  const handleShare = async () => {
    const shareData = {
      title,
      text: subtitle,
      url: `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`,
    };

    const canShare =
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function' &&
      (typeof navigator.canShare !== 'function' || navigator.canShare(shareData));

    let shared = false;

    if (canShare) {
      try {
        await navigator.share(shareData);
        shared = true;
      } catch {
        shared = false;
      }
    }

    if (shared) {
      return;
    }

    const copied = await copyText(shareData.url);
    if (!copied) {
      window.open(shareData.url, '_blank', 'noopener,noreferrer');
      return;
    }

    toast.success('링크가 클립보드에 복사되었어요');
  };

  return (
    <footer className='row-between'>
      <BackButton />
      <button
        aria-label='Share this post'
        className='section-action-chip-strong w-fit cursor-pointer select-none'
        onClick={handleShare}
        type='button'
      >
        Share this post
        <ShareIcon size={18} />
      </button>
    </footer>
  );
};
