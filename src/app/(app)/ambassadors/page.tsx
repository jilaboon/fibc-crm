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
import Link from "next/link";

export default async function AmbassadorsPage() {
  const ambassadors = await prisma.ambassador.findMany({
    orderBy: { createdAt: "desc" },
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
  });

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="monday-group-header monday-group-blue text-xl">
          שגרירים
        </div>
        <NewAmbassadorDialog />
      </div>

      <Card className="border-[#e6e9ef] bg-white">
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
}
