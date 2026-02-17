"use client";

import { useState } from "react";
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
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newDealType = e.target.value;
    if (newDealType === (currentDealType || "")) return;
    setLoading(true);
    try {
      await updateLeadDealType(leadId, newDealType);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון סוג עסקה");
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}
