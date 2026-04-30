import { ABOUT } from "@/constants/about.constants";

export const EducationSection = () => {
  return (
    <section className="column gap-6">
      <h3 className="h3 text-gray-light">Education</h3>
      <ul className="column gap-6">
        {ABOUT.education.map((item) => (
          <li
            key={item.school}
            className="flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4"
          >
            <div className="column">
              <span className="text-lg font-bold text-gray-bold">
                {item.school}
              </span>
              {"detail" in item ? (
                <div className="flex items-center gap-2 text-gray-mid">
                  <span>{item.major}</span>
                  <span className="w-px h-3 bg-border" />
                  <span>{item.detail}</span>
                </div>
              ) : (
                <span className="text-gray-mid">{item.major}</span>
              )}
            </div>
            <span className="text-gray-mid font-mono text-sm">
              {item.period}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
