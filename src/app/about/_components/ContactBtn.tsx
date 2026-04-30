"use client";

import { toast } from "sonner";
import {
  GithubIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/icons";
import { ABOUT } from "@/constants/about.constants";

const ICON_MAP = {
  phone: PhoneIcon,
  mail: MailIcon,
  linkedin: LinkedInIcon,
  github: GithubIcon,
} as const;

const cardClass =
  "flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-border bg-background hover:bg-gray-hover transition-colors";

const labelClass = "text-sm font-medium text-gray-bold";

export const ContactButtons = () => {
  const handleCopy = async (text: string, copyType: "phone" | "email") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(
        copyType === "phone"
          ? "전화번호를 클립보드에 복사했어요"
          : "메일 주소를 클립보드에 복사했어요",
      );
    } catch {
      toast.error(
        "복사에 실패했어요. 브라우저에서 클립보드 권한을 확인해 주세요.",
      );
    }
  };

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2 w-full">
      {ABOUT.contacts.map((contact) => {
        const Icon = ICON_MAP[contact.icon];

        if (contact.type === "copy") {
          return (
            <button
              key={contact.label}
              type="button"
              onClick={() => void handleCopy(contact.value, contact.copyType)}
              className={`${cardClass} cursor-pointer`}
              aria-label={
                contact.copyType === "phone"
                  ? "Copy phone number"
                  : "Copy email address"
              }
            >
              <Icon size={20} />
              <span className={labelClass}>{contact.label}</span>
            </button>
          );
        }

        return (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className={cardClass}
            aria-label={contact.label}
          >
            <Icon size={20} />
            <span className={labelClass}>{contact.label}</span>
          </a>
        );
      })}
    </div>
  );
};
