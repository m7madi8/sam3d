import { UnderDevelopment } from "@/components/site/UnderDevelopment";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = {
  ...createPageMetadata({
    title: "Under Development | samarammar",
    description:
      "The samarammar website is currently under development. A refined digital experience is coming soon.",
    path: "/under-development",
    imageAlt: "samarammar — website under development",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnderDevelopmentPage() {
  return <UnderDevelopment />;
}
