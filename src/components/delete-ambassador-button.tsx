"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAmbassador } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  ambassadorId: string;
  ambassadorName: string;
  leadsCount: number;
};

export function DeleteAmbassadorButton({
  ambassadorId,
  ambassadorName,
  leadsCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<"only" | "with-leads" | null>(null);
  const router = useRouter();
  const isLoading = loading !== null;

  async function handleDelete(withLeads: boolean) {
    setLoading(withLeads ? "with-leads" : "only");
    try {
      await deleteAmbassador(ambassadorId, withLeads);
      router.push("/ambassadors");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה במחיקה");
      setLoading(null);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-[#e2445c] hover:text-[#e2445c] hover:bg-red-50"
      >
        מחק
      </Button>
      <Dialog open={open} onOpenChange={(v) => !isLoading && setOpen(v)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>מחיקת שגריר — {ambassadorName}</DialogTitle>
            <DialogDescription>
              {leadsCount > 0
                ? `לשגריר זה יש ${leadsCount} לידים מקושרים. בחר כיצד לטפל בהם:`
                : "האם אתה בטוח שברצונך למחוק שגריר זה? פעולה זו אינה ניתנת לביטול."}
            </DialogDescription>
          </DialogHeader>
          {leadsCount > 0 ? (
            <div className="flex flex-col gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => handleDelete(false)}
                disabled={isLoading}
                className="justify-start text-right h-auto py-3 px-4"
              >
                <div>
                  <div className="font-medium">
                    {loading === "only" ? "מוחק..." : "מחק את השגריר בלבד"}
                  </div>
                  <div className="text-xs text-[#676879] mt-0.5">
                    הלידים יישארו במערכת ללא שגריר מקושר
                  </div>
                </div>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(true)}
                disabled={isLoading}
                className="justify-start text-right h-auto py-3 px-4"
              >
                <div>
                  <div className="font-medium">
                    {loading === "with-leads" ? "מוחק..." : "מחק את השגריר ואת כל הלידים שלו"}
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">
                    {leadsCount} לידים יימחקו לצמיתות
                  </div>
                </div>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                ביטול
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                ביטול
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(false)}
                disabled={isLoading}
              >
                {loading === "only" ? "מוחק..." : "מחק"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
