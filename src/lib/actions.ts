"use server";

import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

function generateReferralCode(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${slug}-${suffix}`;
}

export async function createAmbassador(formData: FormData) {
  await getAuthContext();

  const fullName = formData.get("fullName") as string;
  const ambassador = await prisma.ambassador.create({
    data: {
      fullName,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      country: (formData.get("country") as string) || "Israel",
      city: formData.get("city") as string,
      languages: formData.get("languages") as string,
      hostsEvents: formData.get("hostsEvents") === "true",
      referralCode: generateReferralCode(fullName),
    },
  });
  revalidatePath("/ambassadors");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("dashboard", { expire: 0 });
  return ambassador;
}

export async function createLead(formData: FormData) {
  await getAuthContext();

  const ambassadorId = formData.get("ambassadorId") as string | null;

  const lead = await prisma.lead.create({
    data: {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      country: (formData.get("country") as string) || "Israel",
      city: (formData.get("city") as string) || null,
      budget: (formData.get("budget") as string) || null,
      preferredArea: (formData.get("preferredArea") as string) || null,
      rooms: (formData.get("rooms") as string) || null,
      propertyType: (formData.get("propertyType") as string) || null,
      readiness: (formData.get("readiness") as string) || null,
      notes: (formData.get("notes") as string) || null,
      source: "manual",
      ambassadorId: ambassadorId || null,
    },
  });

  if (ambassadorId) {
    await prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { totalReferrals: { increment: 1 } },
    });
  }

  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/ambassadors");
  return lead;
}

export async function assignAmbassador(leadId: string, ambassadorId: string) {
  await getAuthContext();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const hadAmbassador = !!lead.ambassadorId;

  await prisma.lead.update({
    where: { id: leadId },
    data: { ambassadorId },
  });

  if (!hadAmbassador) {
    await prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { totalReferrals: { increment: 1 } },
    });
  }

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/ambassadors");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
}

export async function matchToDeveloper(leadId: string, developerId: string) {
  await getAuthContext();

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { deals: true },
  });
  if (!lead) throw new Error("Lead not found");

  if (lead.deals.length > 0) {
    throw new Error("Lead already has an active deal");
  }

  await prisma.deal.create({
    data: {
      leadId,
      developerId,
      ambassadorId: lead.ambassadorId,
      stage: "Negotiation",
    },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "Matched" },
  });

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("developers", { expire: 0 });
}

export async function updateDealStage(dealId: string, stage: string) {
  await getAuthContext();

  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new Error("Deal not found");

  const wasAlreadyClosedWon = deal.stage === "ClosedWon";

  await prisma.deal.update({
    where: { id: dealId },
    data: { stage },
  });

  if (stage === "ClosedWon") {
    await prisma.lead.update({
      where: { id: deal.leadId },
      data: { status: "ClosedWon" },
    });

    if (!wasAlreadyClosedWon && deal.ambassadorId) {
      await prisma.ambassador.update({
        where: { id: deal.ambassadorId },
        data: { closedDeals: { increment: 1 } },
      });
    }
  } else if (stage === "ClosedLost") {
    await prisma.lead.update({
      where: { id: deal.leadId },
      data: { status: "ClosedLost" },
    });
  }

  revalidatePath(`/leads/${deal.leadId}`);
  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/ambassadors");
  if (stage === "ClosedWon" || stage === "ClosedLost") {
    revalidateTag("developers", { expire: 0 });
  }
}

export async function getLeadSuggestions(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.preferredArea) return [];

  const developers = await prisma.developer.findMany();

  return developers.filter((dev) => {
    const areas = dev.buildAreas.split(",").map((a) => a.trim().toLowerCase());
    return areas.includes(lead.preferredArea!.toLowerCase());
  });
}

// --- User Management Actions (ADMIN only) ---

export async function inviteUser(formData: FormData) {
  const { role } = await getAuthContext();
  if (role !== "ADMIN") throw new Error("רק מנהלים יכולים להזמין משתמשים");

  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const invitedRole = formData.get("role") as string;

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password: formData.get("password") as string,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: invitedRole },
    app_metadata: { role: invitedRole },
  });

  if (error) throw new Error(error.message);

  const profile = await prisma.userProfile.create({
    data: {
      userId: data.user.id,
      role: invitedRole,
      fullName,
      email,
    },
  });

  // Automatically create Ambassador record when role is AMBASSADOR
  if (invitedRole === "AMBASSADOR") {
    await prisma.ambassador.create({
      data: {
        fullName,
        email,
        country: (formData.get("country") as string) || "Israel",
        city: (formData.get("city") as string) || "",
        languages: (formData.get("languages") as string) || "עברית",
        referralCode: generateReferralCode(fullName),
        userProfileId: profile.id,
      },
    });
  }

  revalidatePath("/settings/users");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/ambassadors");
}

export async function updateUserRole(userId: string, newRole: string) {
  const { role } = await getAuthContext();
  if (role !== "ADMIN") throw new Error("רק מנהלים יכולים לשנות תפקידים");

  const profile = await prisma.userProfile.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // Sync role to Supabase metadata so middleware can read it from JWT
  const adminClient = createAdminClient();
  await adminClient.auth.admin.updateUserById(profile.userId, {
    user_metadata: { role: newRole },
    app_metadata: { role: newRole },
  });

  revalidatePath("/settings/users");
}

export async function toggleUserActive(userId: string) {
  const { role } = await getAuthContext();
  if (role !== "ADMIN") throw new Error("רק מנהלים יכולים לנהל משתמשים");

  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
  });
  if (!profile) throw new Error("User not found");

  const newIsActive = !profile.isActive;

  await prisma.userProfile.update({
    where: { id: userId },
    data: { isActive: newIsActive },
  });

  // Sync to Supabase metadata so middleware can check without DB query
  const adminClient = createAdminClient();
  await adminClient.auth.admin.updateUserById(profile.userId, {
    app_metadata: { is_active: newIsActive },
  });

  revalidatePath("/settings/users");
}

// --- Public Referral Action (no auth) ---

export async function submitReferral(formData: FormData) {
  const ambassadorId = formData.get("ambassadorId") as string;
  const referralCode = formData.get("referralCode") as string;

  const ambassador = await prisma.ambassador.findFirst({
    where: { id: ambassadorId, referralCode },
  });
  if (!ambassador) throw new Error("Invalid referral");

  const lead = await prisma.lead.create({
    data: {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      budget: (formData.get("budget") as string) || null,
      preferredArea: (formData.get("preferredArea") as string) || null,
      rooms: (formData.get("rooms") as string) || null,
      propertyType: (formData.get("propertyType") as string) || null,
      readiness: (formData.get("readiness") as string) || null,
      notes: (formData.get("notes") as string) || null,
      source: "referral",
      referralCode,
      ambassadorId,
      status: "New",
    },
  });

  await prisma.ambassador.update({
    where: { id: ambassadorId },
    data: { totalReferrals: { increment: 1 } },
  });

  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("ambassadors", { expire: 0 });
  return { success: true, leadId: lead.id };
}

// --- Delete Actions ---

export async function deleteLead(leadId: string) {
  await getAuthContext();

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { deals: true },
  });
  if (!lead) throw new Error("ליד לא נמצא");

  // Delete deals first, then the lead
  if (lead.deals.length > 0) {
    await prisma.deal.deleteMany({ where: { leadId } });
  }

  // Decrement ambassador referral count if linked
  if (lead.ambassadorId) {
    await prisma.ambassador.update({
      where: { id: lead.ambassadorId },
      data: { totalReferrals: { decrement: 1 } },
    });
  }

  await prisma.lead.delete({ where: { id: leadId } });

  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("ambassadors", { expire: 0 });
  revalidatePath("/ambassadors");
}

export async function deleteDeveloper(developerId: string) {
  await getAuthContext();

  const developer = await prisma.developer.findUnique({
    where: { id: developerId },
    include: { deals: true },
  });
  if (!developer) throw new Error("יזם לא נמצא");

  if (developer.deals.length > 0) {
    await prisma.deal.deleteMany({ where: { developerId } });
  }

  await prisma.developer.delete({ where: { id: developerId } });

  revalidatePath("/developers");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("developers", { expire: 0 });
}

export async function deleteAmbassador(
  ambassadorId: string,
  deleteLeads: boolean
) {
  await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { id: ambassadorId },
    include: { leads: { include: { deals: true } }, deals: true },
  });
  if (!ambassador) throw new Error("שגריר לא נמצא");

  // Delete deals linked directly to ambassador
  if (ambassador.deals.length > 0) {
    await prisma.deal.deleteMany({ where: { ambassadorId } });
  }

  if (deleteLeads) {
    // Delete all leads and their deals
    for (const lead of ambassador.leads) {
      if (lead.deals.length > 0) {
        await prisma.deal.deleteMany({ where: { leadId: lead.id } });
      }
    }
    await prisma.lead.deleteMany({ where: { ambassadorId } });
  } else {
    // Unlink leads from this ambassador
    await prisma.lead.updateMany({
      where: { ambassadorId },
      data: { ambassadorId: null },
    });
  }

  // Unlink user profile if exists
  if (ambassador.userProfileId) {
    await prisma.userProfile.update({
      where: { id: ambassador.userProfileId },
      data: {},
    });
  }

  await prisma.ambassador.delete({ where: { id: ambassadorId } });

  revalidatePath("/ambassadors");
  revalidatePath("/leads");
  revalidateTag("dashboard", { expire: 0 });
  revalidatePath("/dashboard");
  revalidateTag("ambassadors", { expire: 0 });
}
