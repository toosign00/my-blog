import type { Metadata } from 'next';
import type { Person, WithContext } from 'schema-dts';
import { CertificateSection } from '@/components/features/about/CertificateSection';
import { EducationSection } from '@/components/features/about/EducationSection';
import { HowIWork } from '@/components/features/about/HowIWork';
import { ProfileCard } from '@/components/features/about/ProfileCard';
import { SkillsSection } from '@/components/features/about/SkillsSection';
import { TimelineSection } from '@/components/features/about/TimelineSection';
import JsonLd from '@/components/JsonLd';
import { ABOUT } from '@/constants/about.constants';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';

const personSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: METADATA.AUTHOR.NAME,
  email: METADATA.AUTHOR.EMAIL,
  url: METADATA.SITE.URL,
  image: `${METADATA.SITE.URL}${METADATA.AUTHOR.PROFILE_IMAGE}`,
  jobTitle: 'QA Engineer',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ansan',
    addressCountry: 'KR',
  },
  alumniOf: ABOUT.education.map((edu) => ({
    '@type': 'EducationalOrganization',
    name: edu.school,
  })),
  knowsAbout: ABOUT.skills.flatMap((group) =>
    group.items.map((item) => ('label' in item ? item.label : '')).filter(Boolean)
  ),
  worksFor: {
    '@type': 'Organization',
    name: ABOUT.workExperience[0]?.title,
    url: ABOUT.workExperience[0]?.href,
  },
};

const AboutPage = () => {
  return (
    <>
      <JsonLd data={personSchema} />
      <div className='column pb-16'>
        <div className='column gap-16'>
          <ProfileCard />
          <HowIWork />
          <TimelineSection heading='Work Experience' items={ABOUT.workExperience} />
          <SkillsSection />
          <EducationSection />
          <TimelineSection heading='Achievements & Activities' items={ABOUT.achievements} />
          <CertificateSection items={ABOUT.certificates} />
        </div>
      </div>
    </>
  );
};

export default AboutPage;

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    title: 'About',
    path: ROUTES.ABOUT,
  });
