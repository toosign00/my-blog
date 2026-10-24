import type { Metadata } from 'next';
import { ROUTES } from '@/constants/menu.constants';
import { METADATA } from '@/constants/metadata.constants';
import { Card } from '@/design-system/components/Card';
import { generatePageMetadata } from '@/utils/metadata-util';

const SecurityPolicyPage = () => {
  return (
    <>
      <header className='mx-auto mb-9 text-center'>
        <h1 className='text-title font-semibold mb-3 text-primary'>Security Policy</h1>
        <p className='font-medium text-tertiary text-label'>
          Responsible disclosure guidelines for {METADATA.SITE.NAME}.
        </p>
      </header>

      <div className='column gap-8 pb-16'>
        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Contact</h2>
          <p className='leading-relaxed text-tertiary'>
            Please report suspected vulnerabilities by email at{' '}
            <a className='text-primary no-underline hover:underline' href='mailto:hello@toosign.me'>
              hello@toosign.me
            </a>
            . Include enough detail to reproduce the issue, affected URLs, and any relevant proof of
            concept.
          </p>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Scope</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-tertiary'>
            <li>https://toosign.me and pages served from this blog.</li>
            <li>Public routes, APIs, and static files maintained in this repository.</li>
            <li>Issues that could affect confidentiality, integrity, or availability.</li>
          </ul>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Out of Scope</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-tertiary'>
            <li>Third-party services and platforms not operated by this site.</li>
            <li>files.toosign.me and externally hosted files.</li>
            <li>Social accounts, email provider infrastructure, and physical security issues.</li>
          </ul>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Report Details</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-tertiary'>
            <li>Affected URL or endpoint.</li>
            <li>Vulnerability type and expected impact.</li>
            <li>Steps to reproduce the issue.</li>
            <li>Screenshots or a minimal proof of concept, if available.</li>
          </ul>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Testing Guidelines</h2>
          <ul className='m-0 column list-disc gap-2 pl-5 text-tertiary'>
            <li>Do not access, modify, or delete data that is not yours.</li>
            <li>Do not perform denial-of-service, spam, or social engineering tests.</li>
            <li>Do not run automated high-volume scans.</li>
            <li>Do not attempt credential stuffing, brute force, or account takeover tests.</li>
            <li>Do not exfiltrate, persist, or publicly share data.</li>
            <li>Give reasonable time to review and resolve the report before public disclosure.</li>
          </ul>
        </Card>

        <Card as='section' className='column gap-4' padding='lg'>
          <h2 className='section-heading'>Review Process</h2>
          <p className='leading-relaxed text-tertiary'>
            Valid reports are reviewed as time allows. I try to acknowledge actionable reports
            within 7 days, and resolution time may vary depending on severity and scope.
          </p>
          <p className='leading-relaxed text-tertiary'>
            Reports made in good faith and within this policy will not be treated as malicious
            activity.
          </p>
        </Card>
      </div>
    </>
  );
};

export default SecurityPolicyPage;

export const generateMetadata = (): Metadata =>
  generatePageMetadata({
    title: 'Security Policy',
    description: `Responsible disclosure guidelines for ${METADATA.SITE.NAME}.`,
    path: ROUTES.SECURITY_POLICY,
  });
