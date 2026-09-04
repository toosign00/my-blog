import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem, Tab, Tabs } from './interactive';

describe('Tabs', () => {
  const renderTabs = (defaultValue?: string) =>
    render(
      <Tabs defaultValue={defaultValue}>
        <Tab title='설치' value='install'>
          Install content
        </Tab>
        <Tab title='사용법' value='usage'>
          Usage content
        </Tab>
      </Tabs>
    );

  it('selects the first tab when no default is given', () => {
    renderTabs();

    expect(screen.getByRole('tab', { name: '설치' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Install content');
  });

  it('selects the tab named by the default value', () => {
    renderTabs('usage');

    expect(screen.getByRole('tab', { name: '사용법' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Usage content');
  });

  it('falls back to the first tab when the default value matches no tab', () => {
    renderTabs('unknown');

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Install content');
  });

  it('shows the content of the tab the user selects', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: '사용법' }));

    expect(screen.getByRole('tab', { name: '사용법' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '설치' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Usage content');
  });

  it('links the active tab and its panel to each other', () => {
    renderTabs();

    const tab = screen.getByRole('tab', { name: '설치' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('renders nothing when it has no tab children', () => {
    const { container } = render(<Tabs>{'plain text'}</Tabs>);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('Accordion', () => {
  const renderAccordion = (defaultValue?: string) =>
    render(
      <Accordion defaultValue={defaultValue}>
        <AccordionItem title='첫 번째 질문'>First answer</AccordionItem>
        <AccordionItem title='두 번째 질문' value='second'>
          Second answer
        </AccordionItem>
      </Accordion>
    );

  it('keeps every item collapsed when no default is given', () => {
    renderAccordion();

    for (const item of screen.getAllByRole('button')) {
      expect(item).toHaveAttribute('aria-expanded', 'false');
    }
  });

  it('opens the item named by the default value', () => {
    renderAccordion('second');

    expect(screen.getByRole('button', { name: '두 번째 질문' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('falls back to the child index when an item has no value', () => {
    renderAccordion('0');

    expect(screen.getByRole('button', { name: '첫 번째 질문' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('opens the item the user clicks and closes it on the next click', async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole('button', { name: '첫 번째 질문' });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens only one item at a time', async () => {
    const user = userEvent.setup();
    renderAccordion('second');

    await user.click(screen.getByRole('button', { name: '첫 번째 질문' }));

    expect(screen.getByRole('button', { name: '첫 번째 질문' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('button', { name: '두 번째 질문' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders nothing when it has no item children', () => {
    const { container } = render(<Accordion>{'plain text'}</Accordion>);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('Tab and AccordionItem', () => {
  it('renders the tab children as plain content on its own', () => {
    render(
      <Tab title='제목' value='value'>
        Tab body
      </Tab>
    );

    expect(screen.getByText('Tab body')).toBeInTheDocument();
  });

  it('renders the accordion item children as plain content on its own', () => {
    render(<AccordionItem title='제목'>Accordion body</AccordionItem>);

    expect(screen.getByText('Accordion body')).toBeInTheDocument();
  });
});
