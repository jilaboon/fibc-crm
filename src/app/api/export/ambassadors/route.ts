import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const country = params.get("country") || undefined;
  const language = params.get("language") || undefined;

  const where: Prisma.AmbassadorWhereInput = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }
  if (country) where.country = country;
  if (language) where.languages = { contains: language, mode: "insensitive" };

  const ambassadors = await prisma.ambassador.findMany({
    where,
    orderBy: { totalReferrals: "desc" },
    select: {
      fullName: true,
      email: true,
      phone: true,
      country: true,
      city: true,
      languages: true,
      hostsEvents: true,
      totalReferrals: true,
      closedDeals: true,
      createdAt: true,
    },
  });

  const rows = ambassadors.map((a) => ({
    "שם": a.fullName,
    "אימייל": a.email,
    "טלפון": a.phone || "",
    "מדינה": a.country,
    "עיר": a.city,
    "שפות": a.languages,
    "מארח אירועים": a.hostsEvents ? "כן" : "לא",
    "הפניות": a.totalReferrals,
    "נסגרו": a.closedDeals,
    "המרה": a.totalReferrals > 0 ? `${Math.round((a.closedDeals / a.totalReferrals) * 100)}%` : "0%",
    "תאריך": a.createdAt.toLocaleDateString("he-IL"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "שגרירים");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="ambassadors-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
