import { ABOUT } from "@constants/about.constants";
import { Section } from "./Section";

export const EducationList = () => (
  <Section title="Education">
    {ABOUT.education.map(({ school, major, period }) => (
      <div className="row-between items-start gap-4" key={school}>
        <div className="column gap-0.5">
          <p className="h5 font-semibold text-[var(--color-gray-accent)]">
            {school}
          </p>
          <p className="h6 text-[var(--color-gray-mid)]">{major}</p>
        </div>
        <p className="h6 shrink-0 text-[var(--color-gray-light)]">{period}</p>
      </div>
    ))}
  </Section>
);
