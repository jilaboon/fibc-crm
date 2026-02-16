"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function handleMatch(developerId: string) {
    setLoading(developerId);
    try {
      await matchToDeveloper(leadId, developerId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בהתאמה");
    } finally {
      setLoading(null);
    }
  }

  async function handleSelectMatch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const developerId = formData.get("developerId") as string;
    if (!developerId) return;
    await handleMatch(developerId);
  }

  const isLoading = loading !== null;

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
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#e6e9ef] p-3 hover:shadow-sm transition-shadow bg-white"
            >
              <div>
                <p className="font-medium text-[#323338]">{dev.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {dev.buildAreas} &middot; {dev.projectType}
                  {dev.priceRange ? ` \u00B7 ${dev.priceRange}` : ""}
                </p>
              </div>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => handleMatch(dev.id)}
                className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
              >
                {loading === dev.id ? "מתאים..." : "התאם"}
              </Button>
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
          onSubmit={handleSelectMatch}
          className="flex flex-col sm:flex-row gap-2 sm:items-end"
        >
          <div className="flex-1">
            <select
              name="developerId"
              disabled={isLoading}
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
            disabled={isLoading}
            className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
          >
            {loading === "select" ? "מתאים..." : "התאם"}
          </Button>
        </form>
      </div>
    </div>
  );
}
