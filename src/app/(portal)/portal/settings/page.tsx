"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PortalSettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "הסיסמה חייבת להכיל לפחות 6 תווים" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "הסיסמאות אינן תואמות" });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "הסיסמה עודכנה בהצלחה" });
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "שגיאה בעדכון הסיסמה" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="pt-4 md:pt-2">
      <h1 className="text-2xl font-bold text-[#323338] mb-6">שינוי סיסמה</h1>

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[#323338] mb-1"
            >
              סיסמה חדשה
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-[#e6e9ef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ea] focus:border-transparent"
              placeholder="לפחות 6 תווים"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#323338] mb-1"
            >
              אימות סיסמה חדשה
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-[#e6e9ef] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ea] focus:border-transparent"
              placeholder="הזן שוב את הסיסמה החדשה"
            />
          </div>

          {message && (
            <div
              className={`text-sm rounded-md px-3 py-2 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#0073ea] px-4 py-2 text-sm font-medium text-white hover:bg-[#0060c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "מעדכן..." : "עדכון סיסמה"}
          </button>
        </form>
      </div>
    </div>
  );
}
