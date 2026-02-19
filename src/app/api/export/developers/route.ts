import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  void request;

  const developers = await prisma.developer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      companyName: true,
      developerName: true,
      city: true,
      contactName: true,
      email: true,
      phone: true,
      buildAreas: true,
      projectType: true,
      priceRange: true,
      createdAt: true,
      _count: { select: { deals: true } },
    },
  });

  const rows = developers.map((d) => ({
    "שם חברה": d.companyName,
    "שם יזם": d.developerName || "",
    "עיר": d.city || "",
    "איש קשר": d.contactName,
    "אימייל": d.email,
    "טלפון": d.phone || "",
    "אזורי בנייה": d.buildAreas,
    "סוג פרויקט": d.projectType,
    "טווח מחירים": d.priceRange || "",
    "עסקאות": d._count.deals,
    "תאריך": d.createdAt.toLocaleDateString("he-IL"),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, "יזמים");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="developers-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
