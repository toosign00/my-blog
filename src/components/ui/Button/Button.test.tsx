import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, buttonClass } from './Button';

describe('Button', () => {
  it('renders a non-submitting button by default', () => {
    render(<Button>Retry</Button>);

    expect(screen.getByRole('button', { name: 'Retry' })).toHaveAttribute('type', 'button');
  });

  it('keeps an explicit submit type', () => {
    render(<Button type='submit'>Send</Button>);

    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when pressed', async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Retry</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('lets a caller class override the default text color', () => {
    render(<Button className='text-secondary'>Retry</Button>);

    const button = screen.getByRole('button', { name: 'Retry' });
    expect(button).toHaveClass('text-secondary', 'text-caption');
    expect(button).not.toHaveClass('text-primary');
  });
});

describe('buttonClass', () => {
  it('applies the size scale to outline buttons only', () => {
    expect(buttonClass({ size: 'lg' })).toContain('h-12');
    expect(buttonClass({ variant: 'ghost', size: 'lg' })).not.toContain('h-12');
  });
});
