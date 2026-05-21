import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

/** Production domains that show the under-development page only. */
const UNDER_DEV_HOSTS = new Set(["samarammar.com", "www.samarammar.com"]);

export const PREVIEW_COOKIE = "sam3d-site-preview";

export function normalizeHost(host: string | null): string {
  return (host ?? "").split(":")[0].toLowerCase();
}

/** True when the site should serve only the under-development experience. */
export function isUnderDevelopmentSite(host: string | null): boolean {
  if (process.env.SITE_UNDER_DEVELOPMENT === "true") return true;
  return UNDER_DEV_HOSTS.has(normalizeHost(host));
}

export function getPreviewSecret(): string | undefined {
  const secret = process.env.SITE_PREVIEW_SECRET?.trim();
  return secret || undefined;
}

export async function previewCookieValue(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`sam3d-preview:${secret}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function verifyPreviewToken(token: string): boolean {
  const secret = getPreviewSecret();
  if (!secret) return false;
  return token === secret;
}

export async function isValidPreviewCookie(value: string | undefined): Promise<boolean> {
  const secret = getPreviewSecret();
  if (!secret || !value) return false;
  return value === (await previewCookieValue(secret));
}

export async function hasPreviewAccessFromRequest(request: NextRequest): Promise<boolean> {
  return isValidPreviewCookie(request.cookies.get(PREVIEW_COOKIE)?.value);
}

/** Public site is gated (under-development) for this host + no preview cookie. */
export async function isPublicSiteGated(
  host: string | null,
  previewCookie: string | undefined,
): Promise<boolean> {
  return isUnderDevelopmentSite(host) && !(await isValidPreviewCookie(previewCookie));
}

export async function setPreviewCookie(response: NextResponse): Promise<void> {
  const secret = getPreviewSecret();
  if (!secret) return;

  response.cookies.set(PREVIEW_COOKIE, await previewCookieValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
}

export function clearPreviewCookie(response: NextResponse): void {
  response.cookies.set(PREVIEW_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
