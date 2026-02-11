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

const stageLabels: Record<string, string> = {
  Negotiation: "משא ומתן",
  Contract: "חוזה",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
};

export default async function PortalDealsPage() {
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

  const deals = await prisma.deal.findMany({
    where: { ambassadorId: ambassador.id },
    include: {
      lead: true,
      developer: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">העסקאות שלי</h2>

      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-purple">
            כל העסקאות ({deals.length})
          </div>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-sm text-[#676879] py-4 text-center">
              עדיין אין עסקאות.
            </div>
          ) : (
            <Table className="monday-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">ליד</TableHead>
                  <TableHead className="text-right">יזם</TableHead>
                  <TableHead className="text-right">שלב</TableHead>
                  <TableHead className="text-right">תאריך עדכון</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      {deal.lead.fullName}
                    </TableCell>
                    <TableCell>{deal.developer.companyName}</TableCell>
                    <TableCell>
                      <StatusBadge status={deal.stage} />
                    </TableCell>
                    <TableCell>
                      {deal.updatedAt.toLocaleDateString("he-IL")}
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
