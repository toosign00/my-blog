'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
  title?: string;
  style?: CSSProperties;
  onLoad?: () => void;
};

export const LazyImage = ({
  src,
  alt,
  className,
  draggable = false,
  title,
  style,
  onLoad,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <span className='relative block overflow-hidden'>
      {!isLoaded && (
        <span className='absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,var(--color-background02)_25%,var(--color-border)_50%,var(--color-background02)_75%)] bg-[length:200%_100%]' />
      )}
      <Image
        alt={alt}
        className={twMerge(
          'h-auto max-w-full transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        draggable={draggable}
        height={800}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        sizes='(max-width: 60rem) 100vw, 47.375rem'
        src={src}
        style={style}
        title={title}
        width={1200}
      />
    </span>
  );
};
