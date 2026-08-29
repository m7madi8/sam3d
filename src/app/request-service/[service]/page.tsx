import { notFound } from "next/navigation";
import { RequestServiceForm } from "@/components/forms/RequestServiceForm";
import { services } from "@/content/capsules";
import { createPageMetadata } from "@/lib/siteMetadata";

type PageProps = { params: Promise<{ service: string }> };

const VALID_SERVICES = new Set(services.map((s) => s.id));

export function generateStaticParams() {
  return services.map((service) => ({ service: service.id }));
}

const SERVICE_TITLE_AR: Record<string, string> = {
  interior: "طلب تصميم داخلي",
  landscape: "طلب تصميم لاندسكيب",
  architectural: "طلب تصميم معماري",
  commercial: "طلب تصميم تجاري",
};

export async function generateMetadata({ params }: PageProps) {
  const { service } = await params;
  if (!VALID_SERVICES.has(service)) {
    return createPageMetadata({
      title: "Request Service",
      path: `/request-service/${service}`,
    });
  }
  const s = services.find((x) => x.id === service)!;
  const titleAr = SERVICE_TITLE_AR[service] ?? "طلب خدمة";

  return createPageMetadata({
    title: `Request ${s.title}`,
    description: `${s.description} | ${titleAr} — سمر عمار، رام الله.`,
    path: `/request-service/${service}`,
    imageAlt: `Request ${s.title} — samarammar`,
  });
}

export default async function RequestServicePage({ params }: PageProps) {
  const { service } = await params;
  if (!VALID_SERVICES.has(service)) notFound();
  const s = services.find((x) => x.id === service)!;
  return (
    <RequestServiceForm
      serviceId={s.id}
      serviceTitle={s.title}
      serviceDescription={s.description}
    />
  );
}
