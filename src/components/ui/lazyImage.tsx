'use client';

import type { ImageLoaderProps } from 'next/image';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const cloudflareLoader = ({ src, width }: ImageLoaderProps) => {
  return src.replace(/width=\d+/, `width=${width}`);
};

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
    <Image
      alt={alt}
      className={twMerge(
        'h-auto max-w-full transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      draggable={draggable}
      height={800}
      onLoad={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
      loader={cloudflareLoader}
      sizes='(max-width: 768px) 100vw, 800px'
      src={src}
      style={style}
      title={title}
      width={1200}
    />
  );
};
