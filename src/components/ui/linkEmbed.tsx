'use client';
import Image from 'next/image';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';

interface LinkEmbedProps extends ComponentProps<'a'> {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  favicon?: string;
  variant?: 'card' | 'mention';
}

interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export const LinkEmbed = ({
  url,
  title: manualTitle,
  description: manualDescription,
  thumbnail: manualThumbnail,
  favicon: manualFavicon,
  variant = 'card',
  ...props
}: LinkEmbedProps) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const hostname = new URL(url).hostname;

  // Use manual props if provided, otherwise use fetched metadata
  const title = manualTitle || metadata?.title || url;
  const description = manualDescription || metadata?.description;
  const thumbnail = manualThumbnail || metadata?.image || '/og-image.png';
  const favicon =
    manualFavicon ||
    metadata?.favicon ||
    `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  useEffect(() => {
    // If all manual props are provided, skip fetching
    // For mention variant, we only need title and favicon
    const hasRequiredProps =
      variant === 'mention'
        ? manualTitle && manualFavicon
        : manualTitle && manualDescription && manualThumbnail;

    if (hasRequiredProps) {
      setIsLoading(false);
      return;
    }

    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch metadata');
        }

        const data = await response.json();
        setMetadata(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMetadata();
  }, [url, manualTitle, manualDescription, manualThumbnail, manualFavicon, variant]);

  if (error) {
    // Fallback to simple link on error
    return (
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='block w-full text-gray-bold hover:opacity-70 transition-opacity'
        {...props}
      >
        🔗 {manualTitle || url}
      </a>
    );
  }

  if (isLoading) {
    // Loading skeleton
    if (variant === 'mention') {
      return (
        <div className='inline-flex items-center gap-1.5 h-6 animate-pulse'>
          <div className='w-4 h-4 rounded bg-background05' />
          <div className='h-4 w-24 rounded bg-background05' />
        </div>
      );
    }
    return (
      <div className='block w-full'>
        <div className='flex flex-col mobile:flex-row gap-4 p-4 border border-border rounded-xl bg-background overflow-hidden animate-pulse'>
          <div className='shrink-0 w-full mobile:w-32 aspect-video mobile:aspect-square rounded-lg bg-background05' />
          <div className='flex-1 min-w-0 flex flex-col justify-between'>
            <div>
              <div className='h-5 bg-background05 rounded mb-2 w-3/4' />
              <div className='h-4 bg-background05 rounded mb-1 w-full' />
              <div className='h-4 bg-background05 rounded mb-3 w-5/6' />
            </div>
            <div className='h-3 bg-background05 rounded w-32' />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'mention') {
    return (
      <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border transition-colors duration-200 hover:bg-background03 group'
        {...props}
      >
        {!faviconError && (
          <Image
            alt=''
            className='h-3.5 w-3.5 shrink-0 rounded-full'
            height={14}
            src={favicon}
            unoptimized
            width={14}
            onError={() => setFaviconError(true)}
          />
        )}
        {faviconError && (
          <svg
            width='16'
            height='16'
            viewBox='0 0 15 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='shrink-0 text-gray-light'
          >
            <title>Favicon Error</title>
            <path
              d='M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z'
              fill='currentColor'
              fillRule='evenodd'
              clipRule='evenodd'
            />
          </svg>
        )}
        <span className='text-gray-bold text-sm group-hover:text-gray-bold transition-colors max-w-48 truncate'>
          {title}
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='block w-full no-underline border-0'
      {...props}
    >
      <div className='group flex flex-col mobile:flex-row gap-4 p-4 border border-border rounded-xl bg-background hover:bg-gray-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden'>
        {thumbnail && !thumbnailError && (
          <div className='relative shrink-0 w-full mobile:w-32 aspect-video mobile:aspect-square overflow-hidden rounded-lg bg-background05'>
            <Image
              alt={title}
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, 8rem'
              src={thumbnail}
              unoptimized
              onError={() => setThumbnailError(true)}
            />
          </div>
        )}

        <div className='flex-1 min-w-0 flex flex-col justify-between'>
          <div>
            <h3 className='font-semibold text-gray-accent text-base mb-2 line-clamp-2 group-hover:text-gray-bold transition-colors duration-200'>
              {title}
            </h3>
            {description && (
              <p className='text-sm text-gray-mid line-clamp-2 mb-3'>{description}</p>
            )}
          </div>

          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2 text-xs text-gray-light min-w-0'>
              {!faviconError && (
                <Image
                  alt=''
                  className='h-4 w-4 shrink-0 rounded'
                  height={16}
                  src={favicon}
                  unoptimized
                  width={16}
                  onError={() => setFaviconError(true)}
                />
              )}
              {faviconError && (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='shrink-0 text-gray-light'
                >
                  <title>Favicon Error</title>
                  <path
                    d='M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z'
                    fill='currentColor'
                    fillRule='evenodd'
                    clipRule='evenodd'
                  />
                </svg>
              )}
              <span className='truncate'>{hostname}</span>
            </div>

            <div className='shrink-0'>
              <svg
                width='20'
                height='20'
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='text-gray-mid group-hover:text-gray-accent transition-colors duration-200'
              >
                <title>External Link</title>
                <path
                  d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.7761 3 12 3.22386 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                  fill='currentColor'
                  fillRule='evenodd'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};
