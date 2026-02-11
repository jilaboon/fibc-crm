import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// POST /api/referral/submit — Secured with API key, creates a lead from referral
export async function POST(request: Request) {
  // Verify API key
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.REFERRAL_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { ambassadorId, referralCode, fullName, email, phone, budget, preferredArea, rooms, propertyType, readiness, notes } = body;

    if (!ambassadorId || !referralCode || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: ambassadorId, referralCode, fullName, email" },
        { status: 400 }
      );
    }

    // Validate ambassador exists
    const ambassador = await prisma.ambassador.findFirst({
      where: { id: ambassadorId, referralCode },
    });

    if (!ambassador) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        budget: budget || null,
        preferredArea: preferredArea || null,
        rooms: rooms || null,
        propertyType: propertyType || null,
        readiness: readiness || null,
        notes: notes || null,
        source: "referral",
        referralCode,
        ambassadorId,
        status: "New",
      },
    });

    // Increment ambassador referral count
    await prisma.ambassador.update({
      where: { id: ambassadorId },
      data: { totalReferrals: { increment: 1 } },
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("Referral submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
