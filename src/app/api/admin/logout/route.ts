import { NextResponse } from "next/server";
import { cookieNameFor } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));
  res.cookies.delete(cookieNameFor("admin"));
  return res;
}
