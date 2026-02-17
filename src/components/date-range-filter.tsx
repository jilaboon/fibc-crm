"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  basePath?: string;
}

export function DateRangeFilter({ basePath }: DateRangeFilterProps) {
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
      const qs = params.toString();
      router.push(basePath ? `${basePath}?${qs}` : `?${qs}`);
    },
    [router, searchParams, basePath]
  );

  const clearFilters = useCallback(() => {
    router.push(basePath ?? "?");
  }, [router, basePath]);

  const hasFilters = searchParams.has("from") || searchParams.has("to");

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e6e9ef] bg-white p-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">מתאריך</label>
        <Input
          type="date"
          className="h-8 w-[150px] text-sm"
          value={searchParams.get("from") ?? ""}
          onChange={(e) => updateParam("from", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">עד תאריך</label>
        <Input
          type="date"
          className="h-8 w-[150px] text-sm"
          value={searchParams.get("to") ?? ""}
          onChange={(e) => updateParam("to", e.target.value)}
        />
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
