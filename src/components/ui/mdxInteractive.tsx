'use client';

import { ChevronDown } from 'lucide-react';
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

type TabElement = ReactElement<TabProps>;

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
}

interface TabProps {
  children: ReactNode;
  title: ReactNode;
  value: string;
}

export const Tab = ({ children }: TabProps) => <>{children}</>;

export const Tabs = ({ children, defaultValue }: TabsProps) => {
  const id = useId();
  const tabs = Children.toArray(children).filter(isValidElement<TabProps>) as TabElement[];
  const firstValue = tabs[0]?.props.value;
  const [activeValue, setActiveValue] = useState(defaultValue ?? firstValue);

  if (!firstValue) {
    return null;
  }

  const activeTab = tabs.find((tab) => tab.props.value === activeValue) ?? tabs[0];

  return (
    <div className='mt-6 overflow-hidden rounded-xl border border-border bg-background02'>
      <div
        aria-label='Content tabs'
        className='flex gap-1 border-border border-b bg-background px-1.5 py-1.5'
        role='tablist'
      >
        {tabs.map((tab) => {
          const selected = tab.props.value === activeTab.props.value;
          const tabId = `${id}-${tab.props.value}-tab`;
          const panelId = `${id}-${tab.props.value}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={twMerge(
                'cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-colors duration-150',
                'text-gray-mid hover:bg-background02 hover:text-gray-accent',
                selected && 'bg-surface-strong text-gray-accent'
              )}
              id={tabId}
              key={tab.props.value}
              onClick={() => setActiveValue(tab.props.value)}
              role='tab'
              type='button'
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={`${id}-${activeTab.props.value}-tab`}
        className='p-4 text-gray-bold text-sm leading-relaxed'
        id={`${id}-${activeTab.props.value}-panel`}
        role='tabpanel'
      >
        {activeTab.props.children}
      </div>
    </div>
  );
};

type AccordionElement = ReactElement<AccordionItemProps>;

interface AccordionProps {
  children: ReactNode;
  defaultValue?: string;
}

interface AccordionItemProps {
  children: ReactNode;
  title: ReactNode;
  value?: string;
}

export const AccordionItem = ({ children }: AccordionItemProps) => <>{children}</>;

export const Accordion = ({ children, defaultValue }: AccordionProps) => {
  const items = Children.toArray(children).filter(
    isValidElement<AccordionItemProps>
  ) as AccordionElement[];
  const [openValue, setOpenValue] = useState(defaultValue);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className='mt-6 overflow-hidden rounded-xl border border-border bg-background02'>
      {items.map((item, index) => {
        const value = item.props.value ?? String(index);
        const open = value === openValue;

        return (
          <section className='border-border border-b last:border-b-0' key={value}>
            <button
              aria-expanded={open}
              className={twMerge(
                'flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left font-medium text-gray-accent text-sm underline-offset-4 transition-colors hover:bg-background03 hover:underline',
                open && 'bg-background03'
              )}
              onClick={() => setOpenValue(open ? undefined : value)}
              type='button'
            >
              <span>{item.props.title}</span>
              <ChevronDown
                aria-hidden='true'
                className={twMerge(
                  'size-4 shrink-0 text-gray-light transition-transform duration-200',
                  open && 'rotate-180 text-gray-mid'
                )}
              />
            </button>
            <div
              className={twMerge(
                'grid border-border transition-[grid-template-rows,border-color] duration-200 ease-out',
                open ? 'grid-rows-[1fr] border-t' : 'grid-rows-[0fr] border-t-transparent'
              )}
            >
              <div className='overflow-hidden px-4 text-gray-bold text-sm leading-relaxed'>
                <div className='pt-3 pb-4'>{item.props.children}</div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
