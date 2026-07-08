'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
  onLoad,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const useShimmer = !blurDataURL;

  return (
    <span
      className='relative block overflow-hidden rounded-lg'
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {useShimmer && !isLoaded && (
        <span className='theme-color-transition absolute inset-0 animate-pulse bg-background05' />
      )}
      <Image
        alt={alt}
        blurDataURL={blurDataURL}
        className={twMerge(
          'h-auto max-w-full transition-opacity duration-300',
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
        sizes='(max-width: 60rem) 100vw, 47.375rem'
        src={src}
        style={style}
        title={title}
        width={width}
      />
    </span>
  );
};
