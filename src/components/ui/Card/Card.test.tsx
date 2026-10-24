import { render, screen } from '@testing-library/react';
import { Card, cardClass } from './Card';

describe('Card', () => {
  it('renders as a div by default', () => {
    render(<Card>Body</Card>);

    expect(screen.getByText('Body').tagName).toBe('DIV');
  });

  it('renders the requested element', () => {
    render(
      <Card aria-label='Contact' as='section'>
        Body
      </Card>
    );

    expect(screen.getByRole('region', { name: 'Contact' })).toHaveTextContent('Body');
  });
});

describe('cardClass', () => {
  it('adds a hover background only for interactive cards', () => {
    expect(cardClass({ interactive: true })).toContain('hover:bg-fill-weak');
    expect(cardClass()).not.toContain('hover:bg-fill-weak');
  });

  it('applies the padding scale', () => {
    expect(cardClass({ padding: 'lg' })).toContain('p-5');
  });
});
