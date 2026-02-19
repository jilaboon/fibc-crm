import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;
  const ambassadorId = params.get("ambassador") || undefined;
  const projectId = params.get("project") || undefined;
  const status = params.get("status") || undefined;
  const country = params.get("country") || undefined;

  const where: Prisma.LeadWhereInput = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }
  if (ambassadorId) where.ambassadorId = ambassadorId;
  if (projectId) where.deals = { some: { developerId: projectId } };
  if (status) where.status = status;
  if (country) where.country = country;

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      fullName: true,
      email: true,
      phone: true,
      status: true,
      country: true,
      budget: true,
      preferredArea: true,
      rooms: true,
      readiness: true,
      createdAt: true,
      ambassador: { select: { fullName: true } },
    },
  });

  const rows = leads.map((l) => ({
    "שם": l.fullName,
    "אימייל": l.email,
    "טלפון": l.phone || "",
    "סטטוס": l.status,
    "מדינה": l.country,
    "תקציב": l.budget || "",
    "אזור": l.preferredArea || "",
    "חדרים": l.rooms || "",
    "מוכנות": l.readiness || "",
    "שגריר": l.ambassador?.fullName || "",
    "תאריך": l.createdAt.toLocaleDateString("he-IL"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "לידים");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
