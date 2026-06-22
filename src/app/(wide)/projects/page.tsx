import type { Metadata } from 'next';
import { ProjectSection } from '@/components/project/ProjectSection';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import { getAllProjects } from '@/utils/project-util';

interface ProjectsPageProps {
  searchParams: Promise<{
    tag?: string;
    sort?: string;
    q?: string;
  }>;
}

const ProjectsPage = async ({ searchParams }: ProjectsPageProps) => {
  const allProjects = await getAllProjects();
  const resolvedSearchParams = await searchParams;

  return (
    <div className='column pb-16.25'>
      <h1 className='section-heading mb-7.5'>Projects ({allProjects.length})</h1>
      <ProjectSection
        initialQuery={resolvedSearchParams.q}
        initialSort={resolvedSearchParams.sort}
        initialTag={resolvedSearchParams.tag}
        projects={allProjects}
      />
    </div>
  );
};

export default ProjectsPage;

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({
    title: 'Projects',
    description: METADATA.PAGES.PROJECTS,
    path: ROUTES.PROJECTS,
  });
};
