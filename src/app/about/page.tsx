import { CertificateSection } from '@/components/about/CertificateSection';
import { EducationSection } from '@/components/about/EducationSection';
import { HowIWork } from '@/components/about/HowIWork';
import { ProfileCard } from '@/components/about/ProfileCard';
import { SkillsSection } from '@/components/about/SkillsSection';
import { TimelineSection } from '@/components/about/TimelineSection';
import { ABOUT } from '@/constants/about.constants';

const AboutPage = () => {
  return (
    <div className='column pb-16.25'>
      <div className='column gap-15'>
        <ProfileCard />
        <HowIWork />
        <EducationSection />

        <SkillsSection />

        <TimelineSection heading='Work Experience' items={ABOUT.workExperience} />
        <TimelineSection heading='Achievements & Activities' items={ABOUT.achievements} />
        <CertificateSection items={ABOUT.certificates} />
      </div>
    </div>
  );
};

export default AboutPage;
