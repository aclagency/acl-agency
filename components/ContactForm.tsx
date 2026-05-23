"use client";

import { useState } from "react";

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  fleet: string;
  service: string;
  message: string;
};

interface ContactData {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  sectionLabel: string;
  headline: string;
  subheadline: string;
}

export default function ContactForm({ contact }: { contact: ContactData }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    phone: "",
    email: "",
    fleet: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#D2D2D7] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-[#1D1D1F] dark:text-[#F1F5F9] text-sm placeholder:text-[#6E6E73] dark:placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 dark:focus:ring-[#7DD3FC]/20 focus:border-[#0A2342] dark:focus:border-[#7DD3FC] transition-colors";

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white dark:bg-[#0F172A]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#0A2342] dark:text-[#7DD3FC] text-sm font-semibold uppercase tracking-widest mb-3">
              {contact.sectionLabel}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1D1D1F] dark:text-[#F1F5F9] tracking-tight leading-tight">
              {contact.headline}
            </h2>
            <p className="mt-6 text-[#6E6E73] dark:text-[#94A3B8] text-lg leading-relaxed">
              {contact.subheadline}
            </p>

            <div className="mt-10 space-y-5">
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 bg-[#EEF2F7] dark:bg-[#1E293B] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0A2342] transition-colors">
                  <svg className="w-5 h-5 text-[#0A2342] dark:text-[#7DD3FC] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-medium text-sm">WhatsApp</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm mt-0.5">{contact.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#EEF2F7] dark:bg-[#1E293B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0A2342] dark:text-[#7DD3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-medium text-sm">Phone</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm mt-0.5">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#EEF2F7] dark:bg-[#1E293B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0A2342] dark:text-[#7DD3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-medium text-sm">Email</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm mt-0.5">{contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#EEF2F7] dark:bg-[#1E293B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0A2342] dark:text-[#7DD3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-medium text-sm">Office</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm mt-0.5">{contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#EEF2F7] dark:bg-[#1E293B] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#0A2342] dark:text-[#7DD3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#1D1D1F] dark:text-[#F1F5F9] font-medium text-sm">Hours</p>
                  <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm mt-0.5">{contact.hours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F7] dark:bg-[#1E293B] rounded-3xl p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-[#0A2342] rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-[#1D1D1F] dark:text-[#F1F5F9] font-bold text-xl mb-2">Message Received!</h3>
                <p className="text-[#6E6E73] dark:text-[#94A3B8] text-sm">
                  Thank you for reaching out. Our team will contact you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">
                      Full Name <span className="text-[#0A2342]">*</span>
                    </label>
                    <input type="text" name="name" required placeholder="Ahmad bin Ali" value={form.name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">Company Name</label>
                    <input type="text" name="company" placeholder="Your Company Sdn. Bhd." value={form.company} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">
                      Phone / WhatsApp <span className="text-[#0A2342]">*</span>
                    </label>
                    <input type="tel" name="phone" required placeholder="+60 12-345 6789" value={form.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">Service Needed</label>
                    <select name="service" value={form.service} onChange={handleChange} className={inputClass}>
                      <option value="">Select a service</option>
                      <option value="jpj">JPJ Services</option>
                      <option value="apad">APAD Services</option>
                      <option value="insurance">Insurance</option>
                      <option value="puspakom">Puspakom Inspection</option>
                      <option value="gps">GPS Fleet Tracking</option>
                      <option value="consulting">Consulting & Management</option>
                      <option value="all">All / Not Sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">Fleet Size</label>
                    <select name="fleet" value={form.fleet} onChange={handleChange} className={inputClass}>
                      <option value="">Select fleet size</option>
                      <option value="1-5">1 – 5 vehicles</option>
                      <option value="6-20">6 – 20 vehicles</option>
                      <option value="21-50">21 – 50 vehicles</option>
                      <option value="50+">50+ vehicles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#1D1D1F] dark:text-[#F1F5F9] text-xs font-medium mb-1.5">
                    How can we help? <span className="text-[#0A2342]">*</span>
                  </label>
                  <textarea name="message" required rows={4} placeholder="Tell us about your fleet management needs..." value={form.message} onChange={handleChange} className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" className="w-full bg-[#0A2342] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1A3A5C] transition-colors text-sm mt-2">
                  Send Message
                </button>

                <p className="text-[#6E6E73] text-xs text-center">
                  Or reach us directly via{" "}
                  <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-[#0A2342] font-medium underline underline-offset-2">
                    WhatsApp
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
