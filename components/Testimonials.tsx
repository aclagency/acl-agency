import { readData } from "@/lib/data";

interface TestimonialItem {
  id: string;
  name: string;
  title: string;
  body: string;
  rating: number;
  order: number;
}

interface TestimonialsData {
  sectionLabel: string;
  heading: string;
  items: TestimonialItem[];
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-[#0A2342] dark:text-[#7DD3FC]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  );
}

export default async function Testimonials() {
  const data = await readData<TestimonialsData>("testimonials.json");
  const sorted = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <section id="reviews" className="py-24 lg:py-32 bg-[#F5F5F7] dark:bg-[#0D1117]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0A2342] dark:text-[#7DD3FC] text-sm font-semibold uppercase tracking-widest mb-3">
            {data.sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1F] dark:text-[#F1F5F9] tracking-tight">
            {data.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sorted.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#D2D2D7]/40 dark:border-[#334155]/40 flex flex-col"
            >
              <StarRating count={review.rating} />
              <blockquote className="mt-5 text-[#1D1D1F] dark:text-[#F1F5F9] text-sm leading-relaxed flex-1">
                &ldquo;{review.body}&rdquo;
              </blockquote>
              <div className="mt-6 pt-6 border-t border-[#F5F5F7] dark:border-[#334155]">
                <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-semibold text-sm">{review.name}</p>
                <p className="text-[#6E6E73] dark:text-[#94A3B8] text-xs mt-0.5">{review.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
