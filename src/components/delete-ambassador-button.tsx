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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete(withLeads: boolean) {
    setLoading(true);
    try {
      await deleteAmbassador(ambassadorId, withLeads);
      router.push("/ambassadors");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה במחיקה");
      setLoading(false);
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
      <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
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
                disabled={loading}
                className="justify-start text-right h-auto py-3 px-4"
              >
                <div>
                  <div className="font-medium">מחק את השגריר בלבד</div>
                  <div className="text-xs text-[#676879] mt-0.5">
                    הלידים יישארו במערכת ללא שגריר מקושר
                  </div>
                </div>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(true)}
                disabled={loading}
                className="justify-start text-right h-auto py-3 px-4"
              >
                <div>
                  <div className="font-medium">מחק את השגריר ואת כל הלידים שלו</div>
                  <div className="text-xs text-white/80 mt-0.5">
                    {leadsCount} לידים יימחקו לצמיתות
                  </div>
                </div>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                ביטול
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                ביטול
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(false)}
                disabled={loading}
              >
                {loading ? "מוחק..." : "מחק"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
