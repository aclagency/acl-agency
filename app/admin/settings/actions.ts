"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface SettingsData {
  logoUrl: string;
  companyName: string;
  companyShort: string;
  companySuffix: string;
  logoText: string;
  regNumber: string;
  tagline: string;
  established: string;
  description: string;
  clientPortal: string;
  metaTitle: string;
  metaDescription: string;
  navLinks: { label: string; href: string }[];
  navCTA: { text: string; href: string };
}

export async function saveSettings(data: SettingsData) {
  await writeData("settings.json", data);
  revalidatePath("/");
}
