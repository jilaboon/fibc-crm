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
    searchParams.has("project") ||
    searchParams.has("status") ||
    searchParams.has("country");

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
        <label className="text-xs font-medium text-[#676879]">סטטוס</label>
        <Select
          value={searchParams.get("status") ?? ""}
          onValueChange={(v) => updateParam("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[140px] text-sm">
            <SelectValue placeholder="כל הסטטוסים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="New">חדש</SelectItem>
            <SelectItem value="Contacted">נוצר קשר</SelectItem>
            <SelectItem value="Qualified">מתאים</SelectItem>
            <SelectItem value="Matched">שויך</SelectItem>
            <SelectItem value="Meeting1">פגישה 1</SelectItem>
            <SelectItem value="Meeting2">פגישה 2</SelectItem>
            <SelectItem value="Negotiation">משא ומתן</SelectItem>
            <SelectItem value="Registration">הרשמה</SelectItem>
            <SelectItem value="Contract">חוזה</SelectItem>
            <SelectItem value="ClosedWon">נסגר בהצלחה</SelectItem>
            <SelectItem value="ClosedLost">נסגר ללא הצלחה</SelectItem>
            <SelectItem value="NotRelevant">לא רלוונטי</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">מדינה</label>
        <Select
          value={searchParams.get("country") ?? ""}
          onValueChange={(v) => updateParam("country", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[130px] text-sm">
            <SelectValue placeholder="כל המדינות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל המדינות</SelectItem>
            <SelectItem value="Israel">ישראל</SelectItem>
            <SelectItem value="USA">ארה״ב</SelectItem>
            <SelectItem value="France">צרפת</SelectItem>
            <SelectItem value="UK">בריטניה</SelectItem>
          </SelectContent>
        </Select>
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
