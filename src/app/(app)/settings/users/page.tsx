import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import { InviteUserDialog } from "./invite-user-dialog";
import { UserActions } from "./user-actions";
import { Suspense } from "react";

const PAGE_SIZE = 25;

const roleLabels: Record<string, string> = {
  ADMIN: "מנהל",
  AGENT: "סוכן",
  AMBASSADOR: "שגריר",
};

export default async function UsersSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { role, userId } = await getAuthContext();
  if (role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10));
  const skip = (page - 1) * PAGE_SIZE;

  const [users, totalCount] = await Promise.all([
    prisma.userProfile.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: { ambassador: { select: { fullName: true } } },
    }),
    prisma.userProfile.count(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#323338]">ניהול משתמשים</h1>
          <p className="text-sm text-[#676879] mt-1">
            הזמן משתמשים חדשים וניהול הרשאות
          </p>
        </div>
        <InviteUserDialog />
      </div>

      <div className="bg-white rounded-lg border border-[#e6e9ef] overflow-hidden">
        <div className="hidden md:block">
          <table className="w-full monday-table">
            <thead>
              <tr className="border-b border-[#e6e9ef]">
                <th className="text-right p-3 px-4">שם</th>
                <th className="text-right p-3 px-4">אימייל</th>
                <th className="text-right p-3 px-4">תפקיד</th>
                <th className="text-right p-3 px-4">שגריר מקושר</th>
                <th className="text-right p-3 px-4">סטטוס</th>
                <th className="text-right p-3 px-4">תאריך יצירה</th>
                <th className="text-right p-3 px-4">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="p-3 px-4 font-medium">{user.fullName}</td>
                  <td className="p-3 px-4 text-sm text-[#676879]" dir="ltr">
                    {user.email}
                  </td>
                  <td className="p-3 px-4">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : user.role === "AGENT"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {roleLabels[user.role] || user.role}
                    </Badge>
                  </td>
                  <td className="p-3 px-4 text-sm text-[#676879]">
                    {user.ambassador?.fullName || "—"}
                  </td>
                  <td className="p-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.isActive ? "text-[#00c875]" : "text-[#e2445c]"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${user.isActive ? "bg-[#00c875]" : "bg-[#e2445c]"}`}
                      />
                      {user.isActive ? "פעיל" : "מושבת"}
                    </span>
                  </td>
                  <td className="p-3 px-4 text-sm text-[#676879]">
                    {new Date(user.createdAt).toLocaleDateString("he-IL")}
                  </td>
                  <td className="p-3 px-4">
                    <UserActions
                      userId={user.id}
                      currentRole={user.role}
                      isActive={user.isActive}
                      isSelf={user.userId === userId}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3 p-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg border border-[#e6e9ef] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#323338]">{user.fullName}</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.isActive ? "text-[#00c875]" : "text-[#e2445c]"}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${user.isActive ? "bg-[#00c875]" : "bg-[#e2445c]"}`}
                  />
                  {user.isActive ? "פעיל" : "מושבת"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676879]">אימייל</span>
                <span className="text-[#323338]" dir="ltr">{user.email}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#676879]">תפקיד</span>
                <Badge
                  variant={
                    user.role === "ADMIN"
                      ? "default"
                      : user.role === "AGENT"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676879]">שגריר מקושר</span>
                <span className="text-[#323338]">{user.ambassador?.fullName || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#676879]">תאריך יצירה</span>
                <span className="text-[#323338]">{new Date(user.createdAt).toLocaleDateString("he-IL")}</span>
              </div>
              <div className="flex justify-end pt-1">
                <UserActions
                  userId={user.id}
                  currentRole={user.role}
                  isActive={user.isActive}
                  isSelf={user.userId === userId}
                />
              </div>
            </div>
          ))}
        </div>
        <Suspense>
          <Pagination totalCount={totalCount} />
        </Suspense>
      </div>
    </div>
  );
}
