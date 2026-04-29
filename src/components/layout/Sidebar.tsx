import { Divider } from "@components/ui/divider";
import { ROUTES } from "@constants/menu.constants";
import { METADATA } from "@constants/metadata.constants";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { NavigateMenu } from "./NavigateMenu";
import { ThemeToggle } from "./ThemeToggle";

export const Sidebar = () => {
  return (
    <aside
      aria-label="Sidebar navigation"
      className="fixed top-0 left-0 tablet:flex hidden h-[100dvh] w-[var(--spacing-sidebar)] flex-col justify-between px-[2.5rem] py-[2.75rem]"
    >
      <div className="column w-full gap-[1.5625rem]">
        <Link
          aria-label={METADATA.SITE.NAME}
          className="px-[0.625rem] py-[0.78125rem]"
          href={ROUTES.HOME}
        >
          <Image
            alt={METADATA.SITE.NAME}
            className="h-4 w-14"
            height={16}
            src="/static/favicon.svg"
            width={56}
          />
        </Link>
        <Divider />
        <nav>
          <NavigateMenu />
        </nav>
      </div>

      <div className="column w-full gap-[1.25rem]">
        <ThemeToggle />
        <p className="h6 w-full text-[var(--color-license)]">
          Copyright © {dayjs().year()} {METADATA.AUTHOR.NAME}, All rights
          reserved.
        </p>
      </div>
    </aside>
  );
};
