import { prisma } from "@/lib/db";

export async function getDashboardAnalytics() {
  const [
    leadsByStatus,
    leadsBySource,
    dealsByStage,
    topAmbassadors,
    totalLeads,
    totalAmbassadors,
    totalDevelopers,
    closedWonDeals,
    activeDeals,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.groupBy({ by: ["status"], _count: true }),
    prisma.lead.groupBy({ by: ["source"], _count: true }),
    prisma.deal.groupBy({ by: ["stage"], _count: true }),
    prisma.ambassador.findMany({
      orderBy: { closedDeals: "desc" },
      take: 5,
      select: { id: true, fullName: true, totalReferrals: true, closedDeals: true },
    }),
    prisma.lead.count(),
    prisma.ambassador.count(),
    prisma.developer.count(),
    prisma.deal.count({ where: { stage: "ClosedWon" } }),
    prisma.deal.count({ where: { stage: { in: ["Negotiation", "Contract"] } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        status: true,
        budget: true,
        preferredArea: true,
        createdAt: true,
        ambassador: { select: { fullName: true } },
      },
    }),
  ]);

  return {
    leadsByStatus,
    leadsBySource,
    dealsByStage,
    topAmbassadors,
    totalLeads,
    totalAmbassadors,
    totalDevelopers,
    closedWonDeals,
    activeDeals,
    recentLeads,
  };
}
