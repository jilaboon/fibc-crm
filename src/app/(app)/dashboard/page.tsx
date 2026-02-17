import { getAuthContext } from "@/lib/auth";
import { getCachedAmbassadorList } from "@/lib/cached-queries";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { NewLeadDialog } from "@/components/new-lead-dialog";
import { NewAmbassadorDialog } from "@/components/new-ambassador-dialog";
import { LeadsByStatusChart } from "@/components/charts/leads-by-status-chart";
import { LeadsBySourceChart } from "@/components/charts/leads-by-source-chart";
import { DealPipelineChart } from "@/components/charts/deal-pipeline-chart";
import { TopAmbassadorsChart } from "@/components/charts/top-ambassadors-chart";
import { DateRangeFilter } from "@/components/date-range-filter";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";

async function getDashboardAnalytics(dateFilter?: { gte?: Date; lte?: Date }) {
  const leadWhere: Prisma.LeadWhereInput = {};
  const dealWhere: Prisma.DealWhereInput = {};

  if (dateFilter) {
    leadWhere.createdAt = dateFilter;
    dealWhere.createdAt = dateFilter;
  }

  const [
    leadsByStatus,
    leadsBySource,
    dealsByStage,
    topAmbassadors,
    totalLeads,
    totalAmbassadors,
    totalDevelopers,
    closedWonDeals,
    activeDeals,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: true, where: leadWhere }),
    prisma.lead.groupBy({ by: ["source"], _count: true, where: leadWhere }),
    prisma.deal.groupBy({ by: ["stage"], _count: true, where: dealWhere }),
    prisma.ambassador.findMany({
      orderBy: { closedDeals: "desc" },
      take: 5,
      select: { id: true, fullName: true, totalReferrals: true, closedDeals: true },
    }),
    prisma.lead.count({ where: leadWhere }),
    prisma.ambassador.count(),
    prisma.developer.count(),
    prisma.deal.count({ where: { ...dealWhere, stage: "ClosedWon" } }),
    prisma.deal.count({ where: { ...dealWhere, stage: { in: ["Negotiation", "Contract"] } } }),
    prisma.lead.findMany({
      where: leadWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        status: true,
        budget: true,
        preferredArea: true,
        createdAt: true,
        ambassador: { select: { fullName: true } },
      },
    }),
  ]);

  return {
    leadsByStatus,
    leadsBySource,
    dealsByStage,
    topAmbassadors,
    totalLeads,
    totalAmbassadors,
    totalDevelopers,
    closedWonDeals,
    activeDeals,
    recentLeads,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await getAuthContext();

  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;

  let dateFilter: { gte?: Date; lte?: Date } | undefined;
  if (from || to) {
    dateFilter = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to + "T23:59:59.999Z");
  }

  const [analytics, ambassadors] = await Promise.all([
    getDashboardAnalytics(dateFilter),
    getCachedAmbassadorList(),
  ]);

  return (
    <div dir="rtl" className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">לוח בקרה</h2>
        <div className="flex gap-2">
          <NewLeadDialog ambassadors={ambassadors} />
          <NewAmbassadorDialog />
        </div>
      </div>

      <Suspense>
        <DateRangeFilter />
      </Suspense>

      {/* כרטיסי סטטיסטיקה */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        <div className="monday-stat-card" style={{ borderTop: "3px solid #0073ea" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">שגרירים</div>
          <div className="text-2xl font-bold">{analytics.totalAmbassadors}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #579bfc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">לידים</div>
          <div className="text-2xl font-bold">{analytics.totalLeads}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #a25ddc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">פרויקטים</div>
          <div className="text-2xl font-bold">{analytics.totalDevelopers}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #00c875" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">נסגר בהצלחה</div>
          <div className="text-2xl font-bold">{analytics.closedWonDeals}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #fdab3d" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">עסקאות פעילות</div>
          <div className="text-2xl font-bold">{analytics.activeDeals}</div>
        </div>
      </div>

      {/* שורה 1: גרפים - לידים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">לידים לפי סטטוס</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsByStatusChart data={analytics.leadsByStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">לידים לפי מקור</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadsBySourceChart data={analytics.leadsBySource} />
          </CardContent>
        </Card>
      </div>

      {/* שורה 2: גרפים - עסקאות ושגרירים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">צינור עסקאות</CardTitle>
          </CardHeader>
          <CardContent>
            <DealPipelineChart data={analytics.dealsByStage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">שגרירים מובילים</CardTitle>
          </CardHeader>
          <CardContent>
            <TopAmbassadorsChart data={analytics.topAmbassadors} />
          </CardContent>
        </Card>
      </div>

      {/* לידים אחרונים */}
      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-green">לידים אחרונים</div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block">
            <Table className="monday-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">שגריר</TableHead>
                  <TableHead className="text-right">תקציב</TableHead>
                  <TableHead className="text-right">אזור</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>
                      {lead.ambassador?.fullName || "\u2014"}
                    </TableCell>
                    <TableCell>{lead.budget || "\u2014"}</TableCell>
                    <TableCell>{lead.preferredArea || "\u2014"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-3">
            {analytics.recentLeads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="font-bold text-[#323338] hover:underline"
                  >
                    {lead.fullName}
                  </Link>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">שגריר</span>
                  <span className="text-[#323338]">{lead.ambassador?.fullName || "\u2014"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">תקציב</span>
                  <span className="text-[#323338]">{lead.budget || "\u2014"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">אזור</span>
                  <span className="text-[#323338]">{lead.preferredArea || "\u2014"}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
