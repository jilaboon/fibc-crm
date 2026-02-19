import { prisma } from "@/lib/db";
import { getCachedAmbassadorList } from "@/lib/cached-queries";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AssignAmbassadorForm } from "./assign-ambassador-form";
import { MatchDeveloperSection } from "./match-developer-section";
import { DealSection } from "./deal-section";
import { DeleteLeadButton } from "./delete-lead-button";
import { LeadStatusSelect } from "./lead-status-select";
import { DealTypeSelect } from "./deal-type-select";
import { LeadTasks } from "./lead-tasks";
import { LeadNotes } from "./lead-notes";
import { ConvertToAmbassadorDialog } from "./convert-to-ambassador-dialog";
import { Badge } from "@/components/ui/badge";

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
        ambassador: {
          select: { id: true, fullName: true },
        },
        deals: {
          select: {
            id: true,
            stage: true,
            notes: true,
            developer: { select: { companyName: true, contactName: true } },
            ambassador: { select: { fullName: true } },
          },
        },
        tasks: {
          select: {
            id: true,
            subject: true,
            dueDate: true,
            dueTime: true,
            completed: true,
          },
          orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
        },
        leadNotes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        convertedAmbassador: {
          select: { id: true, fullName: true },
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
          <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
          {lead.status === "NotRelevant" && lead.notRelevantReason && (
            <span className="text-sm text-[#e2445c]">({lead.notRelevantReason})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lead.convertedAmbassador ? (
            <Link href={`/ambassadors/${lead.convertedAmbassador.id}`}>
              <Badge className="bg-[#00c875] hover:bg-[#00b461] text-white cursor-pointer">
                הומר לשגריר: {lead.convertedAmbassador.fullName}
              </Badge>
            </Link>
          ) : (
            <ConvertToAmbassadorDialog
              leadId={lead.id}
              leadName={lead.fullName}
              leadEmail={lead.email}
            />
          )}
          <DeleteLeadButton leadId={lead.id} leadName={lead.fullName} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lead Profile */}
        <div className="space-y-6">
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
                <span dir="ltr">{lead.phone || "\u2014"}</span>
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
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">סוג עסקה</span>
                <div className="w-[160px]">
                  <DealTypeSelect leadId={lead.id} currentDealType={lead.dealType} />
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">תקציב</span>
                <span>{lead.budget || "\u2014"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">אזור מועדף</span>
                <span>{lead.preferredArea || "\u2014"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">חדרים</span>
                <span>{lead.rooms || "\u2014"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">סוג נכס</span>
                <span>{lead.propertyType || "\u2014"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">מוכנות</span>
                <span>{lead.readiness || "\u2014"}</span>
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

          {/* Tasks Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-[#e6e9ef]">
              <CardTitle className="monday-group-header monday-group-orange">משימות</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <LeadTasks leadId={lead.id} tasks={lead.tasks} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Ambassador Assignment */}
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

          {/* Project Matching */}
          {!activeDeal && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-[#e6e9ef]">
                <CardTitle className="monday-group-header monday-group-orange">התאמה לפרויקט</CardTitle>
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

          {/* Notes Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-[#e6e9ef]">
              <CardTitle className="monday-group-header monday-group-green">הערות</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <LeadNotes leadId={lead.id} notes={lead.leadNotes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
