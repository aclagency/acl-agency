import { readData } from "@/lib/data";
import ServicesEditor from "./editor";
import type { ServicesData } from "./actions";

export default async function ServicesPage() {
  const data = await readData<ServicesData>("services.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-500 text-sm mt-1">Service cards, icons, tags, and insurance partners.</p>
      </div>
      <ServicesEditor initialData={data} />
    </div>
  );
}
