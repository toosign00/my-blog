import { ABOUT } from "@constants/about.constants";
import { Section } from "./Section";

export const CareerList = () => (
  <Section title="Career">
    {ABOUT.career.map(({ company, role, period, description }) => (
      <div className="column gap-1" key={`${company}-${period}`}>
        <div className="row-between items-start gap-4">
          <div className="column gap-0.5">
            <p className="h5 font-semibold text-[var(--color-gray-accent)]">
              {company}
            </p>
            <p className="h6 text-[var(--color-gray-mid)]">{role}</p>
          </div>
          <p className="h6 shrink-0 text-[var(--color-gray-light)]">{period}</p>
        </div>
        <p className="h6 mt-1 text-[var(--color-gray-mid)]">{description}</p>
      </div>
    ))}
  </Section>
);
