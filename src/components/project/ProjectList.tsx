import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import type { Project } from '@/types/project.types';
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
