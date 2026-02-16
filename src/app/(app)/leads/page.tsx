import { prisma } from "@/lib/db";
import { getCachedAmbassadorList } from "@/lib/cached-queries";
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
import Link from "next/link";

export default async function LeadsPage() {
  const [leads, ambassadors] = await Promise.all([
    prisma.lead.findMany({
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
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-blue">
          <h2 className="text-2xl font-bold tracking-tight">לידים</h2>
        </div>
        <NewLeadDialog ambassadors={ambassadors} />
      </div>

      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}
