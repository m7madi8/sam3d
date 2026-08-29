import { UnderDevelopment } from "@/components/forms/UnderDevelopment";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = {
  ...createPageMetadata({
    title: "Under Development",
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
