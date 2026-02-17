"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertLeadToAmbassador } from "@/lib/actions";

interface ConvertToAmbassadorDialogProps {
  leadId: string;
  leadName: string;
  leadEmail: string;
}

export function ConvertToAmbassadorDialog({
  leadId,
  leadName,
  leadEmail,
}: ConvertToAmbassadorDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      await convertLeadToAmbassador(leadId, password);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בהמרת ליד לשגריר");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#7e3af2] text-[#7e3af2] hover:bg-[#7e3af2]/10">
          המר לשגריר
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>המרת ליד לשגריר</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className="grid gap-4">
            <div className="grid gap-2">
              <Label>שם</Label>
              <div className="text-sm text-[#323338] bg-[#f5f6f8] rounded-md px-3 py-2">
                {leadName}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>אימייל</Label>
              <div className="text-sm text-[#323338] bg-[#f5f6f8] rounded-md px-3 py-2">
                {leadEmail}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">סיסמה לפורטל</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="לפחות 6 תווים"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-[#7e3af2] hover:bg-[#6c2bd9]">
              {loading ? "ממיר..." : "המר לשגריר"}
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
