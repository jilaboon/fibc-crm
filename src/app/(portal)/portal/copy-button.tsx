"use client";

import { useState } from "react";

export function CopyButton({ text, variant = "dark" }: { text: string; variant?: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded transition-colors shrink-0 ${
        variant === "light"
          ? "bg-[#0073ea] hover:bg-[#0060c2] text-white"
          : "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
      }`}
      title="העתק קישור"
    >
      {copied ? "הועתק!" : "העתק"}
    </button>
  );
}
