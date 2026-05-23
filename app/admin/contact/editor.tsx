"use client";
import { useState } from "react";
import { saveContact, type ContactData } from "./actions";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

export default function ContactEditor({ initialData }: { initialData: ContactData }) {
  const [data, setData] = useState<ContactData>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = (key: keyof ContactData, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      await saveContact(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Section Copy</h2>
        <div>
          <label className={label}>Section Label</label>
          <input className={field} value={data.sectionLabel} onChange={(e) => set("sectionLabel", e.target.value)} />
        </div>
        <div>
          <label className={label}>Headline</label>
          <input className={field} value={data.headline} onChange={(e) => set("headline", e.target.value)} />
        </div>
        <div>
          <label className={label}>Subheadline</label>
          <textarea className={`${field} resize-none`} rows={2} value={data.subheadline} onChange={(e) => set("subheadline", e.target.value)} />
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Phone (display)</label>
            <input className={field} value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={label}>WhatsApp number (digits only)</label>
            <input className={field} value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Email</label>
          <input className={field} type="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={label}>Address</label>
          <input className={field} value={data.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div>
          <label className={label}>Business Hours</label>
          <input className={field} value={data.hours} onChange={(e) => set("hours", e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="px-5 py-2.5 bg-[#0A2342] text-white text-sm font-semibold rounded-xl hover:bg-[#1A3A5C] transition-colors disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : "Save Changes"}
        </button>
        {status === "error" && <p className="text-sm text-red-600">Failed to save. Try again.</p>}
        {status === "saved" && <p className="text-sm text-green-600">Changes saved and live.</p>}
      </div>
    </div>
  );
}
