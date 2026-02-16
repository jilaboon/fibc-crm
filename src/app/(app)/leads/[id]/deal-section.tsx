"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { updateDealStage } from "@/lib/actions";

interface Deal {
  id: string;
  stage: string;
  notes: string | null;
  developer: {
    companyName: string;
    contactName: string;
  };
  ambassador: {
    fullName: string;
  } | null;
}

export function DealSection({ deal }: { deal: Deal }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const isTerminal = deal.stage === "ClosedWon" || deal.stage === "ClosedLost";
  const isLoading = loading !== null;

  async function handleStageChange(stage: string) {
    setLoading(stage);
    try {
      await updateDealStage(deal.id, stage);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון שלב");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">שלב</span>
          <StatusBadge status={deal.stage} />
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">יזם</span>
          <span>{deal.developer.companyName}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">איש קשר</span>
          <span>{deal.developer.contactName}</span>
        </div>
        {deal.ambassador && (
          <>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">שגריר</span>
              <span>{deal.ambassador.fullName}</span>
            </div>
          </>
        )}
        {deal.notes && (
          <>
            <Separator />
            <div>
              <span className="text-muted-foreground">הערות</span>
              <p className="mt-1">{deal.notes}</p>
            </div>
          </>
        )}
      </div>

      {!isTerminal && (
        <div className="flex flex-wrap gap-2 pt-2">
          {deal.stage === "Negotiation" && (
            <Button
              size="sm"
              disabled={isLoading}
              onClick={() => handleStageChange("Contract")}
              className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
            >
              {loading === "Contract" ? "מעדכן..." : "העבר לחוזה"}
            </Button>
          )}
          {(deal.stage === "Negotiation" || deal.stage === "Contract") && (
            <>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => handleStageChange("ClosedWon")}
                className="bg-[#00c875] hover:bg-[#00a85e] text-white"
              >
                {loading === "ClosedWon" ? "מעדכן..." : "נסגר בהצלחה"}
              </Button>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => handleStageChange("ClosedLost")}
                className="bg-[#e2445c] hover:bg-[#c93a4e] text-white"
              >
                {loading === "ClosedLost" ? "מעדכן..." : "נסגר ללא הצלחה"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
