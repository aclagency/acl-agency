import { readData } from "@/lib/data";

interface HeroData {
  badge: string;
  headlineMain: string;
  headlineAccent: string;
  headlineEnd: string;
  subheadline: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
  trustItems: string[];
}

export default async function Hero() {
  const data = await readData<HeroData>("hero.json");

  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 bg-white dark:bg-[#0F172A] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, #EEF2F7 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EEF2F7] dark:bg-[#1E293B] text-[#0A2342] dark:text-[#7DD3FC] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0A2342] dark:bg-[#7DD3FC] inline-block" />
          {data.badge}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1D1D1F] dark:text-[#F1F5F9] leading-tight tracking-tight max-w-4xl mx-auto">
          {data.headlineMain}{" "}
          <span className="text-[#0A2342] dark:text-[#7DD3FC]">{data.headlineAccent}</span>{" "}
          {data.headlineEnd}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#6E6E73] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-light">
          {data.subheadline}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={data.primaryCTA.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#0A2342] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#1A3A5C] transition-colors text-sm"
          >
            {data.primaryCTA.text}
          </a>
          <a
            href={data.secondaryCTA.href}
            className="w-full sm:w-auto border border-[#D2D2D7] dark:border-[#334155] text-[#1D1D1F] dark:text-[#F1F5F9] font-semibold px-8 py-3.5 rounded-full hover:bg-[#F5F5F7] dark:hover:bg-[#1E293B] transition-colors text-sm"
          >
            {data.secondaryCTA.text}
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[#6E6E73] dark:text-[#94A3B8] text-sm">
          {data.trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0A2342] dark:text-[#7DD3FC]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
