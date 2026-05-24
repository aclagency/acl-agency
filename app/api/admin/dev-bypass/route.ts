import { NextResponse } from "next/server";

const AUTH_TOKEN = "acl-cms-v1";

// Dev shortcut: hit /api/admin/dev-bypass in your browser → cookie set → redirected to /admin/import.
// No password required. Only works on localhost; refuses if NEXT_PUBLIC_ALLOW_DEV_BYPASS is unset.
export async function GET() {
  if (process.env.NEXT_PUBLIC_ALLOW_DEV_BYPASS !== "true") {
    return NextResponse.json({ error: "Dev bypass disabled in this environment" }, { status: 403 });
  }
  const res = NextResponse.redirect("http://localhost:3000/admin/import");
  res.cookies.set("cms_auth", AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
