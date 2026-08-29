import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cairo, Inter } from "next/font/google";
import { RootWithScroll } from "@/components/layout/RootWithScroll";
import { ThemeSync } from "@/components/providers/ThemeSync";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { rootMetadata } from "@/lib/siteMetadata";
import brandLogo from "@/assets/brand/white-logo.png";
import "./globals.css";

export const metadata: Metadata = {
  ...rootMetadata,
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png", type: "image/png" }],
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
  colorScheme: "dark",
  themeColor: "#161514",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preload" href={brandLogo.src} as="image" type="image/png" />
      </head>
      <body className={`${inter.variable} ${cairo.variable}`} suppressHydrationWarning>
        <Script id="sam3d-theme-init" strategy="beforeInteractive">
          {`(function(){try{var g=location.pathname.indexOf("/gallery")===0;var t=g?"dark":localStorage.getItem("sam3d-theme");document.documentElement.setAttribute("data-theme",t==="light"||t==="dark"?t:"dark");var l=localStorage.getItem("sam3d-lang");if(l==="ar"||l==="en"){document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";}}catch(e){}})();`}
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
