import { Download } from 'lucide-react';
import Image from 'next/image';
import { ContactButtons } from '@/components/about/ContactBtn';
import { ResumeDownloadButton } from '@/components/ResumeBtn';
import { ABOUT } from '@/constants/about.constants';
import { ICON_SIZE } from '@/styles/tokens/icon';
import { createBlur } from '@/utils/blur-util';

const DOWNLOAD_BUTTON_CLASS =
  'focus-ring flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-3 text-primary transition-colors hover:bg-fill-weak active:bg-fill';

export const ProfileCard = async () => {
  const blurDataURL = await createBlur(ABOUT.profile.profileImage).catch(() => undefined);

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='section-heading'>About</h1>
      <section className='overflow-hidden rounded-lg border border-default bg-elevated'>
        <div className='w-full p-8'>
          <div className='flex items-center gap-8'>
            <div className='relative size-24 tablet:size-28 shrink-0 select-none overflow-hidden rounded-lg border border-media shadow-media'>
              <Image
                className='w-full h-full object-cover rounded-none border-0'
                src={ABOUT.profile.profileImage}
                alt={`${ABOUT.profile.name} profile image`}
                {...(blurDataURL && { placeholder: 'blur' as const, blurDataURL })}
                sizes='(max-width: 768px) 100vw, 300px'
                draggable={false}
                priority
                fill
              />
            </div>
            <div className='flex flex-col items-start gap-1'>
              <h2 className='text-title font-bold text-accent-strong'>{ABOUT.profile.name}</h2>
              <p className='text-body text-primary'>{ABOUT.profile.role}</p>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col border-t border-elevated tablet:flex-row'>
          <ResumeDownloadButton fileUrl={ABOUT.profile.resumeUrl} className={DOWNLOAD_BUTTON_CLASS}>
            <span className='flex items-center gap-2'>
              <Download size={ICON_SIZE.lg} />
              <span className='font-medium'>이력서 다운로드</span>
            </span>
          </ResumeDownloadButton>
          <div className='h-px w-full bg-fill-strong tablet:hidden' />
          <div className='hidden w-px bg-fill-strong tablet:block' />
          <ResumeDownloadButton
            fileUrl={ABOUT.profile.coverLetterUrl}
            className={DOWNLOAD_BUTTON_CLASS}
          >
            <span className='flex items-center gap-2'>
              <Download size={ICON_SIZE.lg} />
              <span className='font-medium'>자기소개서 다운로드</span>
            </span>
          </ResumeDownloadButton>
        </div>
      </section>
      <ContactButtons />
    </div>
  );
};
