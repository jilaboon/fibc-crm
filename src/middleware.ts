import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = ["/login", "/signup", "/auth/callback", "/api"];
const referralPattern = /^\/r\/[^/]+/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and referral landing pages
  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    referralPattern.test(pathname)
  ) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  // Refresh session & get user
  const { user, supabase, supabaseResponse } = await updateSession(request);

  // Redirect unauthenticated users to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") {
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  // Role-based routing
  const { data: profile } = await supabase
    .from("UserProfile")
    .select("role")
    .eq("userId", user.id)
    .single();

  if (profile) {
    // AMBASSADOR → only portal
    if (profile.role === "AMBASSADOR" && !pathname.startsWith("/portal")) {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url));
    }

    // Non-AMBASSADOR trying to access portal → dashboard
    if (profile.role !== "AMBASSADOR" && pathname.startsWith("/portal")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Settings only for ADMIN
    if (pathname.startsWith("/settings") && profile.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
