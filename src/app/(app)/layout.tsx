import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { LogoutButton } from "./logout-button";

export default async function AppLayout({
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

  if (!profile) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Monday.com-style Sidebar */}
      <aside className="w-[260px] bg-[#292f4c] text-white flex flex-col sticky top-0 h-screen">
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
            <span className="text-lg font-bold tracking-tight leading-tight">FIBC CRM</span>
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
          <Link href="/dashboard" className="monday-nav-item">
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
          <Link href="/ambassadors" className="monday-nav-item">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            שגרירים
          </Link>
          <Link href="/leads" className="monday-nav-item">
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
            לידים
          </Link>
          <Link href="/developers" className="monday-nav-item">
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
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            יזמים
          </Link>
          {profile.role === "ADMIN" && (
            <Link href="/settings/users" className="monday-nav-item mt-4">
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
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              ניהול משתמשים
            </Link>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{profile.fullName}</div>
              <div className="text-xs text-white/40">
                {profile.role === "ADMIN" ? "מנהל" : "סוכן"}
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
