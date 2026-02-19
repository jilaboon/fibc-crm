import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPaths = ["/login", "/signup", "/auth/callback", "/api"];
const referralPattern = /^\/r\/[^/]+/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh session once for all paths
  const { user, supabase, supabaseResponse } = await updateSession(request);

  // Allow public paths and referral landing pages
  if (
    publicPaths.some((p) => pathname.startsWith(p)) ||
    referralPattern.test(pathname)
  ) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") {
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  // Try to get role from user metadata (JWT, no DB query) first,
  // then fall back to DB query only if metadata is missing
  let role: string | null =
    (user.app_metadata?.role as string) ??
    (user.user_metadata?.role as string) ??
    null;

  // Check isActive — read from metadata, fall back to DB
  let isActive: boolean | null =
    user.app_metadata?.is_active as boolean | null ?? null;

  if (!role || isActive === null) {
    const { data: profile } = await supabase
      .from("UserProfile")
      .select("role, isActive")
      .eq("userId", user.id)
      .single();

    if (profile) {
      role = role ?? profile.role;
      isActive = profile.isActive;
    }
  }

  // Block inactive users — sign them out and redirect to login
  if (isActive === false) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "inactive");
    const response = NextResponse.redirect(url);
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    // Delete all supabase auth cookies
    for (const cookie of request.cookies.getAll()) {
      if (cookie.name.startsWith("sb-")) {
        response.cookies.delete(cookie.name);
      }
    }
    return response;
  }

  if (role) {
    // AMBASSADOR → only portal
    if (role === "AMBASSADOR" && !pathname.startsWith("/portal")) {
      return NextResponse.redirect(new URL("/portal/dashboard", request.url));
    }

    // Non-AMBASSADOR trying to access portal → dashboard
    if (role !== "AMBASSADOR" && pathname.startsWith("/portal")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Settings only for ADMIN
    if (pathname.startsWith("/settings") && role !== "ADMIN") {
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
