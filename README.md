# FIBC CRM Demo

Real estate scout & referral CRM demo app. Tracks Ambassadors, Leads, and Developers with deal tracking.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- TailwindCSS + shadcn/ui
- SQLite via Prisma ORM
- Server Actions for mutations

## Setup

```bash
npm install
npm run db:push    # Create database tables
npm run db:seed    # Seed with demo data
npm run dev        # Start dev server
```

## Reset Database

```bash
npm run db:reset   # Wipes and re-seeds
```

## Features

- **Dashboard** — Stats overview, top ambassadors, recent leads
- **Ambassadors** — List, detail pages, referral tracking
- **Leads** — Full pipeline: New → Contacted → Qualified → Matched → Closed Won/Lost
- **Developer Matching** — Area-based suggestions for lead-developer pairing
- **Deal Tracking** — Negotiation → Contract → Closed Won/Lost with ambassador attribution
