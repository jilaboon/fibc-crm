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

const stageLabels: Record<string, string> = {
  Negotiation: "משא ומתן",
  Contract: "חוזה",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
};

export default async function PortalDealsPage() {
  const { profile } = await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const deals = await prisma.deal.findMany({
    where: { ambassadorId: ambassador.id },
    take: 50,
    select: {
      id: true,
      stage: true,
      updatedAt: true,
      lead: { select: { fullName: true } },
      developer: { select: { companyName: true } },
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
            <>
              <div className="hidden md:block">
                <Table className="monday-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">ליד</TableHead>
                      <TableHead className="text-right">פרויקט</TableHead>
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
              </div>
              <div className="md:hidden space-y-3">
                {deals.map((deal) => (
                  <div key={deal.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#323338]">{deal.lead.fullName}</span>
                      <StatusBadge status={deal.stage} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">פרויקט</span>
                      <span className="text-[#323338]">{deal.developer.companyName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#676879]">תאריך עדכון</span>
                      <span className="text-[#323338]">{deal.updatedAt.toLocaleDateString("he-IL")}</span>
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
