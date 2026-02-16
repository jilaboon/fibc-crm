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

export default async function DeveloperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const developer = await prisma.developer.findUnique({
    where: { id },
    include: {
      deals: {
        take: 50,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stage: true,
          notes: true,
          lead: { select: { id: true, fullName: true } },
          ambassador: { select: { fullName: true } },
        },
      },
    },
  });

  if (!developer) notFound();

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/developers" className="text-[#0073ea] hover:text-[#0060c2] font-medium">
          &rarr; יזמים
        </Link>
      </div>

      <div className="monday-group-header monday-group-purple text-2xl">
        {developer.companyName}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="monday-stat-card">
          <div className="monday-group-header monday-group-blue text-base mb-4">
            פרטים
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#676879]">איש קשר</span>
              <span>{developer.contactName}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">אימייל</span>
              <span>{developer.email}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">טלפון</span>
              <span dir="ltr">{developer.phone || "—"}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between items-center">
              <span className="text-[#676879]">אזורי בנייה</span>
              <div className="flex gap-1 flex-wrap">
                {developer.buildAreas.split(",").map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">סוג פרויקט</span>
              <span>{developer.projectType}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">טווח מחירים</span>
              <span>{developer.priceRange || "—"}</span>
            </div>
          </div>
        </div>

        <div className="monday-stat-card">
          <div className="monday-group-header monday-group-green text-base mb-4">
            סטטיסטיקה
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#676879]">סה&quot;כ עסקאות</span>
              <span className="font-semibold text-[#323338]">{developer.deals.length}</span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">עסקאות שנסגרו בהצלחה</span>
              <span className="font-semibold text-[#323338]">
                {developer.deals.filter((d) => d.stage === "ClosedWon").length}
              </span>
            </div>
            <Separator className="bg-[#e6e9ef]" />
            <div className="flex justify-between">
              <span className="text-[#676879]">עסקאות פעילות</span>
              <span className="font-semibold text-[#323338]">
                {developer.deals.filter((d) => d.stage === "Negotiation" || d.stage === "Contract").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-[#e6e9ef] bg-white">
        <CardHeader>
          <div className="monday-group-header monday-group-orange text-base">
            עסקאות ({developer.deals.length})
          </div>
        </CardHeader>
        <CardContent>
          <Table className="monday-table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">ליד</TableHead>
                <TableHead className="text-right">שלב</TableHead>
                <TableHead className="text-right">שגריר</TableHead>
                <TableHead className="text-right">הערות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {developer.deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell>
                    <Link
                      href={`/leads/${deal.lead.id}`}
                      className="font-medium hover:underline text-[#0073ea]"
                    >
                      {deal.lead.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={deal.stage} />
                  </TableCell>
                  <TableCell>{deal.ambassador?.fullName || "—"}</TableCell>
                  <TableCell>{deal.notes || "—"}</TableCell>
                </TableRow>
              ))}
              {developer.deals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    אין עסקאות עדיין.
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
