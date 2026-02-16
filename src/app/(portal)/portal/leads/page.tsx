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

export default async function PortalLeadsPage() {
  const { profile } = await getAuthContext();

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });
  if (!ambassador) redirect("/login");

  const leads = await prisma.lead.findMany({
    where: { ambassadorId: ambassador.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      budget: true,
      preferredArea: true,
      createdAt: true,
    },
  });

  return (
    <div dir="rtl" className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">הלידים שלי</h2>

      <Card>
        <CardHeader>
          <div className="monday-group-header monday-group-blue">
            כל הלידים ({leads.length})
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-sm text-[#676879] py-4 text-center">
              עדיין אין לידים. שתף את קישור ההפניה שלך כדי להתחיל!
            </div>
          ) : (
            <Table className="monday-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">אימייל</TableHead>
                  <TableHead className="text-right">טלפון</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">תקציב</TableHead>
                  <TableHead className="text-right">אזור מועדף</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.fullName}
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone || "---"}</TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>{lead.budget || "---"}</TableCell>
                    <TableCell>{lead.preferredArea || "---"}</TableCell>
                    <TableCell>
                      {lead.createdAt.toLocaleDateString("he-IL")}
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
