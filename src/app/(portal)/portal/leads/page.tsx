import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { DateRangeFilter } from "@/components/date-range-filter";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function PortalLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { profile } = await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;

  const where: Prisma.LeadWhereInput = { ambassadorId: ambassador.id };
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      budget: true,
      preferredArea: true,
      createdAt: true,
    },
  });

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">הלידים שלי</h2>

      <Suspense>
        <DateRangeFilter />
      </Suspense>

      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-blue">
            כל הלידים ({leads.length})
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-sm text-[#676879] py-4 text-center">
              עדיין אין לידים. שתף את קישור ההפניה שלך כדי להתחיל!
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table className="monday-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">טלפון</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">תקציב</TableHead>
                      <TableHead className="text-right">אזור מועדף</TableHead>
                      <TableHead className="text-right">תאריך</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.fullName}
                        </TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || "---"}</TableCell>
                        <TableCell>
                          <StatusBadge status={lead.status} />
                        </TableCell>
                        <TableCell>{lead.budget || "---"}</TableCell>
                        <TableCell>{lead.preferredArea || "---"}</TableCell>
                        <TableCell>
                          {lead.createdAt.toLocaleDateString("he-IL")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="md:hidden space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#323338]">{lead.fullName}</span>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">אימייל</span>
                      <span className="text-[#323338]">{lead.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">טלפון</span>
                      <span className="text-[#323338]">{lead.phone || "---"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">תקציב</span>
                      <span className="text-[#323338]">{lead.budget || "---"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">אזור מועדף</span>
                      <span className="text-[#323338]">{lead.preferredArea || "---"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">תאריך</span>
                      <span className="text-[#323338]">{lead.createdAt.toLocaleDateString("he-IL")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
