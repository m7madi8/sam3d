const PROJECT_TITLES_EN: Record<string, string[]> = {
  interior: ["Palm Villa", "Duplex Apartment", "Guest House", "Reception Hall", "Modern Living"],
  landscape: ["Rooftop Garden", "Pool Terrace", "Shade Walk", "Inner Courtyard", "Front Layout"],
  architectural: ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"],
  commercial: ["Jewelry Store", "Office", "Restaurant", "Cafe", "Clothing Store"],
};

const PROJECT_TITLES_AR: Record<string, string[]> = {
  interior: ["فيلا النخيل", "شقة دوبلكس", "بيت الضيافة", "قاعة استقبال", "معيشة عصرية"],
  landscape: ["حديقة السطح", "تراس المسبح", "ممشى الظل", "فناء داخلي", "تنسيق الواجهة"],
  architectural: ["واجهة المبنى A", "الجناح الشرقي", "المدخل الرئيسي", "برج سكني", "مبنى مكاتب"],
  commercial: ["متجر مجوهرات", "مكتب", "مطعم", "مقهى", "متجر ملابس"],
};

const CATEGORY_EN: Record<string, string> = {
  interior: "Interior",
  landscape: "Landscape",
  architectural: "Architectural",
  commercial: "Commercial",
};

const CATEGORY_AR: Record<string, string> = {
  interior: "داخلي",
  landscape: "لاندسكيب",
  architectural: "معماري",
  commercial: "تجاري",
};

export function getProjectDisplayLabels(projectId: string) {
  const match = projectId.match(/^(interior|landscape|architectural|commercial)-(\d+)$/);
  if (!match) return null;

  const categoryKey = match[1];
  const index = Number(match[2]) - 1;
  if (index < 0 || index >= 5) return null;

  return {
    titleEn: PROJECT_TITLES_EN[categoryKey]?.[index],
    titleAr: PROJECT_TITLES_AR[categoryKey]?.[index],
    categoryEn: CATEGORY_EN[categoryKey],
    categoryAr: CATEGORY_AR[categoryKey],
  };
}
