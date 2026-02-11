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

type Ambassador = {
  id: string;
  fullName: string;
};

export function InviteUserDialog({
  ambassadors,
}: {
  ambassadors: Ambassador[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("AGENT");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await inviteUser(formData);
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "שגיאה ביצירת משתמש");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ הזמן משתמש</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הזמנת משתמש חדש</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
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
          {selectedRole === "AMBASSADOR" && ambassadors.length > 0 && (
            <div className="space-y-2">
              <Label>קישור לשגריר</Label>
              <select
                name="ambassadorId"
                className="w-full border border-[#e6e9ef] rounded-md p-2 text-sm"
              >
                <option value="">— בחר שגריר —</option>
                {ambassadors.map((amb) => (
                  <option key={amb.id} value={amb.id}>
                    {amb.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "יוצר..." : "צור משתמש"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
