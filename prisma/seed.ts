import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.ambassador.deleteMany();
  await prisma.userProfile.deleteMany();

  // Create Ambassadors
  const amb1 = await prisma.ambassador.create({
    data: {
      fullName: "Yael Cohen",
      email: "yael@example.com",
      phone: "+972-50-111-2222",
      country: "Israel",
      city: "Tel Aviv",
      languages: "Hebrew,English,French",
      hostsEvents: true,
      totalReferrals: 3,
      closedDeals: 1,
      referralCode: "yael-cohen",
    },
  });

  const amb2 = await prisma.ambassador.create({
    data: {
      fullName: "David Levi",
      email: "david@example.com",
      phone: "+972-50-333-4444",
      country: "Israel",
      city: "Herzliya",
      languages: "Hebrew,English",
      hostsEvents: false,
      totalReferrals: 2,
      closedDeals: 0,
      referralCode: "david-levi",
    },
  });

  const amb3 = await prisma.ambassador.create({
    data: {
      fullName: "Noa Shapira",
      email: "noa@example.com",
      phone: "+972-50-555-6666",
      country: "Israel",
      city: "Jerusalem",
      languages: "Hebrew,English,Russian",
      hostsEvents: true,
      totalReferrals: 1,
      closedDeals: 0,
      referralCode: "noa-shapira",
    },
  });

  // Create Developers
  const dev1 = await prisma.developer.create({
    data: {
      companyName: "Azrieli Group",
      contactName: "Moshe Azrieli",
      email: "moshe@azrieli.com",
      phone: "+972-3-608-1111",
      buildAreas: "Tel Aviv,Ramat Gan",
      projectType: "Mixed",
      priceRange: "2M-5M NIS",
    },
  });

  const dev2 = await prisma.developer.create({
    data: {
      companyName: "Africa Israel",
      contactName: "Rachel Naor",
      email: "rachel@afi.com",
      phone: "+972-3-608-2222",
      buildAreas: "Herzliya,Netanya",
      projectType: "Apartment",
      priceRange: "1.5M-3M NIS",
    },
  });

  const dev3 = await prisma.developer.create({
    data: {
      companyName: "Shikun & Binui",
      contactName: "Avi Goldstein",
      email: "avi@shikunbinui.com",
      phone: "+972-3-608-3333",
      buildAreas: "Jerusalem,Modiin",
      projectType: "Apartment",
      priceRange: "1M-2.5M NIS",
    },
  });

  const dev4 = await prisma.developer.create({
    data: {
      companyName: "Azorim",
      contactName: "Tamar Regev",
      email: "tamar@azorim.com",
      buildAreas: "Tel Aviv,Herzliya,Netanya",
      projectType: "Penthouse",
      priceRange: "3M-8M NIS",
    },
  });

  // Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      fullName: "Michael Green",
      email: "michael.g@example.com",
      phone: "+972-54-111-0001",
      country: "Israel",
      city: "Tel Aviv",
      status: "Qualified",
      budget: "2M-3M NIS",
      preferredArea: "Tel Aviv",
      rooms: "4",
      propertyType: "Apartment",
      readiness: "3-6 months",
      source: "referral",
      referralCode: "yael-cohen",
      ambassadorId: amb1.id,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      fullName: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1-555-0102",
      country: "USA",
      city: "New York",
      status: "Contacted",
      budget: "1.5M-2M NIS",
      preferredArea: "Herzliya",
      rooms: "3",
      propertyType: "Apartment",
      readiness: "6-12 months",
      source: "referral",
      referralCode: "yael-cohen",
      ambassadorId: amb1.id,
    },
  });

  const lead3 = await prisma.lead.create({
    data: {
      fullName: "Pierre Dubois",
      email: "pierre@example.com",
      phone: "+33-6-1234-5678",
      country: "France",
      city: "Paris",
      status: "New",
      budget: "3M-5M NIS",
      preferredArea: "Tel Aviv",
      rooms: "5",
      propertyType: "Penthouse",
      readiness: "Immediate",
      source: "manual",
      ambassadorId: amb1.id,
    },
  });

  const lead4 = await prisma.lead.create({
    data: {
      fullName: "Amit Patel",
      email: "amit.p@example.com",
      phone: "+972-52-888-9999",
      country: "Israel",
      status: "ClosedWon",
      budget: "1M-1.5M NIS",
      preferredArea: "Netanya",
      rooms: "3",
      propertyType: "Apartment",
      readiness: "Immediate",
      source: "referral",
      referralCode: "david-levi",
      ambassadorId: amb2.id,
    },
  });

  const lead5 = await prisma.lead.create({
    data: {
      fullName: "Elena Volkov",
      email: "elena.v@example.com",
      phone: "+972-50-777-8888",
      country: "Israel",
      city: "Haifa",
      status: "Matched",
      budget: "2M-3M NIS",
      preferredArea: "Herzliya",
      rooms: "4",
      propertyType: "Villa",
      readiness: "3-6 months",
      source: "referral",
      referralCode: "david-levi",
      ambassadorId: amb2.id,
    },
  });

  const lead6 = await prisma.lead.create({
    data: {
      fullName: "James Wilson",
      email: "james.w@example.com",
      phone: "+44-7700-900111",
      country: "UK",
      city: "London",
      status: "New",
      budget: "5M+ NIS",
      preferredArea: "Jerusalem",
      rooms: "5+",
      propertyType: "Villa",
      readiness: "12+ months",
      source: "manual",
      ambassadorId: amb3.id,
    },
  });

  // Create a Deal for the ClosedWon lead
  await prisma.deal.create({
    data: {
      stage: "ClosedWon",
      leadId: lead4.id,
      developerId: dev2.id,
      ambassadorId: amb2.id,
      notes: "Signed contract for 3-room apartment in Netanya",
    },
  });

  // Create an active deal for the Matched lead
  await prisma.deal.create({
    data: {
      stage: "Negotiation",
      leadId: lead5.id,
      developerId: dev4.id,
      ambassadorId: amb2.id,
      notes: "Interested in Herzliya penthouse project",
    },
  });

  console.log("Seed data created successfully!");
  console.log(`  - 3 ambassadors (with referral codes)`);
  console.log(`  - 6 leads`);
  console.log(`  - 4 developers`);
  console.log(`  - 2 deals`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
