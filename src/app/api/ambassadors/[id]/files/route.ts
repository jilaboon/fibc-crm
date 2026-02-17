import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/db";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "text/csv",
];
const BUCKET_NAME = "ambassador-files";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admins can upload ambassador files
  const role =
    (user.app_metadata?.role as string) ||
    (user.user_metadata?.role as string);
  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const ambassador = await prisma.ambassador.findUnique({ where: { id } });
  if (!ambassador) {
    return NextResponse.json({ error: "Ambassador not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File size exceeds 10MB limit" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Accepted: PDF, Excel, CSV" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient();

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const storagePath = `${id}/${Date.now()}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminClient.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  const ambassadorFile = await prisma.ambassadorFile.create({
    data: {
      fileName: file.name,
      fileUrl: publicUrl,
      fileType: ext,
      ambassadorId: id,
    },
  });

  return NextResponse.json(ambassadorFile, { status: 201 });
}
