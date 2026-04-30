"use client";

import { MENU } from "@constants/menu.constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export const NavigateMenu = () => {
  const pathname = usePathname();
  const path: string = pathname.split("/")[1].trim();

  return (
    <nav aria-label="Main navigation">
      <ul className="column w-full gap-1.5">
        {MENU.map((menu) => {
          const isActive = path === menu.link.replace(/\//g, "");
          return (
            <li
              className={twMerge(
                "h-10 w-full rounded-md text-gray-mid",
                isActive && "bg-border text-gray-accent",
              )}
              key={menu.link}
            >
              <Link
                aria-current={isActive ? "page" : undefined}
                className="center-y a h-full w-full px-2.5"
                href={menu.link}
              >
                {menu.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
