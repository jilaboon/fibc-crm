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
import Link from "next/link";

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      buildAreas: true,
      projectType: true,
      priceRange: true,
      _count: { select: { deals: true } },
    },
  });

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-purple text-xl">
          יזמים
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-sm">
        <CardContent className="p-0">
          <Table className="monday-table">
            <TableHeader>
              <TableRow className="bg-[#f6f7fb]">
                <TableHead className="text-right">חברה</TableHead>
                <TableHead className="text-right">איש קשר</TableHead>
                <TableHead className="text-right">אימייל</TableHead>
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
                  <TableCell>{dev.contactName}</TableCell>
                  <TableCell>{dev.email}</TableCell>
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
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    <div className="space-y-2">
                      <p className="text-lg">אין יזמים עדיין.</p>
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
