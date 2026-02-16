import { unstable_cache } from "next/cache";
import { prisma } from "./db";

export const getCachedDashboardAnalytics = unstable_cache(
  async () => {
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
  },
  ["dashboard-analytics"],
  { revalidate: 60, tags: ["dashboard"] }
);

export const getCachedAmbassadorList = unstable_cache(
  async () => {
    return prisma.ambassador.findMany({
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    });
  },
  ["ambassador-list"],
  { revalidate: 60, tags: ["ambassadors"] }
);

export const getCachedDeveloperList = unstable_cache(
  async () => {
    return prisma.developer.findMany({
      select: { id: true, companyName: true, contactName: true, buildAreas: true },
      orderBy: { companyName: "asc" },
    });
  },
  ["developer-list"],
  { revalidate: 60, tags: ["developers"] }
);
