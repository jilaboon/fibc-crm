import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { ExportButton } from "@/components/export-button";
import { Suspense } from "react";

const PAGE_SIZE = 25;

export default async function DevelopersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const [developers, totalCount] = await Promise.all([
    prisma.developer.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        companyName: true,
        developerName: true,
        city: true,
        contactName: true,
        email: true,
        buildAreas: true,
        projectType: true,
        priceRange: true,
        _count: { select: { deals: true } },
      },
    }),
    prisma.developer.count(),
  ]);

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-purple text-xl">
          פרויקטים
        </div>
        <div className="flex gap-2">
          <Suspense>
            <ExportButton endpoint="/api/export/developers" />
          </Suspense>
          <NewProjectDialog />
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table className="monday-table">
              <TableHeader>
                <TableRow className="bg-[#f6f7fb]">
                  <TableHead className="text-right">שם הפרויקט</TableHead>
                  <TableHead className="text-right">יזם</TableHead>
                  <TableHead className="text-right">עיר</TableHead>
                  <TableHead className="text-right">איש קשר/מכירות</TableHead>
                  <TableHead className="text-right">אזורי בנייה</TableHead>
                  <TableHead className="text-right">סוג פרויקט</TableHead>
                  <TableHead className="text-right">טווח מחירים</TableHead>
                  <TableHead className="text-right">עסקאות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {developers.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell>
                      <Link
                        href={`/developers/${dev.id}`}
                        className="font-medium text-[#0073ea] hover:underline"
                      >
                        {dev.companyName}
                      </Link>
                    </TableCell>
                    <TableCell>{dev.developerName || "—"}</TableCell>
                    <TableCell>{dev.city || "—"}</TableCell>
                    <TableCell>{dev.contactName}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {dev.buildAreas.split(",").map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{dev.projectType}</TableCell>
                    <TableCell>{dev.priceRange || "—"}</TableCell>
                    <TableCell>{dev._count.deals}</TableCell>
                  </TableRow>
                ))}
                {developers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                      <div className="space-y-2">
                        <p className="text-lg">אין פרויקטים עדיין.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden space-y-3 p-4">
            {developers.map((dev) => (
              <div key={dev.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/developers/${dev.id}`}
                    className="font-bold text-[#0073ea] hover:underline"
                  >
                    {dev.companyName}
                  </Link>
                  <span className="text-xs text-[#676879]">{dev._count.deals} עסקאות</span>
                </div>
                {dev.developerName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#676879]">יזם</span>
                    <span className="text-[#323338]">{dev.developerName}</span>
                  </div>
                )}
                {dev.city && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#676879]">עיר</span>
                    <span className="text-[#323338]">{dev.city}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">איש קשר/מכירות</span>
                  <span className="text-[#323338]">{dev.contactName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">אימייל</span>
                  <span className="text-[#323338]">{dev.email}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#676879]">אזורי בנייה</span>
                  <div className="flex gap-1 flex-wrap">
                    {dev.buildAreas.split(",").map((area) => (
                      <Badge key={area} variant="outline" className="text-xs">
                        {area.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">סוג פרויקט</span>
                  <span className="text-[#323338]">{dev.projectType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#676879]">טווח מחירים</span>
                  <span className="text-[#323338]">{dev.priceRange || "—"}</span>
                </div>
              </div>
            ))}
            {developers.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <div className="space-y-2">
                  <p className="text-lg">אין פרויקטים עדיין.</p>
                </div>
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
