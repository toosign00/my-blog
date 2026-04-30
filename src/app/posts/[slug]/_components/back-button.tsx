"use client";

import { ChevronLeftIcon } from "@components/icons/ChevronLeftIcon";
import { usePathname, useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (pathname === "/") {
      router.back();
      return;
    }

    const path: string[] = pathname.split("/").filter(Boolean);
    if (path.length > 1) {
      const parent = `/${path.slice(0, -1).join("/")}`;
      router.replace(parent);
    } else {
      router.replace("/");
    }
  };

  return (
    <button
      aria-label="Go back"
      className="center-y h3 w-fit cursor-pointer select-none gap-2 py-1.25 pr-2.25 text-gray-accent opacity-100 transition-opacity duration-150 ease-in-out hover:opacity-70"
      onClick={handleBack}
      type="button"
    >
      <ChevronLeftIcon size={18} />
      <span>Back</span>
    </button>
  );
};
