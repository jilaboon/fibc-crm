"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLeadTask, toggleLeadTask } from "@/lib/actions";

interface Task {
  id: string;
  subject: string;
  dueDate: Date;
  dueTime: string | null;
  completed: boolean;
}

export function LeadTasks({
  leadId,
  tasks,
}: {
  leadId: string;
  tasks: Task[];
}) {
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const subject = formData.get("subject") as string;
      const dueDate = formData.get("dueDate") as string;
      const dueTime = formData.get("dueTime") as string;
      await createLeadTask(leadId, subject, dueDate, dueTime);
      form.reset();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה ביצירת משימה");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(taskId: string) {
    setTogglingId(taskId);
    try {
      await toggleLeadTask(taskId, leadId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בעדכון משימה");
    } finally {
      setTogglingId(null);
    }
  }

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("he-IL");
  }

  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 rounded border border-[#e6e9ef]"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                disabled={togglingId === task.id}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                  {task.subject}
                </span>
                <div className="text-xs text-muted-foreground">
                  {formatDate(task.dueDate)}
                  {task.dueTime && ` ${task.dueTime}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">אין משימות עדיין.</p>
      )}

      <form onSubmit={handleCreate} className="space-y-3 border-t border-[#e6e9ef] pt-3">
        <Input name="subject" placeholder="נושא המשימה" required />
        <div className="flex gap-2">
          <Input name="dueDate" type="date" required className="flex-1" />
          <Input name="dueTime" type="time" className="w-[120px]" />
        </div>
        <Button type="submit" size="sm" disabled={loading} className="w-full">
          {loading ? "מוסיף..." : "הוסף משימה"}
        </Button>
      </form>
    </div>
  );
}
