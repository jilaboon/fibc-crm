import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const { data } = await supabase.auth.admin.listUsers();
  const user = data?.users.find((u) => u.email === "gillavon@gmail.com");

  if (!user) {
    console.log("No Supabase auth user found for gillavon@gmail.com");
    return;
  }

  console.log("Supabase auth user:");
  console.log("  id:", user.id);
  console.log("  email:", user.email);
  console.log("  confirmed:", user.email_confirmed_at ? "yes" : "NO");
  console.log("  user_metadata:", JSON.stringify(user.user_metadata));
  console.log("  app_metadata:", JSON.stringify(user.app_metadata));

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    console.log("\nUserProfile:");
    console.log("  role:", profile.role);
    console.log("  isActive:", profile.isActive);
    console.log("  fullName:", profile.fullName);
  } else {
    console.log("\nNO UserProfile found for this userId!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
