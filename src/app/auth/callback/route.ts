import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if user profile exists
      const existing = await prisma.userProfile.findUnique({
        where: { userId: user.id },
      });

      if (!existing) {
        // First login — create profile with ADMIN role
        await prisma.userProfile.create({
          data: {
            userId: user.id,
            role: "ADMIN",
            fullName:
              user.user_metadata?.full_name || user.email?.split("@")[0] || "",
            email: user.email || "",
          },
        });
      }
    }
  }

  return NextResponse.redirect(new URL("/dashboard", origin));
}
