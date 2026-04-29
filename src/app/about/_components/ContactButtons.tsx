import { ABOUT } from "@constants/about.constants";

const links = [
  { label: "GitHub", href: ABOUT.profile.github },
  { label: "Instagram", href: ABOUT.profile.instagram },
  { label: "Email", href: `mailto:${ABOUT.profile.email}` },
];

export const ContactButtons = () => (
  <div className="row flex-wrap gap-2">
    {links.map(({ label, href }) => (
      <a
        className="ui-chip h6 px-3 py-1.5 text-[var(--color-gray-mid)] transition-colors hover:text-[var(--color-gray-accent)]"
        href={href}
        key={label}
        rel="noopener noreferrer"
        target={href.startsWith("mailto") ? undefined : "_blank"}
      >
        {label}
      </a>
    ))}
  </div>
);
