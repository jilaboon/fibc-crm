"use client";

import { useState, useOptimistic, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions";

const statuses = [
  { value: "New", label: "חדש", bg: "#579bfc" },
  { value: "Contacted", label: "נוצר קשר", bg: "#fdab3d" },
  { value: "Meeting1", label: "פגישה 1", bg: "#a25ddc" },
  { value: "Meeting2", label: "פגישה 2", bg: "#9b59b6" },
  { value: "Negotiation", label: "משא ומתן", bg: "#0073ea" },
  { value: "Registration", label: "הרשמה", bg: "#00c875" },
  { value: "Contract", label: "חוזה", bg: "#00a85e" },
  { value: "NotRelevant", label: "לא רלוונטי", bg: "#e2445c" },
];

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus);
  const router = useRouter();
  const current = statuses.find((s) => s.value === optimisticStatus);

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  useEffect(() => {
    return () => setSaved(false);
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === optimisticStatus) return;
    setLoading(true);
    setOptimisticStatus(newStatus);
    try {
      await updateLeadStatus(leadId, newStatus);
      router.refresh();
      showSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון סטטוס");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={optimisticStatus}
        onChange={handleChange}
        disabled={loading}
        style={{ backgroundColor: current?.bg || "#579bfc" }}
        className="text-white text-sm font-medium rounded-full px-4 py-1 border-0 cursor-pointer appearance-none text-center min-w-[120px] disabled:opacity-60"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {loading && (
        <span className="text-xs text-muted-foreground">מעדכן...</span>
      )}
      {saved && !loading && (
        <span className="text-xs text-[#00c875] font-medium">עודכן</span>
      )}
    </div>
  );
}
