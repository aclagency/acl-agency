import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { readData, writeData } from "@/lib/data";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = (formData.get("type") as string) || "image";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(process.cwd(), "public", "uploads", "cms");
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/cms/${filename}`;
  const entry = { id: Date.now().toString(), name: file.name, url, type: file.type, size: file.size, uploadedAt: new Date().toISOString() };

  const media = await readData<{ images: typeof entry[]; icons: typeof entry[] }>("media.json");
  if (type === "icon") media.icons.push(entry);
  else media.images.push(entry);
  await writeData("media.json", media);

  return NextResponse.json(entry);
}

export async function DELETE(request: NextRequest) {
  const { id, type } = await request.json();
  const media = await readData<{ images: { id: string }[]; icons: { id: string }[] }>("media.json");
  if (type === "icon") media.icons = media.icons.filter((i) => i.id !== id);
  else media.images = media.images.filter((i) => i.id !== id);
  await writeData("media.json", media);
  return NextResponse.json({ success: true });
}
