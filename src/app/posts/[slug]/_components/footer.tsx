'use client';

import { ContentFooter } from '@/components/ui/contentFooter';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';

import type { Post } from '@/types/post.types';
import { BackButton } from './back-button';

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
