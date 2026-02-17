"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateLeadDealType } from "@/lib/actions";

const dealTypes = [
  { value: "", label: "בחר..." },
  { value: "Investment", label: "השקעה" },
  { value: "Vacation", label: "דירת נופש" },
  { value: "Aliyah", label: "תכנון עלייה" },
];

export function DealTypeSelect({
  leadId,
  currentDealType,
}: {
  leadId: string;
  currentDealType: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newDealType = e.target.value;
    if (newDealType === (currentDealType || "")) return;
    setLoading(true);
    setSaved(false);
    try {
      await updateLeadDealType(leadId, newDealType);
      router.refresh();
      showSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון סוג עסקה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <div className="relative">
        <select
          value={currentDealType || ""}
          onChange={handleChange}
          disabled={loading}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm disabled:opacity-60"
        >
          {dealTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select>
        {loading && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            מעדכן...
          </span>
        )}
      </div>
      {saved && !loading && (
        <span className="text-xs text-[#00c875] font-medium">עודכן</span>
      )}
    </div>
  );
}
