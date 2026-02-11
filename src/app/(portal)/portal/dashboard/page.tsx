import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });
  if (!profile) redirect("/login");

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [leads, deals, leadsThisMonth] = await Promise.all([
    prisma.lead.findMany({
      where: { ambassadorId: ambassador.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deal.findMany({
      where: { ambassadorId: ambassador.id },
    }),
    prisma.lead.count({
      where: {
        ambassadorId: ambassador.id,
        createdAt: { gte: startOfMonth },
      },
    }),
  ]);

  const totalReferrals = leads.length;
  const activeDeals = deals.filter(
    (d) => d.stage === "Negotiation" || d.stage === "Contract"
  ).length;
  const closedDeals = deals.filter((d) => d.stage === "ClosedWon").length;
  const recentLeads = leads.slice(0, 5);

  const referralLink = ambassador.referralCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/r/${ambassador.referralCode}`
    : null;

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">לוח בקרה</h2>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-[#676879] mb-1">
                  קישור ההפניה שלך
                </div>
                <div className="text-sm font-mono bg-[#f6f7fb] rounded px-3 py-2 border border-[#e6e9ef]">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
