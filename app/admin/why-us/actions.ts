"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface WhyUsData {
  sectionLabel: string;
  headline: string;
  description: string;
  bulletPoints: string[];
  coreValues: { label: string; desc: string }[];
  stats: { value: string; label: string }[];
}

export async function saveWhyUs(data: WhyUsData) {
  await writeData("why-us.json", data);
  revalidatePath("/");
}
