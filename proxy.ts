import { NextRequest, NextResponse } from "next/server";

const AUTH_TOKEN = "acl-cms-v1";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("cms_auth")?.value;
    if (token !== AUTH_TOKEN) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
