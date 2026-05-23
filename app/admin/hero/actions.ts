"use server";
import { writeData } from "@/lib/data";
import { revalidatePath } from "next/cache";

export interface HeroData {
  badge: string;
  headlineMain: string;
  headlineAccent: string;
  headlineEnd: string;
  subheadline: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
  trustItems: string[];
}

export async function saveHero(data: HeroData) {
  await writeData("hero.json", data);
  revalidatePath("/");
}
