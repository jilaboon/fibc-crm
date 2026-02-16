import { getAuthContext } from "@/lib/auth";
import { getCachedDashboardAnalytics, getCachedAmbassadorList } from "@/lib/cached-queries";
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
import Link from "next/link";

export default async function DashboardPage() {
  await getAuthContext();

  const [analytics, ambassadors] = await Promise.all([
    getCachedDashboardAnalytics(),
    getCachedAmbassadorList(),
  ]);

  return (
    <div dir="rtl" className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">לוח בקרה</h2>
        <div className="flex gap-2">
          <NewLeadDialog ambassadors={ambassadors} />
          <NewAmbassadorDialog />
        </div>
      </div>

      {/* כרטיסי סטטיסטיקה */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="monday-stat-card" style={{ borderTop: "3px solid #0073ea" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">שגרירים</div>
          <div className="text-2xl font-bold">{analytics.totalAmbassadors}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #579bfc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">לידים</div>
          <div className="text-2xl font-bold">{analytics.totalLeads}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #a25ddc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">יזמים</div>
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
        </CardContent>
      </Card>
    </div>
  );
}
