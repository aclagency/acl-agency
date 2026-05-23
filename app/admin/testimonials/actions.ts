"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number;
  order: number;
}

export interface TestimonialsData {
  sectionLabel: string;
  heading: string;
  items: TestimonialItem[];
}

export async function saveTestimonials(data: TestimonialsData) {
  await writeData("testimonials.json", data);
  revalidatePath("/");
}
