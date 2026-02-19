import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewAmbassadorDialog } from "@/components/new-ambassador-dialog";
import { AmbassadorsFilter } from "@/components/ambassadors-filter";
import { ExportButton } from "@/components/export-button";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

const PAGE_SIZE = 25;

export default async function AmbassadorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : undefined;
  const to = typeof params.to === "string" ? params.to : undefined;
  const country = typeof params.country === "string" ? params.country : undefined;
  const language = typeof params.language === "string" ? params.language : undefined;
  const sortReferrals = typeof params.sortReferrals === "string" ? params.sortReferrals : undefined;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.AmbassadorWhereInput = {};
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59.999Z");
  }
  if (country) {
    where.country = country;
  }
  if (language) {
    where.languages = { contains: language, mode: "insensitive" };
  }

  const orderBy: Prisma.AmbassadorOrderByWithRelationInput =
    sortReferrals === "asc"
      ? { totalReferrals: "asc" }
      : { totalReferrals: "desc" };

  const [ambassadors, totalCount] = await Promise.all([
    prisma.ambassador.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        country: true,
        city: true,
        languages: true,
        hostsEvents: true,
        totalReferrals: true,
        closedDeals: true,
      },
    }),
    prisma.ambassador.count({ where }),
  ]);

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-blue text-xl">
          שגרירים
        </div>
        <div className="flex gap-2">
          <Suspense>
            <ExportButton endpoint="/api/export/ambassadors" />
          </Suspense>
          <NewAmbassadorDialog />
        </div>
      </div>

      <Suspense>
        <AmbassadorsFilter />
      </Suspense>

      <Card className="border-[#e6e9ef] bg-white">
        <CardContent className="pt-6">
          <div className="hidden md:block">
            <Table className="monday-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">מדינה / עיר</TableHead>
                  <TableHead className="text-right">שפות</TableHead>
                  <TableHead className="text-right">מארח אירועים</TableHead>
                  <TableHead className="text-right">הפניות</TableHead>
                  <TableHead className="text-right">נסגרו</TableHead>
                  <TableHead className="text-right">המרה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambassadors.map((amb) => (
                  <TableRow key={amb.id}>
                    <TableCell>
                      <Link
                        href={`/ambassadors/${amb.id}`}
                        className="font-medium hover:underline text-[#0073ea]"
                      >
                        {amb.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {amb.country} / {amb.city}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {amb.languages.split(",").map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{amb.hostsEvents ? "כן" : "לא"}</TableCell>
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
                {ambassadors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      אין שגרירים עדיין. צור שגריר חדש כדי להתחיל.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-3">
            {ambassadors.map((amb) => (
              <div key={amb.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/ambassadors/${amb.id}`}
                    className="font-bold text-[#0073ea] hover:underline"
                  >
                    {amb.fullName}
                  </Link>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">מיקום</span>
                  <span className="text-[#323338]">{amb.country} / {amb.city}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#676879]">שפות</span>
                  <div className="flex gap-1 flex-wrap">
                    {amb.languages.split(",").map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">מארח אירועים</span>
                  <span className="text-[#323338]">{amb.hostsEvents ? "כן" : "לא"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">הפניות</span>
                  <span className="text-[#323338]">{amb.totalReferrals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">נסגרו</span>
                  <span className="text-[#323338]">{amb.closedDeals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">המרה</span>
                  <span className="text-[#323338]">
                    {amb.totalReferrals > 0
                      ? `${Math.round((amb.closedDeals / amb.totalReferrals) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            ))}
            {ambassadors.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                אין שגרירים עדיין. צור שגריר חדש כדי להתחיל.
              </div>
            )}
          </div>
        </CardContent>
        <Suspense>
          <Pagination totalCount={totalCount} />
        </Suspense>
      </Card>
    </div>
  );
}
