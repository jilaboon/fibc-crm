"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
      title="העתק קישור"
    >
      {copied ? "הועתק!" : "העתק"}
    </button>
  );
}
