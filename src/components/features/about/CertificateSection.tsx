interface CertificateItem {
  title: string;
  issuer: string;
  detail?: string;
  period: string;
}

interface CertificateSectionProps {
  items: readonly CertificateItem[];
}

export const CertificateSection = ({ items }: CertificateSectionProps) => {
  return (
    <section className='column gap-6'>
      <h3 className='section-heading'>Certificate</h3>
      <ul className='column gap-6'>
        {items.map((item) => (
          <li
            key={item.title}
            className='flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4'
          >
            <div className='column'>
              <span className='text-heading font-bold text-secondary'>{item.title}</span>
              {item.detail ? (
                <div className='flex items-center gap-2 text-tertiary'>
                  <span>{item.issuer}</span>
                  <span className='w-px h-3 bg-pressed' />
                  <span>{item.detail}</span>
                </div>
              ) : (
                <span className='text-tertiary'>{item.issuer}</span>
              )}
            </div>
            <span className='text-tertiary font-mono text-label'>{item.period}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
