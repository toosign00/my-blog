import { render, screen } from '@testing-library/react';
import { Chip, chipClass } from './Chip';

describe('Chip', () => {
  it('renders its content as inline text', () => {
    render(<Chip>QA</Chip>);

    expect(screen.getByText('QA').tagName).toBe('SPAN');
  });

  it('uses the inverse colors for the solid tone', () => {
    render(<Chip tone='solid'>New</Chip>);

    expect(screen.getByText('New')).toHaveClass('bg-inverse', 'text-inverse');
  });
});

describe('chipClass', () => {
  it('lets a caller class override the tone text color', () => {
    const className = chipClass({ size: 'lg', className: 'text-secondary' });

    expect(className).toContain('text-secondary');
    expect(className).toContain('text-label');
    expect(className).not.toContain('text-tertiary');
  });
});
