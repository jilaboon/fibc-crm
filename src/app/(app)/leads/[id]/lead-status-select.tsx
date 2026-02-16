"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions";

const statuses = [
  { value: "New", label: "חדש", bg: "#579bfc" },
  { value: "Contacted", label: "נוצר קשר", bg: "#fdab3d" },
  { value: "Qualified", label: "מתאים", bg: "#a25ddc" },
  { value: "Matched", label: "הותאם", bg: "#0073ea" },
  { value: "ClosedWon", label: "נסגר בהצלחה", bg: "#00c875" },
  { value: "ClosedLost", label: "נסגר ללא הצלחה", bg: "#e2445c" },
];

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const current = statuses.find((s) => s.value === currentStatus);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    setLoading(true);
    try {
      await updateLeadStatus(leadId, newStatus);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון סטטוס");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={loading}
      style={{ backgroundColor: current?.bg || "#579bfc" }}
      className="text-white text-sm font-medium rounded-full px-4 py-1 border-0 cursor-pointer appearance-none text-center min-w-[120px] disabled:opacity-60"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {loading && s.value === currentStatus ? "מעדכן..." : s.label}
        </option>
      ))}
    </select>
  );
}
