"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, toggleUserActive } from "@/lib/actions";
import { Button } from "@/components/ui/button";

type Props = {
  userId: string;
  currentRole: string;
  isActive: boolean;
  isSelf: boolean;
};

const roleLabels: Record<string, string> = {
  ADMIN: "מנהל",
  AGENT: "סוכן",
  AMBASSADOR: "שגריר",
};

export function UserActions({ userId, currentRole, isActive, isSelf }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  async function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    if (newRole === currentRole) return;
    setLoading(true);
    setSaved(false);
    try {
      await updateUserRole(userId, newRole);
      router.refresh();
      showSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון תפקיד");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive() {
    if (isSelf) return;
    const action = isActive ? "להשבית" : "להפעיל";
    if (!confirm(`האם אתה בטוח שברצונך ${action} משתמש זה?`)) return;
    setLoading(true);
    setSaved(false);
    try {
      await toggleUserActive(userId);
      router.refresh();
      showSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון סטטוס");
    } finally {
      setLoading(false);
    }
  }

  if (isSelf) {
    return <span className="text-xs text-[#676879]">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentRole}
        onChange={handleRoleChange}
        disabled={loading}
        className="border border-[#e6e9ef] rounded-md px-2 py-1 text-xs bg-white"
      >
        {Object.entries(roleLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleActive}
        disabled={loading}
        className={`text-xs px-2 h-7 ${isActive ? "text-[#e2445c] hover:text-[#e2445c]" : "text-[#00c875] hover:text-[#00c875]"}`}
      >
        {loading
          ? "מעדכן..."
          : isActive
            ? "השבת"
            : "הפעל"}
      </Button>
      {saved && !loading && (
        <span className="text-xs text-[#00c875] font-medium">עודכן</span>
      )}
    </div>
  );
}
