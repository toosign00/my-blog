import { ABOUT } from '@/constants/about.constants';

export const HowIWork = () => {
  return (
    <section className='column gap-6'>
      <h3 className='section-heading'>How I Work</h3>
      <div className='column gap-4 text-gray-bold leading-relaxed'>
        {ABOUT.howIWork.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  );
};
