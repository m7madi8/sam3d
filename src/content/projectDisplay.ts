const PROJECT_TITLES_EN: Record<string, string[]> = {
  interior: ["Palm Villa", "Duplex Apartment", "Guest House", "Reception Hall", "Modern Living"],
  landscape: ["Wedding Hall", "Palace Garden", "Villa Garden", "Terraced Garden", "Estate Landscape"],
  exterior: ["Building A Facade", "East Wing", "Main Entrance", "Residential Tower", "Office Block"],
  architectural: ["Villa Al-Masyoun", "Cultural Center", "House on the Hill", "Extension & Renovation", "Mixed-Use Block"],
  commercial: ["Jewelry Store", "Office", "Restaurant", "Cafe", "Clothing Store"],
};

const PROJECT_TITLES_AR: Record<string, string[]> = {
  interior: ["فيلا النخيل", "شقة دوبلكس", "بيت الضيافة", "قاعة استقبال", "معيشة عصرية"],
  landscape: ["قاعة أفراح", "حديقة قصر", "حديقة فيلا", "حديقة مدرّجة", "لاندسكيب عقار"],
  exterior: ["واجهة المبنى A", "الجناح الشرقي", "المدخل الرئيسي", "برج سكني", "مبنى مكاتب"],
  architectural: ["فيلا المصيون", "مركز ثقافي", "بيت على التل", "توسعة وترميم", "مبنى متعدد الاستخدام"],
  commercial: ["متجر مجوهرات", "مكتب", "مطعم", "مقهى", "متجر ملابس"],
};

const CATEGORY_EN: Record<string, string> = {
  interior: "Interior",
  landscape: "Landscape",
  exterior: "Exterior",
  architectural: "Architectural",
  commercial: "Commercial",
};

const CATEGORY_AR: Record<string, string> = {
  interior: "داخلي",
  landscape: "لاندسكيب",
  exterior: "خارجي",
  architectural: "معماري",
  commercial: "تجاري",
};

export function getProjectDisplayLabels(projectId: string) {
  const match = projectId.match(/^(interior|landscape|exterior|architectural|commercial)-(\d+)$/);
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
