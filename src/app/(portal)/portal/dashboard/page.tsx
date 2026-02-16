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
import { CopyButton } from "../copy-button";

export default async function PortalDashboardPage() {
  const { profile } = await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalReferrals, leadsThisMonth, activeDeals, closedDeals, recentLeads] = await Promise.all([
    prisma.lead.count({
      where: { ambassadorId: ambassador.id },
    }),
    prisma.lead.count({
      where: {
        ambassadorId: ambassador.id,
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.deal.count({
      where: {
        ambassadorId: ambassador.id,
        stage: { in: ["Negotiation", "Contract"] },
      },
    }),
    prisma.deal.count({
      where: {
        ambassadorId: ambassador.id,
        stage: "ClosedWon",
      },
    }),
    prisma.lead.findMany({
      where: { ambassadorId: ambassador.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        fullName: true,
        status: true,
        budget: true,
        preferredArea: true,
        createdAt: true,
      },
    }),
  ]);

  const referralLink = ambassador.referralCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/r/${ambassador.referralCode}`
    : null;

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">לוח בקרה</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          className="monday-stat-card"
          style={{ borderTop: "3px solid #0073ea" }}
        >
          <div className="text-sm font-medium text-[#676879] mb-1">
            סה״כ הפניות
          </div>
          <div className="text-2xl font-bold">{totalReferrals}</div>
        </div>
        <div
          className="monday-stat-card"
          style={{ borderTop: "3px solid #579bfc" }}
        >
          <div className="text-sm font-medium text-[#676879] mb-1">
            לידים החודש
          </div>
          <div className="text-2xl font-bold">{leadsThisMonth}</div>
        </div>
        <div
          className="monday-stat-card"
          style={{ borderTop: "3px solid #fdab3d" }}
        >
          <div className="text-sm font-medium text-[#676879] mb-1">
            עסקאות פעילות
          </div>
          <div className="text-2xl font-bold">{activeDeals}</div>
        </div>
        <div
          className="monday-stat-card"
          style={{ borderTop: "3px solid #00c875" }}
        >
          <div className="text-sm font-medium text-[#676879] mb-1">
            עסקאות שנסגרו
          </div>
          <div className="text-2xl font-bold">{closedDeals}</div>
        </div>
      </div>

      {/* Referral link */}
      {referralLink && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#676879] mb-1">
                  קישור ההפניה שלך
                </div>
                <div className="text-sm font-mono bg-[#f6f7fb] rounded px-3 py-2 border border-[#e6e9ef] truncate">
                  {referralLink}
                </div>
              </div>
              <CopyButton text={referralLink} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent leads */}
      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-green">
            לידים אחרונים
          </div>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
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
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">תקציב</TableHead>
                      <TableHead className="text-right">אזור מועדף</TableHead>
                      <TableHead className="text-right">תאריך</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          {lead.fullName}
                        </TableCell>
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
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#323338]">{lead.fullName}</span>
                      <StatusBadge status={lead.status} />
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
