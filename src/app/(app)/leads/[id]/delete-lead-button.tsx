"use client";

import { deleteLead } from "@/lib/actions";
import { DeleteButton } from "@/components/delete-button";

export function DeleteLeadButton({
  leadId,
  leadName,
}: {
  leadId: string;
  leadName: string;
}) {
  return (
    <DeleteButton
      itemName={leadName}
      onDelete={() => deleteLead(leadId)}
      redirectTo="/leads"
    />
  );
}
