"use client";

import { Divider } from "@components/ui/divider";
import { ROUTES } from "@constants/menu.constants";
import { METADATA } from "@constants/metadata.constants";
import * as Accordion from "@radix-ui/react-accordion";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { NavigateMenu } from "./NavigateMenu";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  const overlayClassName =
    "fixed inset-0 bg-[rgba(0,0,0,0.2)] backdrop-blur-[11px] z-[var(--z-overlay)] transition-opacity duration-300";

  return (
    <>
      <Accordion.Root
        collapsible
        type="single"
        value={accordionOpen ? "menu" : ""}
      >
        <button
          aria-label="Close menu"
          className={
            accordionOpen
              ? `${overlayClassName} opacity-100`
              : `${overlayClassName} pointer-events-none opacity-0`
          }
          onClick={() => setAccordionOpen(false)}
          type="button"
        />

        <header className="fixed top-0 left-0 z-[var(--z-header)] flex tablet:hidden w-full bg-[var(--color-background)] px-[var(--spacing-inline)]">
          <div className="row-between mx-auto w-full max-w-[var(--app-width)] py-[0.8125rem]">
            <Link aria-label={METADATA.SITE.NAME} href={ROUTES.HOME}>
              <Image
                alt={METADATA.SITE.NAME}
                className="h-4 w-14"
                height={16}
                src="/static/favicon.svg"
                width={56}
              />
            </Link>

            <Accordion.Item
              aria-label="Menu Accordion"
              className="mt-[1px] overflow-hidden"
              id="menu-accordion-item"
              value="menu"
            >
              <button
                aria-controls="menu-accordion-content"
                aria-expanded={accordionOpen}
                className="ui-button h4 px-4 text-[var(--color-gray-mid)] hover:bg-[var(--color-background02)]"
                onClick={() => setAccordionOpen((open) => !open)}
                type="button"
              >
                {accordionOpen ? "-" : "menu"}
              </button>
              <Accordion.Content
                aria-labelledby="menu-accordion-item"
                className="fixed top-[4.1875rem] left-0 w-full overflow-hidden bg-[var(--color-background)] px-[var(--spacing-inline)]"
                id="menu-accordion-content"
              >
                <div className="column mx-auto w-full max-w-[var(--app-width)] pt-[1.5625rem] pb-[1.1875rem]">
                  <div className="column w-full max-w-[122px] gap-[1.875rem]">
                    <NavigateMenu />
                    <ThemeToggle />
                  </div>
                  <p className="h7 mt-[2.6875rem] w-full text-center text-[var(--color-license)]">
                    Copyright © {dayjs().year()} {METADATA.AUTHOR.NAME}, All
                    rights reserved.
                  </p>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </div>
        </header>
      </Accordion.Root>

      <div className="block tablet:hidden pt-[4.1875rem]">
        <Divider />
      </div>
    </>
  );
};
