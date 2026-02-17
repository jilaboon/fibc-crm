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
import { createAmbassador } from "@/lib/actions";

export function NewAmbassadorDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createAmbassador(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה ביצירת שגריר");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button>שגריר חדש</Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>יצירת שגריר</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">שם מלא</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">אימייל</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">טלפון</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">מדינה</Label>
                <Input id="country" name="country" defaultValue="Israel" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">עיר</Label>
                <Input id="city" name="city" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="languages">שפות (מופרדות בפסיקים)</Label>
              <Input
                id="languages"
                name="languages"
                placeholder="עברית,אנגלית"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="occupation">תעסוקה</Label>
              <Input
                id="occupation"
                name="occupation"
                placeholder="למשל: עורך דין, רואה חשבון"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hostsEvents"
                name="hostsEvents"
                value="true"
                className="h-4 w-4"
              />
              <Label htmlFor="hostsEvents">מארח אירועים</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "יוצר שגריר..." : "יצירת שגריר"}
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
