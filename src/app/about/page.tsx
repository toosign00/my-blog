import { CertificateSection } from "@/app/about/_components/CertificateSection";
import { EducationSection } from "@/app/about/_components/EducationSection";
import { HowIWork } from "@/app/about/_components/HowIWork";
import { ProfileCard } from "@/app/about/_components/ProfileCard";
import { SkillsSection } from "@/app/about/_components/SkillsSection";
import { TimelineSection } from "@/app/about/_components/TimelineSection";
import { ABOUT } from "@/constants/about.constants";

const AboutPage = () => {
  return (
    <div className="column pb-16.25">
      <div className="column gap-15">
        <ProfileCard />
        <HowIWork />
        <EducationSection />

        <SkillsSection />

        <TimelineSection
          heading="Work Experience"
          items={ABOUT.workExperience}
        />
        <TimelineSection
          heading="Achievements & Activities"
          items={ABOUT.achievements}
        />
        <CertificateSection items={ABOUT.certificates} />
      </div>
    </div>
  );
};

export default AboutPage;
