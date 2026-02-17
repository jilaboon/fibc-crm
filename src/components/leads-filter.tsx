"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadsFilterProps {
  ambassadors: { id: string; fullName: string }[];
  projects: { id: string; companyName: string }[];
}

export function LeadsFilter({ ambassadors, projects }: LeadsFilterProps) {
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
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("?");
  }, [router]);

  const hasFilters =
    searchParams.has("from") ||
    searchParams.has("to") ||
    searchParams.has("ambassador") ||
    searchParams.has("project");

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
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">שגריר</label>
        <Select
          value={searchParams.get("ambassador") ?? ""}
          onValueChange={(v) => updateParam("ambassador", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[160px] text-sm">
            <SelectValue placeholder="כל השגרירים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל השגרירים</SelectItem>
            {ambassadors.map((amb) => (
              <SelectItem key={amb.id} value={amb.id}>
                {amb.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">פרויקט</label>
        <Select
          value={searchParams.get("project") ?? ""}
          onValueChange={(v) => updateParam("project", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[160px] text-sm">
            <SelectValue placeholder="כל הפרויקטים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הפרויקטים</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.companyName}
              </SelectItem>
            ))}
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
