'use client';

import Image, { type ImageProps } from 'next/image';
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
  onLoadingComplete?: ImageProps['onLoadingComplete'];
};

export const LazyImage = ({
  src,
  alt,
  className,
  draggable = false,
  title,
  style,
  onLoadingComplete,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      alt={alt}
      className={twMerge(
        'h-auto max-w-full transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      draggable={draggable}
      height={800}
      onLoadingComplete={(img) => {
        setIsLoaded(true);
        onLoadingComplete?.(img);
      }}
      sizes='(max-width: 768px) 100vw, 1200px'
      src={src}
      style={style}
      title={title}
      unoptimized
      width={1200}
    />
  );
};
