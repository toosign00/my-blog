import { ABOUT } from "@constants/about.constants";
import { Section } from "./Section";

export const SkillList = () => (
  <Section title="Skills">
    {ABOUT.skills.map(({ level, items }) => (
      <div className="column gap-2" key={level}>
        <p className="h6 text-[var(--color-gray-light)]">{level}</p>
        <div className="row flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              className="ui-chip h6 px-2.5 py-1 text-[var(--color-gray-mid)]"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </Section>
);
