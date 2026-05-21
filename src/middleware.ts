import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  hasPreviewAccessFromRequest,
  isUnderDevelopmentSite,
  setPreviewCookie,
  verifyPreviewToken,
} from "@/lib/siteMode";

const ALLOWED_WHEN_GATED = new Set(["/", "/preview"]);

/** Next.js metadata icon routes + common favicon paths — must not redirect when gated */
const ICON_PATHS = new Set(["/icon", "/apple-icon", "/favicon.ico", "/icon.png"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/favicon.ico") {
    return NextResponse.rewrite(new URL("/icon.png", request.url));
  }

  if (!isUnderDevelopmentSite(request.headers.get("host"))) {
    return NextResponse.next();
  }

  const previewToken = request.nextUrl.searchParams.get("preview");
  if (previewToken && verifyPreviewToken(previewToken)) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("preview");
    const redirect = NextResponse.redirect(clean);
    await setPreviewCookie(redirect);
    return redirect;
  }

  if (await hasPreviewAccessFromRequest(request)) {
    return NextResponse.next();
  }

  if (
    ICON_PATHS.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(?:ico|png|jpe?g|webp|svg|gif|woff2?|css|js|map)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (ALLOWED_WHEN_GATED.has(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
