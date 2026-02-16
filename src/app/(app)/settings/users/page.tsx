import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { InviteUserDialog } from "./invite-user-dialog";
import { UserActions } from "./user-actions";

const roleLabels: Record<string, string> = {
  ADMIN: "מנהל",
  AGENT: "סוכן",
  AMBASSADOR: "שגריר",
};

export default async function UsersSettingsPage() {
  const { role, userId } = await getAuthContext();
  if (role !== "ADMIN") redirect("/dashboard");

  const [users, ambassadors] = await Promise.all([
    prisma.userProfile.findMany({
      orderBy: { createdAt: "desc" },
      include: { ambassador: { select: { fullName: true } } },
    }),
    prisma.ambassador.findMany({
      where: { userProfileId: null },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
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
        <InviteUserDialog ambassadors={ambassadors} />
      </div>

      <div className="bg-white rounded-lg border border-[#e6e9ef]">
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
    </div>
  );
}
