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
import { PortalDealsFilter } from "@/components/portal-deals-filter";
import { Pagination } from "@/components/pagination";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

const PAGE_SIZE = 25;

const stageLabels: Record<string, string> = {
  Negotiation: "משא ומתן",
  Contract: "חוזה",
  ClosedWon: "נסגר בהצלחה",
  ClosedLost: "נסגר ללא הצלחה",
};

export default async function PortalDealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { profile } = await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const params = await searchParams;
  const stage = typeof params.stage === "string" ? params.stage : undefined;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const dealWhere: Prisma.DealWhereInput = { ambassadorId: ambassador.id };
  if (stage) {
    dealWhere.stage = stage;
  }

  const [deals, totalCount] = await Promise.all([
    prisma.deal.findMany({
      where: dealWhere,
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        stage: true,
        updatedAt: true,
        lead: { select: { fullName: true } },
        developer: { select: { companyName: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.deal.count({ where: dealWhere }),
  ]);

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">העסקאות שלי</h2>

      <Suspense>
        <PortalDealsFilter />
      </Suspense>

      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-purple">
            כל העסקאות ({totalCount})
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
        <Suspense>
          <Pagination totalCount={totalCount} />
        </Suspense>
      </Card>
    </div>
  );
}
