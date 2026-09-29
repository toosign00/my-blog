import { fireEvent, render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import { LazyImage } from './lazyImage';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    placeholder,
    blurDataURL,
    quality: _quality,
    sizes: _sizes,
    ...props
  }: ImageProps) => (
    // biome-ignore lint/performance/noImgElement: Exercise the image boundary without Next.js decoding.
    <img
      {...props}
      alt={props.alt}
      src={props.src as string}
      data-placeholder={placeholder}
      data-blur={blurDataURL}
    />
  ),
}));

it('reveals an image without blur after it loads', () => {
  render(<LazyImage src='/cover.png' alt='Cover' />);
  const image = screen.getByRole('img', { name: 'Cover' });
  // Opacity is the public loading treatment; jsdom does not apply Tailwind CSS.
  expect(image).toHaveClass('opacity-0');
  expect(image).toHaveAttribute('width', '1200');
  expect(image).toHaveAttribute('height', '800');
  expect(image).toHaveAttribute('draggable', 'false');

  fireEvent.load(image);

  expect(image).toHaveClass('opacity-100');
  expect(image).not.toHaveClass('opacity-0');
});

it('shows the blur placeholder immediately and notifies the caller on load', () => {
  const onLoad = jest.fn();
  render(
    <LazyImage
      src='/cover.png'
      alt='Cover'
      blurDataURL='data:image/png;base64,AAAA'
      width={400}
      height={300}
      draggable
      title='Image details'
      quality={75}
      onLoad={onLoad}
    />
  );
  const image = screen.getByRole('img', { name: 'Cover' });
  expect(image).toHaveClass('opacity-100');
  expect(image).toHaveAttribute('data-placeholder', 'blur');
  expect(image).toHaveAttribute('data-blur', 'data:image/png;base64,AAAA');
  expect(image).toHaveAttribute('width', '400');
  expect(image).toHaveAttribute('height', '300');
  expect(image).toHaveAttribute('draggable', 'true');
  expect(image).toHaveAttribute('title', 'Image details');

  fireEvent.load(image);

  expect(onLoad).toHaveBeenCalledTimes(1);
  expect(image).toHaveClass('opacity-100');
});
