"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PortalDealsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("?");
  }, [router]);

  const hasFilters = searchParams.has("stage");

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e6e9ef] bg-white p-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">שלב</label>
        <Select
          value={searchParams.get("stage") ?? ""}
          onValueChange={(v) => updateParam("stage", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[160px] text-sm">
            <SelectValue placeholder="כל השלבים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל השלבים</SelectItem>
            <SelectItem value="Negotiation">משא ומתן</SelectItem>
            <SelectItem value="Contract">חוזה</SelectItem>
            <SelectItem value="ClosedWon">נסגר בהצלחה</SelectItem>
            <SelectItem value="ClosedLost">נסגר ללא הצלחה</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-[#676879] hover:text-[#323338]"
        >
          נקה סינון
        </Button>
      )}
    </div>
  );
}
