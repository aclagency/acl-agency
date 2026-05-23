import { readData } from "@/lib/data";
import TestimonialsEditor from "./editor";
import type { TestimonialsData } from "./actions";

export default async function TestimonialsPage() {
  const data = await readData<TestimonialsData>("testimonials.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">Add, edit, and remove client reviews.</p>
      </div>
      <TestimonialsEditor initialData={data} />
    </div>
  );
}
