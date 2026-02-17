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
import { createDeveloper } from "@/lib/actions";

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createDeveloper(formData);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה ביצירת פרויקט");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button>פרויקט חדש</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>יצירת פרויקט</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">שם הפרויקט</Label>
              <Input id="companyName" name="companyName" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="developerName">יזם</Label>
              <Input id="developerName" name="developerName" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">עיר</Label>
              <Input id="city" name="city" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactName">איש קשר/מכירות</Label>
              <Input id="contactName" name="contactName" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">אימייל</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="buildAreas">אזורי בנייה (מופרדים בפסיקים)</Label>
              <Input
                id="buildAreas"
                name="buildAreas"
                placeholder="תל אביב,הרצליה"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="projectType">סוג פרויקט</Label>
                <Input
                  id="projectType"
                  name="projectType"
                  placeholder="דירות,פנטהאוז,וילות"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priceRange">טווח מחירים</Label>
                <Input
                  id="priceRange"
                  name="priceRange"
                  placeholder='לדוגמה: 1M-3M ש"ח'
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apartmentMix">תמהיל דירות</Label>
              <Input
                id="apartmentMix"
                name="apartmentMix"
                placeholder="3,4,5 חדרים + פנטהאוז"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "יוצר פרויקט..." : "יצירת פרויקט"}
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
