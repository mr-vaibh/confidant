
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import publicPaths from "@/publicPaths";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  
  if (!accessToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}


export const config = {
  matcher: ["/((?!api|signup|auth|_next/static|_next/image|.*\\.png$).*)"],
};