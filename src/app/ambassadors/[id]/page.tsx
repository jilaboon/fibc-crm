import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

export default async function AmbassadorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ambassador = await prisma.ambassador.findUnique({
    where: { id },
    include: {
      leads: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!ambassador) notFound();

  const conversionRate =
    ambassador.totalReferrals > 0
      ? Math.round((ambassador.closedDeals / ambassador.totalReferrals) * 100)
      : 0;

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ambassadors" className="text-[#0073ea] hover:text-[#0060c2] font-medium">
          &rarr; שגרירים
        </Link>
      </div>

      <div className="monday-group-header monday-group-blue text-2xl">
        {ambassador.fullName}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="monday-stat-card">
          <div className="monday-group-header monday-group-purple text-base mb-4">
            פרטים
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#676879]">אימייל</span>
              <span>{ambassador.email}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">טלפון</span>
              <span dir="ltr">{ambassador.phone || "—"}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">מיקום</span>
              <span>
                {ambassador.city}, {ambassador.country}
              </span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between items-center">
              <span className="text-[#676879]">שפות</span>
              <div className="flex gap-1 flex-wrap">
                {ambassador.languages.split(",").map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">מארח אירועים</span>
              <span>{ambassador.hostsEvents ? "כן" : "לא"}</span>
            </div>
          </div>
        </div>

        <div className="monday-stat-card">
          <div className="monday-group-header monday-group-green text-base mb-4">
            ביצועים
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#676879]">סה&quot;כ הפניות</span>
              <span className="font-semibold text-[#323338]">{ambassador.totalReferrals}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">עסקאות שנסגרו</span>
              <span className="font-semibold text-[#323338]">{ambassador.closedDeals}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">אחוז המרה</span>
              <span className="font-semibold text-[#323338]">{conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-[#e6e9ef] bg-white">
        <CardHeader>
          <div className="monday-group-header monday-group-orange text-base">
            לידים שהופנו ({ambassador.leads.length})
          </div>
        </CardHeader>
        <CardContent>
          <Table className="monday-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שם</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תקציב</TableHead>
                <TableHead className="text-right">אזור</TableHead>
                <TableHead className="text-right">מוכנות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ambassador.leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium hover:underline text-[#0073ea]"
                    >
                      {lead.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>{lead.budget || "—"}</TableCell>
                  <TableCell>{lead.preferredArea || "—"}</TableCell>
                  <TableCell>{lead.readiness || "—"}</TableCell>
                </TableRow>
              ))}
              {ambassador.leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    אין לידים שהופנו עדיין.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
