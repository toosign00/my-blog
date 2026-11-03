'use client';

import { BackButton } from '@/components/features/content/BackButton';
import { ContentFooter } from '@/components/features/content/ContentFooter';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import type { Project } from '@/types/project.types';

export const Footer = ({ slug }: Project) => {
  const url = `${METADATA.SITE.URL}${ROUTES.PROJECTS}/${slug}`;

  return (
    <ContentFooter
      backButton={<BackButton />}
      shareButtonAriaLabel='Share this project'
      shareButtonLabel='Share this project'
      url={url}
    />
  );
};
