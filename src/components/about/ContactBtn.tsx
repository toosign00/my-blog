'use client';

import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { LinkedInIcon } from '@/components/icons/LinkedInIcon';
import { ABOUT } from '@/constants/about.constants';
import { buttonClass } from '@/design-system/components/Button';
import { ICON_SIZE } from '@/design-system/tokens/icon';

const ICON_MAP = {
  phone: Phone,
  mail: Mail,
  linkedin: LinkedInIcon,
  github: GithubIcon,
} as const;

const contactButtonClass = buttonClass({ size: 'lg', className: 'w-full px-3' });

const labelClass = 'text-label font-medium text-secondary';

export const ContactButtons = () => {
  const handleCopy = async (text: string, copyType: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(
        copyType === 'phone'
          ? '전화번호를 클립보드에 복사했어요'
          : '메일 주소를 클립보드에 복사했어요'
      );
    } catch {
      toast.error('복사에 실패했어요. 브라우저에서 클립보드 권한을 확인해 주세요.');
    }
  };

  return (
    <div className='grid grid-cols-2 tablet:grid-cols-4 gap-2 w-full'>
      {ABOUT.contacts.map((contact) => {
        const Icon = ICON_MAP[contact.icon];

        if (contact.type === 'copy') {
          return (
            <button
              key={contact.label}
              type='button'
              onClick={() => void handleCopy(contact.value, contact.copyType)}
              className={contactButtonClass}
              aria-label={contact.copyType === 'phone' ? 'Copy phone number' : 'Copy email address'}
            >
              <Icon size={ICON_SIZE.lg} />
              <span className={labelClass}>{contact.label}</span>
            </button>
          );
        }

        return (
          <a
            key={contact.label}
            href={contact.href}
            target='_blank'
            rel='noreferrer'
            className={contactButtonClass}
            aria-label={contact.label}
          >
            <Icon size={ICON_SIZE.lg} />
            <span className={labelClass}>{contact.label}</span>
          </a>
        );
      })}
    </div>
  );
};
