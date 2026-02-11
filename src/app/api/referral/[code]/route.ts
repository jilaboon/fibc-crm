import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/referral/[code] — Public: returns ambassador name for the landing page
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const ambassador = await prisma.ambassador.findUnique({
    where: { referralCode: code },
    select: { id: true, fullName: true, city: true, referralCode: true },
  });

  if (!ambassador) {
    return NextResponse.json(
      { error: "Referral code not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(ambassador);
}
