import dayjs from 'dayjs';
import { ExternalLink, FileText } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { ICON_SIZE } from '@/constants/style.constants';
import type { Project } from '@/types/project.types';

type ProjectHeaderProps = {
  project: Project;
};

type ProjectMetaRowProps = {
  label: string;
  children: ReactNode;
};

type ProjectTagListProps = {
  items: string[];
};

type ProjectActionLinksProps = Pick<Project, 'repository' | 'docs' | 'url'>;

const ProjectMetaRow = ({ label, children }: ProjectMetaRowProps) => (
  <div className='mt-4 flex items-start gap-4'>
    <span className='shrink-0 py-1 font-bold text-primary text-label'>{label}</span>
    {children}
  </div>
);

const ProjectTagList = ({ items }: ProjectTagListProps) => (
  <div className='flex flex-wrap gap-2'>
    {items.map((item) => (
      <span
        className='rounded-full border border-default px-3 py-1 font-medium text-tertiary text-label'
        key={item}
      >
        {item}
      </span>
    ))}
  </div>
);

const ProjectActionLinks = ({ repository, docs, url }: ProjectActionLinksProps) => {
  if (!repository && !docs && !url) {
    return null;
  }

  return (
    <div className='mt-8 flex flex-wrap gap-2'>
      {repository && (
        <a
          className='w-full tablet:w-auto min-w-36 focus-ring center text-caption font-medium gap-2 rounded-md border border-default px-4 py-2 text-primary no-underline transition-colors duration-fast ease-in-out hover:bg-muted'
          href={repository}
          rel='noopener noreferrer'
          target='_blank'
        >
          <GithubIcon size={ICON_SIZE.sm} />
          Repository
        </a>
      )}

      {docs && (
        <a
          className='w-full tablet:w-auto min-w-36 focus-ring center text-caption font-medium gap-2 rounded-md border border-default px-4 py-2 text-primary no-underline transition-colors duration-fast ease-in-out hover:bg-muted'
          href={docs}
          rel='noopener noreferrer'
          target='_blank'
        >
          <FileText size={ICON_SIZE.sm} />
          문서 보기
        </a>
      )}

      {url && (
        <a
          className='w-full tablet:w-auto min-w-36 focus-ring center text-caption font-medium gap-2 rounded-md border border-default px-4 py-2 text-primary no-underline transition-colors duration-fast ease-in-out hover:bg-muted'
          href={url}
          rel='noopener noreferrer'
          target='_blank'
        >
          <ExternalLink size={ICON_SIZE.sm} />
          배포 사이트
        </a>
      )}
    </div>
  );
};

export const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  const period = `${dayjs(project.createdAt).format('YYYY. MM')} - ${
    project.projectDue ? dayjs(project.projectDue).format('YYYY. MM') : 'Present'
  }`;
  const desktopImage = project.heroImage ?? project.coverImage;
  const desktopImageBlur = project.heroImageBlur ?? project.coverImageBlur;

  return (
    <header className='mb-8'>
      <div className='relative mb-6 aspect-cover w-full overflow-hidden rounded-lg border border-default tablet:aspect-hero'>
        <Image
          alt={project.title}
          className='h-full w-full object-cover object-center tablet:hidden'
          fill
          priority
          quality={100}
          sizes='(max-width: 59.9375rem) 100vw, 0px'
          src={project.coverImage}
          {...(project.coverImageBlur && {
            placeholder: 'blur',
            blurDataURL: project.coverImageBlur,
          })}
        />
        <Image
          alt={project.title}
          className='hidden h-full w-full object-cover object-center tablet:block'
          fill
          priority
          quality={100}
          sizes='(max-width: 59.9375rem) 0px, (max-width: 79.9375rem) calc(100vw - var(--spacing-sidebar)), 1200px'
          src={desktopImage}
          {...(desktopImageBlur && {
            placeholder: 'blur',
            blurDataURL: desktopImageBlur,
          })}
        />
      </div>

      <h1 className='mb-2 font-bold text-title-lg text-primary'>{project.title}</h1>

      <ProjectMetaRow label='수행기간'>
        <div className='py-1 font-medium text-tertiary text-label'>{period}</div>
      </ProjectMetaRow>

      <ProjectMetaRow label='프로젝트 분류'>
        <ProjectTagList items={project.tags} />
      </ProjectMetaRow>

      {project.capabilities && (
        <ProjectMetaRow label='역량'>
          <ProjectTagList items={project.capabilities} />
        </ProjectMetaRow>
      )}

      {project.awards && (
        <ProjectMetaRow label='수상내역'>
          <div className='rounded-full border border-default px-3 py-1 font-medium text-tertiary text-label'>
            {project.awards}
          </div>
        </ProjectMetaRow>
      )}

      <ProjectActionLinks repository={project.repository} docs={project.docs} url={project.url} />
    </header>
  );
};
