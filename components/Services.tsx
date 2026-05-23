import { readData } from "@/lib/data";
import { ICONS } from "@/lib/icons";
import type { IconId } from "@/lib/icons";

interface ServiceItem {
  id: string;
  icon: IconId;
  title: string;
  description: string;
  tags: string[];
  order: number;
}

interface ServicesData {
  sectionLabel: string;
  heading: string;
  subheading: string;
  partnersLabel: string;
  partners: string[];
  items: ServiceItem[];
}

export default async function Services() {
  const data = await readData<ServicesData>("services.json");
  const sorted = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <section id="services" className="py-24 lg:py-32 bg-[#F5F5F7] dark:bg-[#0D1117]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-[#0A2342] dark:text-[#7DD3FC] text-sm font-semibold uppercase tracking-widest mb-3">
            {data.sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1F] dark:text-[#F1F5F9] tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-[#6E6E73] dark:text-[#94A3B8] text-lg max-w-xl mx-auto">
            {data.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((service) => {
            const icon = ICONS[service.icon] ?? ICONS["briefcase"];
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 hover:shadow-md dark:hover:shadow-[#0D1117] transition-shadow duration-300 border border-[#D2D2D7]/40 dark:border-[#334155]/40 flex flex-col"
              >
                <div className="w-12 h-12 bg-[#EEF2F7] dark:bg-[#0F172A] rounded-xl flex items-center justify-center text-[#0A2342] dark:text-[#7DD3FC] mb-5">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {icon.paths.map((p, i) => (
                      <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />
                    ))}
                  </svg>
                </div>
                <h3 className="text-[#1D1D1F] dark:text-[#F1F5F9] font-semibold text-lg mb-2">
                  {service.title}
                </h3>
                <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium bg-[#EEF2F7] dark:bg-[#0F172A] text-[#0A2342] dark:text-[#7DD3FC] px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-[#D2D2D7]/40 dark:border-[#334155]/40">
          <p className="text-center text-[#6E6E73] dark:text-[#94A3B8] text-sm font-medium mb-5">
            {data.partnersLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
            {data.partners.map((partner) => (
              <span key={partner} className="text-[#6E6E73] dark:text-[#94A3B8]">{partner}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
