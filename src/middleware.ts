import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isUnderDevelopmentSite } from "@/lib/siteMode";

export function middleware(request: NextRequest) {
  if (!isUnderDevelopmentSite(request.headers.get("host"))) {
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

  if (pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
