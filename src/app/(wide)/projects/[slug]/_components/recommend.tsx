import { ProjectList } from '@/components/project/ProjectList';
import type { Project } from '@/types/project.types';

type RecommendProps = {
  projects: Project[];
  sourceSlug: string;
};

export const Recommend = ({ projects, sourceSlug }: RecommendProps) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className='section-heading mb-7.5'>More Projects</h2>
      <ProjectList hideAward projects={projects} recommendationSourceSlug={sourceSlug} />
    </section>
  );
};
