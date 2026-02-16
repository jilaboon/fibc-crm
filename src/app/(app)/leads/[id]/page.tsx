import { prisma } from "@/lib/db";
import { getCachedAmbassadorList } from "@/lib/cached-queries";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { AssignAmbassadorForm } from "./assign-ambassador-form";
import { MatchDeveloperSection } from "./match-developer-section";
import { DealSection } from "./deal-section";
import { DeleteLeadButton } from "./delete-lead-button";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [lead, ambassadors, developers] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
      include: {
        ambassador: true,
        deals: {
          include: {
            developer: { select: { companyName: true, contactName: true } },
            ambassador: { select: { fullName: true } },
          },
        },
      },
    }),
    getCachedAmbassadorList(),
    prisma.developer.findMany({
      select: {
        id: true,
        companyName: true,
        contactName: true,
        buildAreas: true,
        projectType: true,
        priceRange: true,
      },
      orderBy: { companyName: "asc" },
    }),
  ]);

  if (!lead) notFound();

  // Get matching suggestions
  const suggestions = lead.preferredArea
    ? developers.filter((dev) => {
        const areas = dev.buildAreas.split(",").map((a) => a.trim().toLowerCase());
        return areas.includes(lead.preferredArea!.toLowerCase());
      })
    : [];

  const activeDeal = lead.deals[0] || null;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Link href="/leads" className="text-muted-foreground hover:text-[#0073ea] transition-colors">
          לידים &larr;
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{lead.fullName}</h2>
          <StatusBadge status={lead.status} />
        </div>
        <DeleteLeadButton leadId={lead.id} leadName={lead.fullName} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lead Profile */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-[#e6e9ef]">
            <CardTitle className="monday-group-header monday-group-blue">פרופיל ליד</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">אימייל</span>
              <span>{lead.email}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">טלפון</span>
              <span dir="ltr">{lead.phone || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">מיקום</span>
              <span>
                {lead.city ? `${lead.city}, ` : ""}
                {lead.country}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">תקציב</span>
              <span>{lead.budget || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">אזור מועדף</span>
              <span>{lead.preferredArea || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">חדרים</span>
              <span>{lead.rooms || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">סוג נכס</span>
              <span>{lead.propertyType || "—"}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">מוכנות</span>
              <span>{lead.readiness || "—"}</span>
            </div>
            {lead.notes && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">הערות</span>
                  <p className="mt-1">{lead.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Ambassador Assignment */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-[#e6e9ef]">
              <CardTitle className="monday-group-header monday-group-purple">שגריר</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <AssignAmbassadorForm
                leadId={lead.id}
                currentAmbassadorId={lead.ambassadorId}
                ambassadors={ambassadors}
              />
            </CardContent>
          </Card>

          {/* Developer Matching */}
          {!activeDeal && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#e6e9ef]">
                <CardTitle className="monday-group-header monday-group-orange">התאמה ליזם</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <MatchDeveloperSection
                  leadId={lead.id}
                  suggestions={suggestions}
                  allDevelopers={developers}
                />
              </CardContent>
            </Card>
          )}

          {/* Deal Section */}
          {activeDeal && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#e6e9ef]">
                <CardTitle className="monday-group-header monday-group-green">עסקה</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <DealSection deal={activeDeal} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
