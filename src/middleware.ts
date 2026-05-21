import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  hasPreviewAccessFromRequest,
  isUnderDevelopmentSite,
  setPreviewCookie,
  verifyPreviewToken,
} from "@/lib/siteMode";

const ALLOWED_WHEN_GATED = new Set(["/", "/preview"]);

export async function middleware(request: NextRequest) {
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

  const { pathname } = request.nextUrl;

  if (
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
