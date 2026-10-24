import { ProjectList } from '@/components/features/project/ProjectList';
import type { Project } from '@/types/project.types';

type RecommendProps = {
  projects: Project[];
};

export const Recommend = ({ projects }: RecommendProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className='section-heading mb-8'>More Projects</h2>
      <ProjectList hideAward projects={projects} />
    </section>
  );
};
