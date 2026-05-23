import { readData } from "@/lib/data";
import Link from "next/link";

const sections = [
  { label: "Hero Section", href: "/admin/hero", desc: "Headline, badge, CTAs, trust bar" },
  { label: "Services", href: "/admin/services", desc: "Service cards, icons, tags, partners" },
  { label: "Why Us", href: "/admin/why-us", desc: "Stats, bullet points, core values" },
  { label: "Testimonials", href: "/admin/testimonials", desc: "Client reviews and ratings" },
  { label: "Contact Info", href: "/admin/contact", desc: "Phone, email, address, hours" },
  { label: "Media Library", href: "/admin/media", desc: "Upload and manage images & icons" },
  { label: "Site Settings", href: "/admin/settings", desc: "Company info, SEO, navigation" },
];

export default async function DashboardPage() {
  const settings = await readData<{ companyName: string }>("settings.json");
  const services = await readData<{ items: unknown[] }>("services.json");
  const testimonials = await readData<{ items: unknown[] }>("testimonials.json");
  const media = await readData<{ images: unknown[]; icons: unknown[] }>("media.json");

  const stats = [
    { label: "Services", value: services.items.length },
    { label: "Testimonials", value: testimonials.items.length },
    { label: "Images", value: media.images.length },
    { label: "Custom Icons", value: media.icons.length },
  ];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Managing content for <span className="font-medium">{settings.companyName}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 text-center">
            <p className="text-3xl font-bold text-[#0A2342]">{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Content Sections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#0A2342]/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-[#0A2342] transition-colors">{s.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0A2342] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
