import { ROUTES } from "@constants/menu.constants";
import { generatePageMetadata } from "@utils/metadata-util";
import type { Metadata } from "next";

const AboutPage = () => (
  <div className="column w-full gap-6 px-[var(--spacing-inline)] py-10 tablet:py-16"></div>
);

export default AboutPage;

export const generateMetadata = async (): Promise<Metadata> =>
  generatePageMetadata({ title: "About", path: ROUTES.ABOUT });
