"use client";

import { deleteDeveloper } from "@/lib/actions";
import { DeleteButton } from "@/components/delete-button";

export function DeleteDeveloperButton({
  developerId,
  developerName,
}: {
  developerId: string;
  developerName: string;
}) {
  return (
    <DeleteButton
      itemName={developerName}
      onDelete={() => deleteDeveloper(developerId)}
      redirectTo="/developers"
    />
  );
}
