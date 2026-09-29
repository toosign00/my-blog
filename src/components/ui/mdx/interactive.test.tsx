import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, Tab, Tabs } from './interactive';

const tabs = [
  <Tab key='first' value='first' title='First'>
    First content
  </Tab>,
  <Tab key='second' value='second' title='Second'>
    Second content
  </Tab>,
];

it.each([undefined, 'missing', 'first'])(
  'selects the first tab with default %s',
  (defaultValue) => {
    render(<Tabs defaultValue={defaultValue}>{tabs}</Tabs>);
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'First' })).toHaveTextContent('First content');
    expect(screen.queryByText('Second content')).not.toBeInTheDocument();
  }
);

it('switches tabs by keyboard activation and links the selected panel', async () => {
  const user = userEvent.setup();
  render(<Tabs defaultValue='second'>{tabs}</Tabs>);
  expect(screen.getByRole('tabpanel', { name: 'Second' })).toHaveTextContent('Second content');
  await user.tab();
  await user.keyboard('{Enter}');
  const tab = screen.getByRole('tab', { name: 'First' });
  const panel = screen.getByRole('tabpanel', { name: 'First' });
  expect(tab).toHaveAttribute('aria-selected', 'true');
  expect(tab).toHaveAttribute('aria-controls', panel.id);
  expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'false');
});

it('renders no controls for empty tab or accordion content', () => {
  render(
    <>
      <Tabs>{null}ignored</Tabs>
      <Accordion>{false}</Accordion>
    </>
  );
  expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('opens one accordion item at a time and closes the active item', async () => {
  const user = userEvent.setup();
  render(
    <Accordion>
      <AccordionItem title='First' value='first'>
        First content
      </AccordionItem>
      <AccordionItem title='Second'>Second content</AccordionItem>
    </Accordion>
  );
  const first = screen.getByRole('button', { name: 'First' });
  const second = screen.getByRole('button', { name: 'Second' });
  expect(first).toHaveAttribute('aria-expanded', 'false');
  await user.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
  await user.click(second);
  expect(first).toHaveAttribute('aria-expanded', 'false');
  expect(second).toHaveAttribute('aria-expanded', 'true');
  await user.click(second);
  expect(second).toHaveAttribute('aria-expanded', 'false');
});

it('honors the default accordion value', () => {
  render(
    <Accordion defaultValue='first'>
      <AccordionItem title='First' value='first'>
        Content
      </AccordionItem>
    </Accordion>
  );
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Content')).toBeInTheDocument();
});

it('renders standalone item contents', () => {
  render(
    <>
      <Tab title='Tab' value='tab'>
        <p>Tab content</p>
      </Tab>
      <AccordionItem title='Item'>
        <p>Item content</p>
      </AccordionItem>
    </>
  );
  expect(screen.getByText('Tab content')).toBeInTheDocument();
  expect(screen.getByText('Item content')).toBeInTheDocument();
});
