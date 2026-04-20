import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RootWithScroll } from "@/components/site/RootWithScroll";
import { ThemeSync } from "@/components/site/ThemeSync";
import { LanguageProvider } from "@/components/site/LanguageProvider";
import brandLogo from "../../white-logo.png";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "samarammar",
  description:
    "samarammar is a premium design brand led by Samar, blending architectural precision with timeless elegance.",
  icons: {
    icon: brandLogo.src,
    shortcut: brandLogo.src,
    apple: brandLogo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <RootWithScroll>
          <LanguageProvider>
            <ThemeSync />
            {children}
          </LanguageProvider>
        </RootWithScroll>
      </body>
    </html>
  );
}
