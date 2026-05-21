import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { HomePageClient } from "@/components/site/HomePageClient";
import { UnderDevelopment } from "@/components/site/UnderDevelopment";
import { createPageMetadata } from "@/lib/siteMetadata";
import { isPublicSiteGated, PREVIEW_COOKIE } from "@/lib/siteMode";

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host");
  const previewCookie = (await cookies()).get(PREVIEW_COOKIE)?.value;
  if (!(await isPublicSiteGated(host, previewCookie))) return {};

  return {
    ...createPageMetadata({
      title: "Under Development | samarammar",
      description:
        "The samarammar website is currently under development. A refined digital experience is coming soon.",
      path: "/",
      imageAlt: "samarammar — website under development",
    }),
    robots: { index: false, follow: false },
  };
}

export default async function Home() {
  const host = (await headers()).get("host");
  const previewCookie = (await cookies()).get(PREVIEW_COOKIE)?.value;

  if (await isPublicSiteGated(host, previewCookie)) {
    return <UnderDevelopment />;
  }

  return <HomePageClient />;
}
