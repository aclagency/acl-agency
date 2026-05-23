import { readData } from "@/lib/data";
import HeroEditor from "./editor";
import type { HeroData } from "./actions";

export default async function HeroPage() {
  const hero = await readData<HeroData>("hero.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the headline, badge, CTAs, and trust bar.</p>
      </div>
      <HeroEditor initialData={hero} />
    </div>
  );
}
