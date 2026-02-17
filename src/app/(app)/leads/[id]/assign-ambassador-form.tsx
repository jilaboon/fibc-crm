"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { assignAmbassador } from "@/lib/actions";

interface Props {
  leadId: string;
  currentAmbassadorId: string | null;
  ambassadors: { id: string; fullName: string }[];
}

export function AssignAmbassadorForm({
  leadId,
  currentAmbassadorId,
  ambassadors,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const showSaved = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ambassadorId = formData.get("ambassadorId") as string;
    if (!ambassadorId) return;
    setLoading(true);
    setSaved(false);
    try {
      await assignAmbassador(leadId, ambassadorId);
      router.refresh();
      showSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בשיוך שגריר");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex-1">
          <select
            name="ambassadorId"
            defaultValue={currentAmbassadorId || ""}
            disabled={loading}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            <option value="">בחר שגריר...</option>
            {ambassadors.map((amb) => (
              <option key={amb.id} value={amb.id}>
                {amb.fullName}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
        >
          {loading ? "משייך..." : "שייך"}
        </Button>
      </form>
      {saved && !loading && (
        <span className="text-xs text-[#00c875] font-medium">שגריר שויך בהצלחה</span>
      )}
    </div>
  );
}
