import { readData } from "@/lib/data";
import WhyUsEditor from "./editor";
import type { WhyUsData } from "./actions";

export default async function WhyUsPage() {
  const data = await readData<WhyUsData>("why-us.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Why Us</h1>
        <p className="text-gray-500 text-sm mt-1">Stats, bullet points, and core values.</p>
      </div>
      <WhyUsEditor initialData={data} />
    </div>
  );
}
