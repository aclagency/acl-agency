"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";
import type { IconId } from "@/lib/icons";

export interface ServiceItem {
  id: string;
  icon: IconId;
  title: string;
  description: string;
  tags: string[];
  order: number;
}

export interface ServicesData {
  sectionLabel: string;
  heading: string;
  subheading: string;
  partnersLabel: string;
  partners: string[];
  items: ServiceItem[];
}

export async function saveServices(data: ServicesData) {
  await writeData("services.json", data);
  revalidatePath("/");
}
