import dayjs from 'dayjs';
import { Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { ROUTES } from '@/constants/menu.constants';
import { ICON_SIZE } from '@/design-system/tokens/icon';
import { twMerge } from '@/design-system/tw-merge';
import type { Project } from '@/types/project.types';

type ProjectCardProps = ComponentProps<'li'> & {
  project: Project;
  hideAward?: boolean;
  priority?: boolean;
};

export const ProjectCard = ({
  project,
  className,
  hideAward = false,
  priority = false,
  ...props
}: ProjectCardProps) => {
  const { title, description, coverImage, coverImageBlur, tags, slug } = project;
  const period = `${dayjs(project.createdAt).format('YYYY. MM')} - ${
    project.projectDue ? dayjs(project.projectDue).format('YYYY. MM') : 'Present'
  }`;

  return (
    <li className={twMerge('flex w-full flex-col', className)} {...props}>
      <Link
        aria-label={`Read project: ${title}`}
        className={twMerge(
          'flex w-full cursor-pointer flex-col',
          'hover:[&_.hoverable-surface]:bg-muted',
          'active:[&_.hoverable-surface]:bg-pressed'
        )}
        href={`${ROUTES.PROJECTS}/${slug}`}
      >
        <div className='relative aspect-cover w-full overflow-hidden rounded-lg border border-default'>
          {!hideAward && project.awards && (
            <span className='center-y absolute top-3 right-3 left-3 z-raised w-fit gap-1.5 rounded-md bg-surface px-3 py-2 text-primary text-caption-sm backdrop-blur-sm'>
              <Award aria-hidden size={ICON_SIZE.xs} />
              <span className='truncate'>{project.awards}</span>
            </span>
          )}
          <Image
            alt={`${title} Cover Image`}
            className='h-full w-full object-cover object-center'
            draggable={false}
            fill
            priority={priority}
            quality={100}
            sizes='(max-width: 59.9375rem) 100vw, (max-width: 79.9375rem) calc(50vw - 8rem), 33vw'
            src={coverImage}
            {...(coverImageBlur && { placeholder: 'blur', blurDataURL: coverImageBlur })}
          />
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <span
              className='hoverable-surface rounded-full border border-default px-2 py-1 font-medium text-tertiary text-caption-sm transition-colors duration-base ease-in-out'
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className='hoverable-surface text-body font-medium mt-4 -mb-0.5 line-clamp-2 flex overflow-hidden text-ellipsis rounded-sm px-2.5 py-0.5 transition-colors duration-base ease-in-out'>
          {title}
        </h2>

        <p className='hoverable-surface text-caption font-medium mt-3 -mb-0.5 line-clamp-2 rounded-sm px-2.5 py-0.5 text-tertiary transition-colors duration-base ease-in-out'>
          {description}
        </p>

        <p className='description hoverable-surface text-caption font-medium mt-4 -mb-0.5 w-fit rounded-sm px-2.5 py-0.5 text-muted transition-colors duration-base ease-in-out'>
          {period}
        </p>
      </Link>
    </li>
  );
};
