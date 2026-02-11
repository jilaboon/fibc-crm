import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CopyButton } from "./portal/copy-button";
import { PortalLogoutButton } from "./portal/logout-button";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile || profile.role !== "AMBASSADOR") redirect("/login");

  const ambassador = await prisma.ambassador.findUnique({
    where: { userProfileId: profile.id },
  });

  if (!ambassador) redirect("/login");

  const referralLink = ambassador.referralCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/r/${ambassador.referralCode}`
    : null;

  return (
    <div className="flex min-h-screen">
      {/* Portal Sidebar */}
      <aside className="w-[220px] bg-[#292f4c] text-white flex flex-col sticky top-0 h-screen">
        {/* Logo area */}
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0073ea] flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <span className="text-base font-bold tracking-tight">
              פורטל שגרירים
            </span>
          </div>
        </div>

        {/* Ambassador name */}
        <div className="px-5 py-3">
          <div className="text-xs text-white/40 font-medium mb-1">שלום,</div>
          <div className="text-sm font-medium">{ambassador.fullName}</div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5 px-3 flex-1 mt-2">
          <Link href="/portal/dashboard" className="monday-nav-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            לוח בקרה
          </Link>
          <Link href="/portal/leads" className="monday-nav-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            הלידים שלי
          </Link>
          <Link href="/portal/deals" className="monday-nav-item">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            העסקאות שלי
          </Link>
        </nav>

        {/* Referral link */}
        {referralLink && (
          <div className="px-4 py-3 border-t border-white/10">
            <div className="text-xs text-white/40 mb-2">קישור ההפניה שלך</div>
            <div className="text-xs text-white/60 bg-white/5 rounded px-2 py-1.5 mb-2 break-all leading-relaxed">
              {referralLink}
            </div>
            <CopyButton text={referralLink} />
          </div>
        )}

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-xs text-white/40">שגריר</div>
            <PortalLogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
