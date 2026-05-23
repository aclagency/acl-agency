import { readData } from "@/lib/data";

interface WhyUsData {
  sectionLabel: string;
  headline: string;
  description: string;
  bulletPoints: string[];
  coreValues: { label: string; desc: string }[];
  stats: { value: string; label: string }[];
}

export default async function WhyUs() {
  const data = await readData<WhyUsData>("why-us.json");

  return (
    <section id="why-us" className="py-24 lg:py-32 bg-white dark:bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#0A2342] dark:text-[#7DD3FC] text-sm font-semibold uppercase tracking-widest mb-3">
              {data.sectionLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1F] dark:text-[#F1F5F9] tracking-tight leading-tight">
              {data.headline}
            </h2>
            <p className="mt-6 text-[#6E6E73] dark:text-[#94A3B8] text-lg leading-relaxed">
              {data.description}
            </p>
            <ul className="mt-8 space-y-4">
              {data.bulletPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 bg-[#0A2342] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-[#1D1D1F] dark:text-[#F1F5F9] text-sm">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex gap-4 flex-wrap">
              {data.coreValues.map((val) => (
                <div key={val.label} className="flex-1 min-w-[120px] bg-[#F5F5F7] dark:bg-[#1E293B] rounded-xl p-4">
                  <p className="text-[#0A2342] dark:text-[#7DD3FC] font-semibold text-sm">{val.label}</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-xs mt-0.5">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {data.stats.map((stat) => (
              <div key={stat.label} className="bg-[#F5F5F7] dark:bg-[#1E293B] rounded-2xl p-8 text-center">
                <p className="text-4xl font-bold text-[#0A2342] dark:text-[#7DD3FC]">{stat.value}</p>
                <p className="mt-2 text-[#6E6E73] dark:text-[#94A3B8] text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
