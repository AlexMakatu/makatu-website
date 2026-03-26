import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin routes
  if (pathname.startsWith("/rates")) {
    const key = req.cookies.get("adminKey");

    if (!key || key.value !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
