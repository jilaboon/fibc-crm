"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { matchToDeveloper } from "@/lib/actions";

interface Developer {
  id: string;
  companyName: string;
  contactName: string;
  buildAreas: string;
  projectType: string;
  priceRange: string | null;
}

interface Props {
  leadId: string;
  suggestions: Developer[];
  allDevelopers: Developer[];
}

export function MatchDeveloperSection({
  leadId,
  suggestions,
  allDevelopers,
}: Props) {
  return (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            התאמות מוצעות לפי אזור:
          </p>
          {suggestions.map((dev) => (
            <div
              key={dev.id}
              className="flex items-center justify-between rounded-lg border border-[#e6e9ef] p-3 hover:shadow-sm transition-shadow bg-white"
            >
              <div>
                <p className="font-medium text-[#323338]">{dev.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {dev.buildAreas} &middot; {dev.projectType}
                  {dev.priceRange ? ` \u00B7 ${dev.priceRange}` : ""}
                </p>
              </div>
              <form
                action={async () => {
                  await matchToDeveloper(leadId, dev.id);
                }}
              >
                <Button
                  size="sm"
                  type="submit"
                  className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
                >
                  התאם
                </Button>
              </form>
            </div>
          ))}
          <Separator />
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">
          או בחר יזם:
        </p>
        <form
          action={async (formData) => {
            const developerId = formData.get("developerId") as string;
            if (developerId) {
              await matchToDeveloper(leadId, developerId);
            }
          }}
          className="flex gap-2 items-end"
        >
          <div className="flex-1">
            <select
              name="developerId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">בחר יזם...</option>
              {allDevelopers.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.companyName} ({dev.buildAreas})
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
          >
            התאם
          </Button>
        </form>
      </div>
    </div>
  );
}
