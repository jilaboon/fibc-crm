"use client";

import { useState } from "react";
import { submitReferral } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export function ReferralForm({
  ambassadorId,
  referralCode,
}: {
  ambassadorId: string;
  referralCode: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [budget, setBudget] = useState("");
  const [preferredArea, setPreferredArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [readiness, setReadiness] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("ambassadorId", ambassadorId);
    formData.set("referralCode", referralCode);
    formData.set("budget", budget);
    formData.set("preferredArea", preferredArea);
    formData.set("rooms", rooms);
    formData.set("propertyType", propertyType);
    formData.set("readiness", readiness);

    try {
      await submitReferral(formData);
      setSubmitted(true);
    } catch {
      setError("אירעה שגיאה, נסו שוב מאוחר יותר");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="size-16 text-[#00c875]" />
        <h2 className="text-xl font-semibold">!תודה! פנייתך התקבלה</h2>
        <p className="text-muted-foreground">
          נציג שלנו ייצור איתך קשר בהקדם
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">שם מלא</Label>
        <Input id="fullName" name="fullName" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" required dir="ltr" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">טלפון</Label>
        <Input id="phone" name="phone" type="tel" dir="ltr" />
      </div>

      <div className="space-y-2">
        <Label>תקציב</Label>
        <Select value={budget} onValueChange={setBudget}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחרו תקציב" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="עד 1.5M ₪">עד 1.5M &#x20AA;</SelectItem>
            <SelectItem value="1.5M-2M ₪">1.5M-2M &#x20AA;</SelectItem>
            <SelectItem value="2M-3M ₪">2M-3M &#x20AA;</SelectItem>
            <SelectItem value="3M-5M ₪">3M-5M &#x20AA;</SelectItem>
            <SelectItem value="5M+ ₪">5M+ &#x20AA;</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>אזור מועדף</Label>
        <Select value={preferredArea} onValueChange={setPreferredArea}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחרו אזור" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="תל אביב">תל אביב</SelectItem>
            <SelectItem value="הרצליה">הרצליה</SelectItem>
            <SelectItem value="נתניה">נתניה</SelectItem>
            <SelectItem value="ירושלים">ירושלים</SelectItem>
            <SelectItem value="אחר">אחר</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>חדרים</Label>
          <Select value={rooms} onValueChange={setRooms}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="חדרים" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="5+">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>סוג נכס</Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="סוג נכס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="דירה">דירה</SelectItem>
              <SelectItem value="פנטהאוז">פנטהאוז</SelectItem>
              <SelectItem value="וילה">וילה</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>מוכנות</Label>
        <Select value={readiness} onValueChange={setReadiness}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="מתי תרצו לרכוש?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="מיידי">מיידי</SelectItem>
            <SelectItem value="3-6 חודשים">3-6 חודשים</SelectItem>
            <SelectItem value="6-12 חודשים">6-12 חודשים</SelectItem>
            <SelectItem value="12+ חודשים">12+ חודשים</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">הערות</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm resize-none"
          placeholder="מידע נוסף שתרצו לשתף..."
        />
      </div>

      {error && (
        <div className="text-sm text-[#e2445c] text-center">{error}</div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "שולח..." : "שליחת פנייה"}
      </Button>
    </form>
  );
}
