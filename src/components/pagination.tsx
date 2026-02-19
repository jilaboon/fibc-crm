"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
  totalCount: number;
  pageSize?: number;
}

export function Pagination({ totalCount, pageSize = 25 }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10)
  );
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const buttonBase =
    "px-3 py-1.5 text-sm font-medium rounded-md border border-[#e6e9ef] transition-colors";
  const buttonActive =
    "bg-white text-[#323338] hover:bg-[#f6f7fb] cursor-pointer";
  const buttonDisabled = "bg-[#f6f7fb] text-[#c3c6d4] cursor-not-allowed";

  return (
    <div className="flex items-center justify-between pt-4" dir="rtl">
      <div className="text-sm text-[#676879]">
        עמוד {currentPage} מתוך {totalPages} ({totalCount} תוצאות)
      </div>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={buildHref(currentPage - 1)}
            className={`${buttonBase} ${buttonActive}`}
          >
            הקודם
          </Link>
        ) : (
          <span className={`${buttonBase} ${buttonDisabled}`}>הקודם</span>
        )}
        {hasNext ? (
          <Link
            href={buildHref(currentPage + 1)}
            className={`${buttonBase} ${buttonActive}`}
          >
            הבא
          </Link>
        ) : (
          <span className={`${buttonBase} ${buttonDisabled}`}>הבא</span>
        )}
      </div>
    </div>
  );
}
