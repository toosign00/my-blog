import { Download } from 'lucide-react';
import Image from 'next/image';
import { ContactButtons } from '@/components/about/ContactBtn';
import { ResumeDownloadButton } from '@/components/ResumeBtn';
import { ABOUT } from '@/constants/about.constants';
import { createBlur } from '@/utils/blur-util';

export const ProfileCard = async () => {
  const blurDataURL = await createBlur(ABOUT.profile.profileImage).catch(() => undefined);

  return (
    <div className='flex flex-col gap-6'>
      <h1 className='section-heading'>About</h1>
      <section className='overflow-hidden rounded-2xl border border-border'>
        <div
          className='theme-color-transition w-full p-7.5'
          style={{ backgroundColor: ABOUT.profile.cardBackgroundColor }}
        >
          <div className='flex items-center gap-8'>
            <div
              className='theme-color-transition relative w-25 h-25 tablet:w-30 tablet:h-30 shrink-0 select-none rounded-2xl overflow-hidden border'
              style={{
                borderColor: ABOUT.profile.profileImageBorderColor,
                boxShadow: `0px 10px 39px ${ABOUT.profile.profileImageShadowColor}`,
                filter: ABOUT.profile.profileImageFilter,
              }}
            >
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
              <h2
                className='theme-color-transition text-2xl font-bold'
                style={{ color: ABOUT.profile.authorTextColor }}
              >
                {ABOUT.profile.name}
              </h2>
              <p
                className='theme-color-transition text-base'
                style={{ color: ABOUT.profile.contentTextColor }}
              >
                {ABOUT.profile.role}
              </p>
            </div>
          </div>
        </div>

        <div
          className='theme-color-transition flex w-full flex-col border-t tablet:flex-row'
          style={{ borderColor: 'var(--color-profile-divider)' }}
        >
          <ResumeDownloadButton
            fileUrl={ABOUT.profile.resumeUrl}
            className='theme-color-filter-transition focus-ring relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden px-4 py-3 hover:brightness-95 active:brightness-95'
            style={{
              backgroundColor: ABOUT.profile.cardBackgroundColor,
              color: ABOUT.profile.contentTextColor,
            }}
          >
            <div
              className='theme-color-transition pointer-events-none absolute inset-0'
              style={{ backgroundColor: 'var(--color-profile-button-overlay)' }}
            />
            <div className='relative z-10 flex items-center gap-2'>
              <Download size={20} />
              <span className='font-medium'>이력서 다운로드</span>
            </div>
          </ResumeDownloadButton>
          <div
            className='theme-color-transition h-px w-full tablet:hidden'
            style={{ backgroundColor: 'var(--color-profile-divider)' }}
          />
          <div
            className='theme-color-transition hidden w-px tablet:block'
            style={{ backgroundColor: 'var(--color-background08)' }}
          />
          <ResumeDownloadButton
            fileUrl={ABOUT.profile.coverLetterUrl}
            className='theme-color-filter-transition focus-ring relative flex flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden px-4 py-3 hover:brightness-95 active:brightness-95'
            style={{
              backgroundColor: ABOUT.profile.cardBackgroundColor,
              color: ABOUT.profile.contentTextColor,
            }}
          >
            <div
              className='theme-color-transition pointer-events-none absolute inset-0'
              style={{ backgroundColor: 'var(--color-profile-button-overlay)' }}
            />
            <div className='relative z-10 flex items-center gap-2'>
              <Download size={20} />
              <span className='font-medium'>자기소개서 다운로드</span>
            </div>
          </ResumeDownloadButton>
        </div>
      </section>
      <ContactButtons />
    </div>
  );
};
