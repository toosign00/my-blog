import Image from 'next/image';
import { METADATA } from '@/constants/metadata.constants';
import { PROFILE } from '@/constants/profile.constants';
import { createBlur } from '@/utils/blur-util';
import type { ActivityItem } from '@/utils/github-activity-util';
import { fetchRecentGitHubActivities } from '@/utils/github-activity-util';
import { RecentActivity } from '../RecentActivity';
import Card from './Card';

const authorProfileDetails = [
  {
    title: 'Studying',
    content: METADATA.AUTHOR.STUDYING.replace(/,\s+/g, '\n'),
  },
  {
    title: 'Location',
    content: METADATA.AUTHOR.LOCATION,
  },
] as const;

export const ProfileGrid = async () => {
  const blurDataURL = await createBlur(METADATA.AUTHOR.PROFILE_IMAGE);
  let activities: ActivityItem[] = [];

  try {
    activities = await fetchRecentGitHubActivities();
  } catch {
    activities = [];
  }

  return (
    <section
      aria-label={`${METADATA.AUTHOR.NAME}'s profile and recent activity`}
      className='grid w-full grid-cols-1 gap-16.25 tablet:grid-cols-2'
    >
      <div className='column w-full'>
        <h3 className='h3 text-gray-light' id='profile-heading'>
          Profile
        </h3>
        <Card.Root style={{ backgroundColor: PROFILE.cardBackgroundColor }}>
          <Card.Content>
            <fieldset
              aria-labelledby='profile-heading'
              className='column m-0 items-start gap-3 self-start border-0 p-0'
            >
              <div
                className='relative h-24.25 w-24.25 select-none overflow-hidden rounded-md border'
                style={{
                  borderColor: PROFILE.profileImageBorderColor,
                  boxShadow: `0px 10px 39px ${PROFILE.profileImageShadowColor}`,
                  filter: PROFILE.profileImageFilter,
                }}
              >
                <Image
                  alt={`${METADATA.AUTHOR.NAME} profile image`}
                  blurDataURL={blurDataURL}
                  className='h-full w-full rounded-none border-0 object-cover'
                  draggable={false}
                  fill
                  placeholder='blur'
                  priority
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  src={PROFILE.profileImage}
                />
              </div>

              <p
                className='profile-name w-full text-center'
                style={{ color: PROFILE.authorTextColor }}
              >
                {METADATA.AUTHOR.NAME}
              </p>
            </fieldset>

            <dl className='row-between h-3/4 flex-col items-start'>
              {authorProfileDetails.map((item) => (
                <div className='w-full' key={item.title}>
                  <dt className='profile-sub w-full' style={{ color: PROFILE.titleTextColor }}>
                    {item.title}
                  </dt>
                  <dd
                    className='profile-title whitespace-pre-wrap text-[#302C1D]'
                    style={{ color: PROFILE.contentTextColor }}
                  >
                    {item.content}
                  </dd>
                </div>
              ))}
            </dl>
          </Card.Content>
        </Card.Root>
      </div>

      <div className='column w-full'>
        <h3 className='h3 text-gray-light'>Activity</h3>
        <Card.Root>
          <RecentActivity initialActivities={activities} />
        </Card.Root>
      </div>
    </section>
  );
};
