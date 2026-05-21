import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Inter } from "next/font/google";
import { RootWithScroll } from "@/components/site/RootWithScroll";
import { ThemeSync } from "@/components/site/ThemeSync";
import { LanguageProvider } from "@/components/site/LanguageProvider";
import { rootMetadata } from "@/lib/siteMetadata";
import brandLogo from "../../white-logo.png";
import "./globals.css";

export const metadata: Metadata = {
  ...rootMetadata,
  icons: {
    icon: [{ url: brandLogo.src, type: "image/png" }],
    shortcut: [{ url: brandLogo.src }],
    apple: [{ url: brandLogo.src, type: "image/png" }],
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href={brandLogo.src} as="image" type="image/png" />
      </head>
      <body className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
        <Script id="sam3d-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("sam3d-theme");document.documentElement.setAttribute("data-theme",t==="light"||t==="dark"?t:"dark");var l=localStorage.getItem("sam3d-lang");if(l==="ar"||l==="en"){document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";}}catch(e){}})();`}
        </Script>
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
