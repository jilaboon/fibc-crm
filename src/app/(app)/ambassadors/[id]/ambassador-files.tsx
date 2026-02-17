"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteAmbassadorFile } from "@/lib/actions";

interface AmbFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

const fileTypeLabel: Record<string, string> = {
  pdf: "PDF",
  xlsx: "Excel",
  xls: "Excel",
  csv: "CSV",
};

export function AmbassadorFiles({
  ambassadorId,
  files: initialFiles,
}: {
  ambassadorId: string;
  files: AmbFile[];
}) {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/ambassadors/${ambassadorId}/files`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "שגיאה בהעלאת קובץ");
      }

      const newFile = await res.json();
      setFiles((prev) => [newFile, ...prev]);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה בהעלאת קובץ");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(fileId: string) {
    if (!confirm("למחוק את הקובץ?")) return;
    setDeleting(fileId);
    try {
      await deleteAmbassadorFile(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "שגיאה במחיקת קובץ");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <Button asChild disabled={uploading} size="sm">
            <span>{uploading ? "מעלה..." : "העלאת הסכם"}</span>
          </Button>
        </label>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">אין מסמכים עדיין.</p>
      ) : (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={file.id}>
              {i > 0 && <Separator className="bg-[#e6e9ef] my-2" />}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium text-[#676879] bg-[#f6f7fb] px-2 py-0.5 rounded shrink-0">
                    {fileTypeLabel[file.fileType] || file.fileType.toUpperCase()}
                  </span>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#0073ea] hover:underline truncate"
                  >
                    {file.fileName}
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleting === file.id}
                  onClick={() => handleDelete(file.id)}
                  className="text-[#e2445c] hover:text-[#c93a4e] hover:bg-red-50 shrink-0 h-7 px-2"
                >
                  {deleting === file.id ? "..." : "מחק"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
