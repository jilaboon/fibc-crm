"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { RefreshButton } from "@/components/refresh-button";

interface PortalMobileSidebarProps {
  ambassadorName: string;
  referralLink: string | null;
  copyButton: React.ReactNode | null;
  logoutButton: React.ReactNode;
}

const navItems = [
  {
    href: "/portal/dashboard",
    label: "לוח בקרה",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/portal/leads",
    label: "הלידים שלי",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    href: "/portal/deals",
    label: "העסקאות שלי",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: "/portal/settings",
    label: "הגדרות",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function PortalMobileSidebar({
  ambassadorName,
  referralLink,
  copyButton,
  logoutButton,
}: PortalMobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Sticky mobile top bar */}
      <div className="flex md:hidden items-center justify-between bg-[#292f4c] text-white px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FIBC"
            width={32}
            height={32}
            className="rounded-lg shrink-0"
          />
          <span className="text-base font-bold tracking-tight">פורטל שגרירים</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="[&_button]:text-white/60 [&_button:hover]:text-white [&_button:hover]:bg-white/10">
            <RefreshButton />
          </div>
          <button
            onClick={() => setOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            aria-label="פתח תפריט"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Slide-in sheet menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="bg-[#292f4c] text-white border-none p-0 w-[280px] sm:max-w-[280px]"
        >
          <SheetTitle className="sr-only">תפריט ניווט</SheetTitle>

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
            <div className="text-sm font-medium">{ambassadorName}</div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 px-3 flex-1 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="monday-nav-item min-h-[44px]"
                onClick={() => setOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Referral link */}
          {referralLink && (
            <div className="px-4 py-3 border-t border-white/10">
              <div className="text-xs text-white/40 mb-2">קישור לדף ההפניה האישי שלך</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/60 bg-white/5 rounded px-2 py-1.5 break-all leading-relaxed flex-1 min-w-0">
                  {referralLink}
                </div>
                {copyButton}
              </div>
            </div>
          )}

          {/* User section */}
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/40">שגריר</div>
              {logoutButton}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
