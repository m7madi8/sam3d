/** Production domains that show the under-development page only. */
const UNDER_DEV_HOSTS = new Set(["samarammar.com", "www.samarammar.com"]);

export function normalizeHost(host: string | null): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

/** True when the site should serve only the under-development experience. */
export function isUnderDevelopmentSite(host: string | null): boolean {
  if (process.env.SITE_UNDER_DEVELOPMENT === "true") return true;
  return UNDER_DEV_HOSTS.has(normalizeHost(host));
}
