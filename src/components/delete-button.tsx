"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  itemName: string;
  onDelete: () => Promise<void>;
  redirectTo: string;
};

export function DeleteButton({ itemName, onDelete, redirectTo }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete();
      router.push(redirectTo);
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>מחיקת {itemName}</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך למחוק? פעולה זו אינה ניתנת לביטול.
            </DialogDescription>
          </DialogHeader>
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
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "מוחק..." : "מחק"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
