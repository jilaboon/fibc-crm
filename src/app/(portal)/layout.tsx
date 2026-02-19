import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { CopyButton } from "./portal/copy-button";
import { PortalLogoutButton } from "./portal/logout-button";
import { RefreshButton } from "@/components/refresh-button";
import { PortalMobileSidebar } from "@/components/portal-mobile-sidebar";

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
    select: {
      id: true,
      role: true,
      fullName: true,
      ambassador: true,
    },
  });

  if (!profile || profile.role !== "AMBASSADOR") redirect("/login");

  const ambassador = profile.ambassador;
  if (!ambassador) redirect("/login");

  const referralLink = ambassador.referralCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/r/${ambassador.referralCode}`
    : null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile top bar + sidebar */}
      <PortalMobileSidebar
        ambassadorName={ambassador.fullName}
        referralLink={referralLink}
        copyButton={referralLink ? <CopyButton text={referralLink} /> : null}
        logoutButton={<PortalLogoutButton />}
      />

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-[220px] bg-[#292f4c] text-white flex-col sticky top-0 h-screen">
        {/* Logo area */}
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FIBC"
              width={40}
              height={40}
              className="rounded-lg shrink-0"
            />
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

        {/* Settings */}
        <nav className="px-3">
          <Link href="/portal/settings" className="monday-nav-item">
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            הגדרות
          </Link>
        </nav>

        {/* Referral link */}
        {referralLink && (
          <div className="px-4 py-3 border-t border-white/10">
            <div className="text-xs text-white/40 mb-2">קישור לדף ההפניה האישי שלך</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/60 bg-white/5 rounded px-2 py-1.5 break-all leading-relaxed flex-1 min-w-0">
                {referralLink}
              </div>
              <CopyButton text={referralLink} />
            </div>
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
      <main className="flex-1 overflow-auto">
        <div className="hidden md:flex justify-end p-4 pb-0">
          <RefreshButton />
        </div>
        <div className="px-4 pb-4 md:px-8 md:pb-8">{children}</div>
      </main>
    </div>
  );
}
