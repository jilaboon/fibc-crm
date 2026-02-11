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
import Link from "next/link";

export default async function DashboardPage() {
  const [ambassadorCount, leadCount, developerCount, closedWonCount] =
    await Promise.all([
      prisma.ambassador.count(),
      prisma.lead.count(),
      prisma.developer.count(),
      prisma.deal.count({ where: { stage: "ClosedWon" } }),
    ]);

  const topAmbassadors = await prisma.ambassador.findMany({
    orderBy: { closedDeals: "desc" },
    take: 5,
  });

  const recentLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { ambassador: true },
  });

  const ambassadors = await prisma.ambassador.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

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
      <div className="grid gap-4 md:grid-cols-4">
        <div className="monday-stat-card" style={{ borderTop: "3px solid #0073ea" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">שגרירים</div>
          <div className="text-2xl font-bold">{ambassadorCount}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #579bfc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">לידים</div>
          <div className="text-2xl font-bold">{leadCount}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #a25ddc" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">יזמים</div>
          <div className="text-2xl font-bold">{developerCount}</div>
        </div>
        <div className="monday-stat-card" style={{ borderTop: "3px solid #00c875" }}>
          <div className="text-sm font-medium text-[#676879] mb-1">נסגר בהצלחה</div>
          <div className="text-2xl font-bold">{closedWonCount}</div>
        </div>
      </div>

      {/* שגרירים מובילים */}
      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-blue">שגרירים מובילים</div>
        </CardHeader>
        <CardContent>
          <Table className="monday-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">עיר</TableHead>
                <TableHead className="text-right">הפניות</TableHead>
                <TableHead className="text-right">נסגרו</TableHead>
                <TableHead className="text-right">המרה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAmbassadors.map((amb) => (
                <TableRow key={amb.id}>
                  <TableCell>
                    <Link
                      href={`/ambassadors/${amb.id}`}
                      className="font-medium hover:underline"
                    >
                      {amb.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{amb.city}</TableCell>
                  <TableCell>
                    {amb.totalReferrals}
                  </TableCell>
                  <TableCell>
                    {amb.closedDeals}
                  </TableCell>
                  <TableCell>
                    {amb.totalReferrals > 0
                      ? `${Math.round((amb.closedDeals / amb.totalReferrals) * 100)}%`
                      : "0%"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
              {recentLeads.map((lead) => (
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
                    {lead.ambassador?.fullName || "—"}
                  </TableCell>
                  <TableCell>{lead.budget || "—"}</TableCell>
                  <TableCell>{lead.preferredArea || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
