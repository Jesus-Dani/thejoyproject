import { NextResponse } from "next/server";
import { cookieNameFor } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/checkin/login", req.url));
  res.cookies.delete(cookieNameFor("checkin"));
  return res;
}
