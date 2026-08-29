/** Verified studio facts — single source for about proof and marketing copy. */
export const STUDIO_STATS = {
  yearsExperience: 10,
  yearsDisplay: "10",
  projects: 1000,
  projectsDisplay: "1000+",
} as const;

export type StudioStatKey = "experience" | "projects" | "global";

export type StudioStatEntry = {
  key: StudioStatKey;
  value: string;
  label: string;
  display: "numeric" | "phrase";
};

export function getStudioStatEntries(locale: "en" | "ar"): StudioStatEntry[] {
  if (locale === "ar") {
    return [
      { key: "experience", value: STUDIO_STATS.yearsDisplay, label: "سنوات خبرة", display: "numeric" },
      { key: "projects", value: STUDIO_STATS.projectsDisplay, label: "مشروع", display: "numeric" },
      { key: "global", value: "حول العالم", label: "انتشار الاستوديو", display: "phrase" },
    ];
  }

  return [
    {
      key: "experience",
      value: STUDIO_STATS.yearsDisplay,
      label: "Years of experience",
      display: "numeric",
    },
    {
      key: "projects",
      value: STUDIO_STATS.projectsDisplay,
      label: "Projects",
      display: "numeric",
    },
    { key: "global", value: "Worldwide", label: "Studio reach", display: "phrase" },
  ];
}
