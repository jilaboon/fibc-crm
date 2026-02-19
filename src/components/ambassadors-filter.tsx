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
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export function AmbassadorsFilter() {
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

  const sortReferrals = searchParams.get("sortReferrals");

  const cycleSortReferrals = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!sortReferrals) {
      params.set("sortReferrals", "desc");
    } else if (sortReferrals === "desc") {
      params.set("sortReferrals", "asc");
    } else {
      params.delete("sortReferrals");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }, [router, searchParams, sortReferrals]);

  const hasFilters =
    searchParams.has("from") ||
    searchParams.has("to") ||
    searchParams.has("country") ||
    searchParams.has("language") ||
    searchParams.has("sortReferrals");

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
        <label className="text-xs font-medium text-[#676879]">שפה</label>
        <Select
          value={searchParams.get("language") ?? ""}
          onValueChange={(v) => updateParam("language", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-[130px] text-sm">
            <SelectValue placeholder="כל השפות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל השפות</SelectItem>
            <SelectItem value="Hebrew">עברית</SelectItem>
            <SelectItem value="English">אנגלית</SelectItem>
            <SelectItem value="French">צרפתית</SelectItem>
            <SelectItem value="Russian">רוסית</SelectItem>
            <SelectItem value="Spanish">ספרדית</SelectItem>
            <SelectItem value="Arabic">ערבית</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[#676879]">מיין לפי הפניות</label>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-[140px] text-sm gap-1"
          onClick={cycleSortReferrals}
        >
          הפניות
          {sortReferrals === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : sortReferrals === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
        </Button>
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
