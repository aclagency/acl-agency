import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "acl@admin";
const AUTH_TOKEN = "acl-cms-v1";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("cms_auth", AUTH_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("cms_auth");
  return res;
}
