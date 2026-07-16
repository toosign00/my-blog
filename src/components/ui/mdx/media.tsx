import Image from 'next/image';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { getRemoteImagePlaceholder } from '@/utils/image-placeholder-util';
import { LazyImage } from '../lazyImage';

type ImgProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  src?: string;
  alt?: string;
};

export const Img = async ({ src, alt, ...props }: ImgProps) => {
  if (!src) {
    return null;
  }

  if (src.startsWith('https://')) {
    const placeholder = await getRemoteImagePlaceholder(src);
    return (
      <LazyImage
        alt={alt ?? ''}
        blurDataURL={placeholder?.blurDataURL}
        className={twMerge('h-auto max-w-full', props.className)}
        draggable={props.draggable === true || props.draggable === 'true'}
        height={placeholder?.height}
        src={src}
        style={props.style}
        title={props.title}
        width={placeholder?.width}
      />
    );
  }

  try {
    const image = await import(`../../../app/posts/_articles/${src}`);

    return (
      <Image
        alt={alt ?? ''}
        draggable={false}
        placeholder='blur'
        quality={100}
        src={image.default}
      />
    );
  } catch {
    return <p>Image Loading Error (src: {src})</p>;
  }
};
