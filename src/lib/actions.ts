"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAmbassador(formData: FormData) {
  const ambassador = await prisma.ambassador.create({
    data: {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      country: (formData.get("country") as string) || "Israel",
      city: formData.get("city") as string,
      languages: formData.get("languages") as string,
      hostsEvents: formData.get("hostsEvents") === "true",
    },
  });
  revalidatePath("/ambassadors");
  revalidatePath("/dashboard");
  return ambassador;
}

export async function createLead(formData: FormData) {
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
      ambassadorId: ambassadorId || null,
    },
  });

  // Increment ambassador referrals if assigned
  if (ambassadorId) {
    await prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { totalReferrals: { increment: 1 } },
    });
  }

  revalidatePath("/leads");
  revalidatePath("/dashboard");
  revalidatePath("/ambassadors");
  return lead;
}

export async function assignAmbassador(leadId: string, ambassadorId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const hadAmbassador = !!lead.ambassadorId;

  await prisma.lead.update({
    where: { id: leadId },
    data: { ambassadorId },
  });

  // Only increment referrals on first assignment
  if (!hadAmbassador) {
    await prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { totalReferrals: { increment: 1 } },
    });
  }

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath("/ambassadors");
  revalidatePath("/dashboard");
}

export async function matchToDeveloper(leadId: string, developerId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { deals: true },
  });
  if (!lead) throw new Error("Lead not found");

  // Prevent duplicate deals
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
  revalidatePath("/dashboard");
}

export async function updateDealStage(dealId: string, stage: string) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) throw new Error("Deal not found");

  const wasAlreadyClosedWon = deal.stage === "ClosedWon";

  await prisma.deal.update({
    where: { id: dealId },
    data: { stage },
  });

  // Update lead status based on deal stage
  if (stage === "ClosedWon") {
    await prisma.lead.update({
      where: { id: deal.leadId },
      data: { status: "ClosedWon" },
    });

    // Increment ambassador closed deals only if not already ClosedWon
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
  revalidatePath("/dashboard");
  revalidatePath("/ambassadors");
}

export async function getLeadSuggestions(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead || !lead.preferredArea) return [];

  const developers = await prisma.developer.findMany();

  // Naive matching: developer buildAreas contains lead's preferred area
  return developers.filter((dev) => {
    const areas = dev.buildAreas.split(",").map((a) => a.trim().toLowerCase());
    return areas.includes(lead.preferredArea!.toLowerCase());
  });
}
