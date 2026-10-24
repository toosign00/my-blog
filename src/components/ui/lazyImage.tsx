'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { twMerge } from '@/design-system/tw-merge';

export type LazyImageProps = {
  src: string;
  alt: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  className?: string;
  draggable?: boolean;
  title?: string;
  style?: CSSProperties;
  quality?: number;
  onLoad?: () => void;
};

export const LazyImage = ({
  src,
  alt,
  blurDataURL,
  width = 1200,
  height = 800,
  className,
  draggable = false,
  title,
  style,
  quality = 100,
  onLoad,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const useShimmer = !blurDataURL;

  return (
    <span
      className='relative block w-full overflow-hidden rounded-lg'
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {useShimmer && !isLoaded && <span className='skeleton-shimmer absolute inset-0' />}
      <Image
        alt={alt}
        blurDataURL={blurDataURL}
        className={twMerge(
          'h-auto w-full max-w-full transition-opacity duration-slow',
          useShimmer && !isLoaded ? 'opacity-0' : 'opacity-100',
          className
        )}
        draggable={draggable}
        height={height}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        quality={quality}
        sizes='(max-width: 60rem) 100vw, 47.375rem'
        src={src}
        style={style}
        title={title}
        width={width}
      />
    </span>
  );
};
