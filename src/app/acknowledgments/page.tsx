import type { Metadata } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { generatePageMetadata } from '@/utils/metadata-util';

const AcknowledgmentsPage = () => {
  return (
    <>
      <header className='mx-auto mb-9 text-center'>
        <h1 className='post-title mb-3 text-gray-accent'>Acknowledgments</h1>
        <p className='font-medium text-gray-mid text-sm'>
          Recognition for responsible security reports.
        </p>
      </header>

      <div className='column gap-7.5 pb-16.25'>
        <section className='ui-card column gap-4 rounded-sm p-5'>
          <h2 className='section-heading'>Security Researchers</h2>
          <p className='leading-relaxed text-gray-mid'>
            No public acknowledgments have been added yet. Reports that help improve the security of{' '}
            {METADATA.SITE.NAME} may be listed here with the reporter's permission.
          </p>
        </section>

        <section className='ui-card column gap-4 rounded-sm p-5'>
          <h2 className='section-heading'>Listing Criteria</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-gray-mid'>
            <li>The report identifies a valid security issue.</li>
            <li>The affected area is within the stated scope.</li>
            <li>The issue results in a meaningful security improvement.</li>
            <li>The report is resolved or otherwise addressed.</li>
            <li>The acknowledgment does not disclose sensitive details.</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default AcknowledgmentsPage;

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    title: 'Acknowledgments',
    description: `Recognition for responsible security reports for ${METADATA.SITE.NAME}.`,
    path: ROUTES.ACKNOWLEDGMENTS,
  });
