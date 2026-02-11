"use client";

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
  return (
    <form
      action={async (formData) => {
        const ambassadorId = formData.get("ambassadorId") as string;
        if (ambassadorId) {
          await assignAmbassador(leadId, ambassadorId);
        }
      }}
      className="flex gap-2 items-end"
    >
      <div className="flex-1">
        <select
          name="ambassadorId"
          defaultValue={currentAmbassadorId || ""}
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
        className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
      >
        שייך
      </Button>
    </form>
  );
}
