"use client";

import { Divider } from "@components/ui/divider";
import { ROUTES } from "@constants/menu.constants";
import { METADATA } from "@constants/metadata.constants";
import * as Accordion from "@radix-ui/react-accordion";
import { Network, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { NavigateMenu } from "./NavigateMenu";

const CURRENT_YEAR = new Date().getFullYear();

export const Header = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname change is the intended trigger
  useEffect(() => {
    setAccordionOpen(false);
  }, [pathname]);

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

        <header className="fixed top-0 left-0 z-(--z-header) flex tablet:hidden w-full bg-background px-(--spacing-inline)">
          <div className="row-between mx-auto w-full max-w-(--app-width) py-3.25">
            <Link aria-label={METADATA.SITE.NAME} href={ROUTES.HOME}>
              <Image
                alt={METADATA.SITE.NAME}
                className="h-3 w-10 shrink-0 border-0 rounded-none"
                height={12}
                src="/static/favicon.svg"
                width={40}
              />
            </Link>

            <Accordion.Item
              aria-label="Menu Accordion"
              className="mt-px overflow-hidden"
              id="menu-accordion-item"
              value="menu"
            >
              <button
                aria-controls="menu-accordion-content"
                aria-expanded={accordionOpen}
                className="ui-button h4 px-4 text-gray-mid hover:bg-background02"
                onClick={() => setAccordionOpen((open) => !open)}
                type="button"
              >
                {accordionOpen ? "-" : "menu"}
              </button>
              <Accordion.Content
                aria-labelledby="menu-accordion-item"
                className="fixed top-16.75 left-0 w-full overflow-hidden bg-background px-inline"
                id="menu-accordion-content"
              >
                <div className="column mx-auto w-full max-w-app pt-6.25 pb-4.75">
                  <div className="column w-full max-w-30.5 gap-7.5">
                    <NavigateMenu />
                    <ThemeToggle />
                  </div>
                  <p className="h7 mt-10.75 w-full text-center text-license">
                    Copyright © {CURRENT_YEAR} {METADATA.AUTHOR.NAME}, All
                    rights reserved.
                  </p>
                  <div className="row-between mx-auto max-w-30.5 mt-4 gap-2">
                    <Link
                      aria-label="RSS feed"
                      className="flex h7 items-center gap-1 text-license no-underline opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70"
                      href={ROUTES.RSS}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Rss size={14} />
                      RSS
                    </Link>
                    <Link
                      aria-label="XML sitemap"
                      className="flex h7 items-center gap-1 text-license no-underline opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70"
                      href={ROUTES.SITEMAP}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Network size={14} />
                      Sitemap
                    </Link>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          </div>
        </header>
      </Accordion.Root>

      <div className="block tablet:hidden pt-16.75">
        <Divider />
      </div>
    </>
  );
};
