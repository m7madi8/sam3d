"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Loader } from "@/components/site/Loader";

const NarrativeExperience = dynamic(
  () =>
    import("@/components/site/NarrativeExperience").then((mod) => ({
      default: mod.NarrativeExperience,
    })),
  { ssr: false },
);

export function HomePageClient() {
  const [introReady, setIntroReady] = useState(false);
  const handleLoaderComplete = useCallback(() => setIntroReady(true), []);

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />
      <NarrativeExperience introReady={introReady} />
    </>
  );
}
