"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 600);
  }

  return (
    <button
      onClick={handleRefresh}
      title="רענן נתונים"
      className="p-2 rounded-lg hover:bg-gray-100 text-[#676879] hover:text-[#323338] transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={spinning ? "animate-spin" : ""}
      >
        <path d="M21.5 2v6h-6" />
        <path d="M2.5 22v-6h6" />
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8" />
        <path d="M22 12.5a10 10 0 0 1-18.8 4.2L2.5 16" />
      </svg>
    </button>
  );
}
