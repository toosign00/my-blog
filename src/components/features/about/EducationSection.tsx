import { ABOUT } from '@/constants/about.constants';

export const EducationSection = () => {
  return (
    <section className='column gap-6'>
      <h3 className='section-heading'>Education</h3>
      <ul className='column gap-6'>
        {ABOUT.education.map((item) => (
          <li
            key={item.school}
            className='flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4'
          >
            <div className='column'>
              <span className='text-heading font-bold text-secondary'>{item.school}</span>
              {'detail' in item ? (
                <div className='flex items-center gap-2 text-tertiary'>
                  <span>{item.major}</span>
                  <span className='w-px h-3 bg-pressed' />
                  <span>{item.detail}</span>
                </div>
              ) : (
                <span className='text-tertiary'>{item.major}</span>
              )}
            </div>
            <span className='text-tertiary font-mono text-label'>{item.period}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
