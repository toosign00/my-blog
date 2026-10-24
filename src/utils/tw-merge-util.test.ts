import { twMerge } from './tw-merge-util';

describe('twMerge', () => {
  it('keeps a type scale size when a text color is merged after it', () => {
    expect(twMerge('text-label', 'text-tertiary')).toBe('text-label text-tertiary');
  });

  it('lets a later type scale size replace an earlier one', () => {
    expect(twMerge('text-caption text-primary', 'text-body')).toBe('text-primary text-body');
  });

  it('lets a later text color replace an earlier one', () => {
    expect(twMerge('text-caption-sm text-primary', 'text-muted')).toBe(
      'text-caption-sm text-muted'
    );
  });
});
