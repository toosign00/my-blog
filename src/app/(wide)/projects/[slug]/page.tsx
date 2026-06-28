import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CreativeWork, WithContext } from 'schema-dts';
import JsonLd from '@/components/JsonLd';
import { BackButton } from '@/components/ui/backButton';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectPageDataBySlug,
  getRecommendedProjects,
  ProjectNotFoundError,
} from '@/utils/project-util';
import { Footer } from './_components/footer';
import { ProjectHeader } from './_components/header';
import { Recommend } from './_components/recommend';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

const toAbsoluteUrl = (url: string) => {
  return url.startsWith('http') ? url : `${METADATA.SITE.URL}${url}`;
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;

  let MDXContent: Awaited<ReturnType<typeof getProjectPageDataBySlug>>['content'];
  let project: Awaited<ReturnType<typeof getProjectPageDataBySlug>>['project'];

  try {
    const pageData = await getProjectPageDataBySlug(slug);
    MDXContent = pageData.content;
    project = pageData.project;
  } catch (error) {
    if (!(error instanceof ProjectNotFoundError)) {
      throw error;
    }

    notFound();
  }

  const allProjects = await getAllProjects();
  const pathname = `${ROUTES.PROJECTS}/${slug}`;

  const creativeWorkSchema: WithContext<CreativeWork> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    dateCreated: project.createdAt,
    image: toAbsoluteUrl(project.coverImage),
    url: `${METADATA.SITE.URL}${pathname}`,
    author: {
      '@type': 'Person',
      name: METADATA.AUTHOR.NAME,
      url: METADATA.SITE.URL,
    },
    inLanguage: METADATA.SITE.LANGUAGE,
    keywords: [...project.tags, ...(project.capabilities ?? [])].join(', '),
  };

  return (
    <>
      <JsonLd data={creativeWorkSchema} />
      <BackButton />

      <article className='mt-4'>
        <ProjectHeader project={project} />

        <MDXContent />

        <Footer {...project} />
      </article>

      <Divider className='my-14' />
      <Recommend projects={getRecommendedProjects(allProjects, slug)} />
    </>
  );
};

export default ProjectPage;

export const generateMetadata = async ({ params }: ProjectPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const project = await getProjectBySlug(slug);

    return generatePageMetadata({
      title: project.title,
      description: project.description,
      path: `${ROUTES.PROJECTS}/${slug}`,
      image: toAbsoluteUrl(project.coverImage),
    });
  } catch (error) {
    if (!(error instanceof ProjectNotFoundError)) {
      throw error;
    }

    notFound();
  }
};

export const generateStaticParams = async () => {
  const allProjects = await getAllProjects();
  return allProjects.map((project) => ({ slug: project.slug }));
};
