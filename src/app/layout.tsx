
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PORTFOLIO_URL, SITE_NAME, SITE_URL } from "@/constants/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // makes relative canonical/OG URLs absolute
  title: {
    default: `${SITE_NAME} | Developer blog`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A developer blog about web development, JavaScript/TypeScript, and the projects I build.",
  authors: [{ name: "Miraj Gautam", url: PORTFOLIO_URL }],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}