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

function generateReferralCode(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}

async function main() {
  const { data } = await supabase.auth.admin.listUsers();
  const user = data?.users.find((u) => u.email === "gillavon@gmail.com");

  if (!user) {
    console.log("No Supabase auth user found for gillavon@gmail.com");
    return;
  }

  console.log("Found auth user:", user.id);

  // Set role back to AMBASSADOR in Supabase metadata
  await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, role: "AMBASSADOR" },
    app_metadata: { ...user.app_metadata, role: "AMBASSADOR" },
  });
  console.log("Set Supabase metadata role to AMBASSADOR");

  // Update UserProfile role to AMBASSADOR
  let profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: { role: "AMBASSADOR" },
    });
    console.log("Updated UserProfile role to AMBASSADOR");
  } else {
    profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        role: "AMBASSADOR",
        fullName: "Gil Lavon",
        email: "gillavon@gmail.com",
      },
    });
    console.log("Created UserProfile with AMBASSADOR role");
  }

  // Check if Ambassador record already exists
  const existing = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });

  if (existing) {
    console.log("Ambassador record already exists:", existing.id);
  } else {
    const ambassador = await prisma.ambassador.create({
      data: {
        fullName: "Gil Lavon",
        email: "gillavon@gmail.com",
        country: "Israel",
        city: "Tel Aviv",
        languages: "Hebrew, English",
        referralCode: generateReferralCode("Gil Lavon"),
        userProfileId: profile.id,
      },
    });
    console.log("Created Ambassador record:", ambassador.id);
    console.log("Referral code:", ambassador.referralCode);
  }

  console.log("\nDone! gillavon@gmail.com is now AMBASSADOR with a linked Ambassador record.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
