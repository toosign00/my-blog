import type { ComponentProps } from 'react';
import type { Project } from '@/types/project.types';
import { twMerge } from '@/utils/tw-merge-util';
import { ProjectCard } from './ProjectCard';

type ProjectListProps = ComponentProps<'ul'> & {
  projects: Project[];
  hideAward?: boolean;
};

export const ProjectList = ({
  projects,
  className,
  hideAward = false,
  ...props
}: ProjectListProps) => {
  return (
    <ul
      className={twMerge(
        'grid grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-3',
        className
      )}
      {...props}
    >
      {projects.map((project, index) => (
        <ProjectCard
          hideAward={hideAward}
          key={project._id}
          priority={index === 0}
          project={project}
        />
      ))}
    </ul>
  );
};
