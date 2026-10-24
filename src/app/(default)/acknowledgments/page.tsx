import type { Metadata } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { Card } from '@/design-system/components/Card';
import { generatePageMetadata } from '@/utils/metadata-util';

const AcknowledgmentsPage = () => {
  return (
    <>
      <header className='mx-auto mb-9 text-center'>
        <h1 className='text-title font-semibold mb-3 text-primary'>Acknowledgments</h1>
        <p className='font-medium text-tertiary text-label'>
          Recognition for responsible security reports.
        </p>
      </header>

      <div className='column gap-8 pb-16'>
        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Security Researchers</h2>
          <p className='leading-relaxed text-tertiary'>
            No public acknowledgments have been added yet. Reports that help improve the security of{' '}
            {METADATA.SITE.NAME} may be listed here with the reporter's permission.
          </p>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Listing Criteria</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-tertiary'>
            <li>The report identifies a valid security issue.</li>
            <li>The affected area is within the stated scope.</li>
            <li>The issue results in a meaningful security improvement.</li>
            <li>The report is resolved or otherwise addressed.</li>
            <li>The acknowledgment does not disclose sensitive details.</li>
          </ul>
        </Card>
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
