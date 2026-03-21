import { notFound } from "next/navigation";
import { RequestServiceForm } from "@/components/site/RequestServiceForm";
import { services } from "@/content/capsules";

type PageProps = { params: Promise<{ service: string }> };

const VALID_SERVICES = new Set(services.map((s) => s.id));

export async function generateMetadata({ params }: PageProps) {
  const { service } = await params;
  if (!VALID_SERVICES.has(service)) return { title: "Request Service | samarammar" };
  const s = services.find((x) => x.id === service);
  return {
    title: `Request ${s?.title ?? service} | samarammar`,
    description: `Request ${s?.title ?? service} — service request form`,
  };
}

export default async function RequestServicePage({ params }: PageProps) {
  const { service } = await params;
  if (!VALID_SERVICES.has(service)) notFound();
  const s = services.find((x) => x.id === service)!;
  return <RequestServiceForm serviceId={s.id} serviceTitle={s.title} />;
}
