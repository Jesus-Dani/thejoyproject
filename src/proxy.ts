import { NextResponse, type NextRequest } from "next/server";
import { cookieNameFor, verifySessionCookieValue } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isCheckin = pathname.startsWith("/checkin") && pathname !== "/checkin/login";

  if (!isAdmin && !isCheckin) return NextResponse.next();

  const role = isAdmin ? "admin" : "checkin";
  const cookie = req.cookies.get(cookieNameFor(role))?.value;
  const authed = await verifySessionCookieValue(cookie, role);

  if (!authed) {
    const loginUrl = new URL(isAdmin ? "/admin/login" : "/checkin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkin/:path*"],
};
