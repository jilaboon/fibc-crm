"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  endpoint: string;
  label?: string;
}

export function ExportButton({ endpoint, label = "ייצוא לאקסל" }: ExportButtonProps) {
  const searchParams = useSearchParams();

  const handleExport = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const qs = params.toString();
    window.open(`${endpoint}${qs ? `?${qs}` : ""}`, "_blank");
  };

  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
