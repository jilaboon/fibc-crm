import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export type AuthContext = {
  userId: string;
  role: string;
  profile: {
    id: string;
    fullName: string;
    email: string;
  };
};

export const getAuthContext = cache(async (): Promise<AuthContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    select: { id: true, fullName: true, email: true, role: true },
  });

  if (!profile) redirect("/login");

  return {
    userId: user.id,
    role: profile.role,
    profile: {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
    },
  };
});
