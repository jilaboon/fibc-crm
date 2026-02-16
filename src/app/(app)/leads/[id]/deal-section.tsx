"use client";

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
  const isTerminal = deal.stage === "ClosedWon" || deal.stage === "ClosedLost";

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
            <form
              action={async () => {
                await updateDealStage(deal.id, "Contract");
              }}
            >
              <Button
                type="submit"
                size="sm"
                className="bg-[#0073ea] hover:bg-[#0060c2] text-white"
              >
                העבר לחוזה
              </Button>
            </form>
          )}
          {(deal.stage === "Negotiation" || deal.stage === "Contract") && (
            <>
              <form
                action={async () => {
                  await updateDealStage(deal.id, "ClosedWon");
                }}
              >
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#00c875] hover:bg-[#00a85e] text-white"
                >
                  נסגר בהצלחה
                </Button>
              </form>
              <form
                action={async () => {
                  await updateDealStage(deal.id, "ClosedLost");
                }}
              >
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#e2445c] hover:bg-[#c93a4e] text-white"
                >
                  נסגר ללא הצלחה
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
