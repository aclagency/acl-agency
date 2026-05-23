"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  sectionLabel: string;
  headline: string;
  subheadline: string;
}

export async function saveContact(data: ContactData) {
  await writeData("contact.json", data);
  revalidatePath("/");
}
