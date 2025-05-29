import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import publicPaths from "@/publicPaths";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicPath = publicPaths.includes(pathname);

  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except these:
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|css|js)).*)',
  ],
};
