'use client';

import { BackButton } from '@/components/features/content/BackButton';
import { ContentFooter } from '@/components/features/content/ContentFooter';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';

import type { Post } from '@/types/post.types';

export const Footer = ({ slug }: Post) => {
  const url = `${METADATA.SITE.URL}${ROUTES.POSTS}/${slug}`;

  return (
    <ContentFooter
      backButton={<BackButton />}
      shareButtonAriaLabel='Share this post'
      shareButtonLabel='Share this post'
      url={url}
    />
  );
};
