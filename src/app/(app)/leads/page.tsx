import { prisma } from "@/lib/db";
import { getCachedAmbassadorList, getCachedDeveloperList } from "@/lib/cached-queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { NewLeadDialog } from "@/components/new-lead-dialog";
import { LeadsFilter } from "@/components/leads-filter";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;
  const ambassadorId = typeof params.ambassador === "string" ? params.ambassador : undefined;
  const projectId = typeof params.project === "string" ? params.project : undefined;

  const where: Prisma.LeadWhereInput = {};

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }
  if (ambassadorId) {
    where.ambassadorId = ambassadorId;
  }
  if (projectId) {
    where.deals = { some: { developerId: projectId } };
  }

  const [leads, ambassadors, developers] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        budget: true,
        preferredArea: true,
        rooms: true,
        readiness: true,
        createdAt: true,
        ambassador: { select: { fullName: true } },
      },
    }),
    getCachedAmbassadorList(),
    getCachedDeveloperList(),
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-blue">
          <h2 className="text-2xl font-bold tracking-tight">לידים</h2>
        </div>
        <NewLeadDialog ambassadors={ambassadors} />
      </div>

      <Suspense>
        <LeadsFilter
          ambassadors={ambassadors}
          projects={developers.map((d) => ({ id: d.id, companyName: d.companyName }))}
        />
      </Suspense>

      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table className="monday-table">
              <TableHeader>
                <TableRow className="bg-[#f6f7fb]">
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">שגריר</TableHead>
                  <TableHead className="text-right">תקציב</TableHead>
                  <TableHead className="text-right">אזור</TableHead>
                  <TableHead className="text-right">חדרים</TableHead>
                  <TableHead className="text-right">מוכנות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-[#0073ea] hover:underline"
                      >
                        {lead.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>
                      {lead.ambassador?.fullName || "—"}
                    </TableCell>
                    <TableCell>{lead.budget || "—"}</TableCell>
                    <TableCell>{lead.preferredArea || "—"}</TableCell>
                    <TableCell>{lead.rooms || "—"}</TableCell>
                    <TableCell>{lead.readiness || "—"}</TableCell>
                  </TableRow>
                ))}
                {leads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      <div className="space-y-2">
                        <p className="text-lg">אין לידים עדיין.</p>
                        <p className="text-sm">צור ליד חדש כדי להתחיל.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-3 p-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="font-bold text-[#0073ea] hover:underline"
                  >
                    {lead.fullName}
                  </Link>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">שגריר</span>
                  <span className="text-[#323338]">{lead.ambassador?.fullName || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">תקציב</span>
                  <span className="text-[#323338]">{lead.budget || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">אזור</span>
                  <span className="text-[#323338]">{lead.preferredArea || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">חדרים</span>
                  <span className="text-[#323338]">{lead.rooms || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">מוכנות</span>
                  <span className="text-[#323338]">{lead.readiness || "—"}</span>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-2">
                  <p className="text-lg">אין לידים עדיין.</p>
                  <p className="text-sm">צור ליד חדש כדי להתחיל.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
