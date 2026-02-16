"use client";

import { useState } from "react";
import { inviteUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InviteUserDialog() {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("AGENT");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await inviteUser(formData);
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה ביצירת משתמש");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button>+ הזמן משתמש</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הזמנת משתמש חדש</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={loading} className="space-y-4">
            <div className="space-y-2">
              <Label>שם מלא</Label>
              <Input name="fullName" required />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input name="email" type="email" required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>סיסמה</Label>
              <Input name="password" type="password" required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>תפקיד</Label>
              <select
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-[#e6e9ef] rounded-md p-2 text-sm"
              >
                <option value="AGENT">סוכן</option>
                <option value="ADMIN">מנהל</option>
                <option value="AMBASSADOR">שגריר</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "יוצר משתמש..." : "צור משתמש"}
            </Button>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
