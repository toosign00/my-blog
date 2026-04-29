import "@styles/globals.css";

import { GeistMono, Pretendard } from "@assets/font";
import appleTouchIcon from "@assets/icons/apple-icon.png";
import siteIcon from "@assets/icons/icon.svg";
import { Layout } from "@components/layout/Root";
import { METADATA } from "@constants/metadata.constants";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang={METADATA.SITE.LANGUAGE} suppressHydrationWarning>
      <body
        className={twMerge(
          Pretendard.variable,
          Pretendard.className,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

const siteIconUrl = typeof siteIcon === "string" ? siteIcon : siteIcon.src;

export const metadata: Metadata = {
  title: METADATA.SITE.NAME,
  description: METADATA.SITE.DESCRIPTION,
  metadataBase: new URL(METADATA.SITE.URL),
  icons: {
    icon: [{ url: siteIconUrl, type: "image/svg+xml" }],
    apple: [{ url: appleTouchIcon.src, type: "image/png" }],
  },
  openGraph: {
    title: METADATA.SITE.NAME,
    description: METADATA.SITE.DESCRIPTION,
    url: METADATA.SITE.URL,
    siteName: METADATA.SITE.NAME,
    images: [
      {
        url: METADATA.SITE.PREVIEW_IMAGE,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: METADATA.SITE.NAME,
    description: METADATA.SITE.DESCRIPTION,
    images: [METADATA.SITE.PREVIEW_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: METADATA.SITE.URL,
  },
  generator: "Next.js",
  applicationName: METADATA.SITE.NAME,
  creator: METADATA.AUTHOR.NAME,
  publisher: METADATA.AUTHOR.NAME,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
