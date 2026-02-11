"use client";

import { useState } from "react";
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
import { createLead } from "@/lib/actions";

interface Ambassador {
  id: string;
  fullName: string;
}

export function NewLeadDialog({
  ambassadors,
}: {
  ambassadors: Ambassador[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ליד חדש</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>יצירת ליד</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await createLead(formData);
            setOpen(false);
          }}
          className="grid gap-4"
        >
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">מדינה</Label>
              <Input id="country" name="country" defaultValue="Israel" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">עיר</Label>
              <Input id="city" name="city" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="budget">תקציב</Label>
              <Input id="budget" name="budget" placeholder="1.5M-2M NIS" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preferredArea">אזור מועדף</Label>
              <Input id="preferredArea" name="preferredArea" placeholder="תל אביב" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rooms">חדרים</Label>
              <Input id="rooms" name="rooms" placeholder="3-4" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propertyType">סוג נכס</Label>
              <select
                id="propertyType"
                name="propertyType"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">בחר...</option>
                <option value="Apartment">דירה</option>
                <option value="Penthouse">פנטהאוז</option>
                <option value="Villa">וילה</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="readiness">מוכנות</Label>
              <select
                id="readiness"
                name="readiness"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">בחר...</option>
                <option value="Immediate">מיידית</option>
                <option value="3-6 months">3-6 חודשים</option>
                <option value="6-12 months">6-12 חודשים</option>
                <option value="12+ months">+12 חודשים</option>
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ambassadorId">שגריר</Label>
            <select
              id="ambassadorId"
              name="ambassadorId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="">ללא שגריר</option>
              {ambassadors.map((amb) => (
                <option key={amb.id} value={amb.id}>
                  {amb.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">הערות</Label>
            <Input id="notes" name="notes" />
          </div>
          <Button type="submit">יצירת ליד</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
