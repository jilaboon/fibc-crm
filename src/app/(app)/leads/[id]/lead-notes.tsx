"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { addLeadNote } from "@/lib/actions";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

function relativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דקות`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days < 30) return `לפני ${days} ימים`;
  return new Date(date).toLocaleDateString("he-IL");
}

export function LeadNotes({
  leadId,
  notes,
}: {
  leadId: string;
  notes: Note[];
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !content.trim()) return;
    setLoading(true);
    setSaved(false);
    try {
      await addLeadNote(leadId, content.trim());
      setContent("");
      router.refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בהוספת הערה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-3 rounded border border-[#e6e9ef]">
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {relativeTime(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">אין הערות עדיין.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-2 border-t border-[#e6e9ef] pt-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="הוסף הערה..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm resize-none"
        />
        <Button type="submit" size="sm" disabled={loading || !content.trim()} className="w-full">
          {loading ? "מוסיף..." : "הוסף הערה"}
        </Button>
        {saved && !loading && (
          <span className="text-xs text-[#00c875] font-medium">הערה נוספה</span>
        )}
      </form>
    </div>
  );
}
