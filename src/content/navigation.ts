export type SiteMenuItemSource = {
  label: string;
  labelAr: string;
  link: string;
  ariaLabel: string;
  ariaAr: string;
};

/** Site order: Home → Gallery → About → Services → Contact */
export const SITE_MENU_ITEMS: readonly SiteMenuItemSource[] = [
  {
    label: "Home",
    labelAr: "الرئيسية",
    link: "/#hero",
    ariaLabel: "Go to home section",
    ariaAr: "الذهاب لقسم الرئيسية",
  },
  {
    label: "Gallery",
    labelAr: "المعرض",
    link: "/gallery",
    ariaLabel: "Go to gallery page",
    ariaAr: "الذهاب لصفحة المعرض",
  },
  {
    label: "About",
    labelAr: "من نحن",
    link: "/#about",
    ariaLabel: "Go to about section",
    ariaAr: "الذهاب لقسم من نحن",
  },
  {
    label: "Services",
    labelAr: "الخدمات",
    link: "/#services",
    ariaLabel: "Go to services section",
    ariaAr: "الذهاب لقسم الخدمات",
  },
  {
    label: "Contact",
    labelAr: "تواصل",
    link: "/#contact",
    ariaLabel: "Go to contact section",
    ariaAr: "الذهاب لقسم التواصل",
  },
] as const;

export function getSiteMenuItems(tr: (en: string, ar: string) => string) {
  return SITE_MENU_ITEMS.map((item) => ({
    label: tr(item.label, item.labelAr),
    link: item.link,
    ariaLabel: tr(item.ariaLabel, item.ariaAr),
  }));
}
