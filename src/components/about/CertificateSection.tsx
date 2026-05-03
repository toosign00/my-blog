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
      <h3 className='h3 text-gray-light'>Certificate</h3>
      <ul className='column gap-6'>
        {items.map((item) => (
          <li
            key={item.title}
            className='flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4'
          >
            <div className='column'>
              <span className='text-lg font-bold text-gray-bold'>{item.title}</span>
              {item.detail ? (
                <div className='flex items-center gap-2 text-gray-mid'>
                  <span>{item.issuer}</span>
                  <span className='w-px h-3 bg-border' />
                  <span>{item.detail}</span>
                </div>
              ) : (
                <span className='text-gray-mid'>{item.issuer}</span>
              )}
            </div>
            <span className='text-gray-mid font-mono text-sm'>{item.period}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
