import { readData } from "@/lib/data";

interface SettingsData {
  companyName: string;
  logoText: string;
  regNumber: string;
  tagline: string;
  description: string;
  clientPortal: string;
  navLinks: { label: string; href: string }[];
}

interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
}

export default async function Footer() {
  const [settings, contact] = await Promise.all([
    readData<SettingsData>("settings.json"),
    readData<ContactData>("contact.json"),
  ]);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2342] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-wider">{settings.logoText}</span>
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">{settings.companyName}</p>
                <p className="text-white/50 text-xs">Reg. {settings.regNumber}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">{settings.description}</p>
            <p className="mt-4 text-white/40 text-xs italic">&ldquo;{settings.tagline}&rdquo;</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {settings.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={settings.clientPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 text-sm hover:text-white transition-colors"
                >
                  Client Portal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5">Contact Info</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  {contact.phone} (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {contact.email}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {contact.address}
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {contact.hours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs">
          <p>&copy; {currentYear} {settings.companyName}. All rights reserved.</p>
          <p>{settings.regNumber}</p>
        </div>
      </div>
    </footer>
  );
}
