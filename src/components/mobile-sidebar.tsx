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

interface MobileSidebarProps {
  profileName: string;
  profileRole: string;
  isAdmin: boolean;
  logoutButton: React.ReactNode;
}

const navItems = [
  {
    href: "/dashboard",
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
    href: "/ambassadors",
    label: "שגרירים",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/leads",
    label: "לידים",
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
    href: "/developers",
    label: "יזמים",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
];

const adminNavItem = {
  href: "/settings/users",
  label: "ניהול משתמשים",
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
};

export function MobileSidebar({
  profileName,
  profileRole,
  isAdmin,
  logoutButton,
}: MobileSidebarProps) {
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
          <span className="text-base font-bold tracking-tight">FIBC CRM</span>
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
              <span className="text-lg font-bold tracking-tight leading-tight">
                FIBC CRM
              </span>
            </div>
          </div>

          {/* Workspace label */}
          <div className="px-5 py-3">
            <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
              סביבת עבודה ראשית
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-0.5 px-3 flex-1">
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
            {isAdmin && (
              <Link
                href={adminNavItem.href}
                className="monday-nav-item min-h-[44px] mt-4"
                onClick={() => setOpen(false)}
              >
                {adminNavItem.icon}
                {adminNavItem.label}
              </Link>
            )}
          </nav>

          {/* User section */}
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{profileName}</div>
                <div className="text-xs text-white/40">
                  {profileRole === "ADMIN" ? "מנהל" : "סוכן"}
                </div>
              </div>
              {logoutButton}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
