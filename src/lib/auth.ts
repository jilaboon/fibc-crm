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

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
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
}
