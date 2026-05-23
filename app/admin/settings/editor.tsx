"use client";
import { useState, useRef } from "react";
import { saveSettings, type SettingsData } from "./actions";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

export default function SettingsEditor({ initialData }: { initialData: SettingsData }) {
  const [data, setData] = useState<SettingsData>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [uploading, setUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      await saveSettings(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("type", "image");
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (res.ok) {
      const entry = await res.json();
      set("logoUrl", entry.url);
    }
    setUploading(false);
  };

  const updateNavLink = (i: number, key: "label" | "href", val: string) =>
    set("navLinks", data.navLinks.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));

  const addNavLink = () =>
    set("navLinks", [...data.navLinks, { label: "New Link", href: "#" }]);

  const removeNavLink = (i: number) =>
    set("navLinks", data.navLinks.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Company Logo</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <div className="w-12 h-12 bg-[#0A2342] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{data.logoText || "ACL"}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Upload a PNG, SVG, or WebP logo. Recommended: square, min 128×128px.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 text-xs font-medium bg-[#0A2342] text-white rounded-lg hover:bg-[#1A3A5C] transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload Logo"}
              </button>
              {data.logoUrl && (
                <button
                  type="button"
                  onClick={() => set("logoUrl", "")}
                  className="px-4 py-2 text-xs font-medium border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadLogo(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Company Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Company Name (full)</label>
            <input className={field} value={data.companyName} onChange={(e) => set("companyName", e.target.value)} />
          </div>
          <div>
            <label className={label}>Company Short Name</label>
            <input className={field} value={data.companyShort} onChange={(e) => set("companyShort", e.target.value)} />
          </div>
          <div>
            <label className={label}>Suffix (e.g. Sdn. Bhd.)</label>
            <input className={field} value={data.companySuffix} onChange={(e) => set("companySuffix", e.target.value)} />
          </div>
          <div>
            <label className={label}>Logo Text</label>
            <input className={field} value={data.logoText} onChange={(e) => set("logoText", e.target.value)} />
          </div>
          <div>
            <label className={label}>Registration Number</label>
            <input className={field} value={data.regNumber} onChange={(e) => set("regNumber", e.target.value)} />
          </div>
          <div>
            <label className={label}>Established Year</label>
            <input className={field} value={data.established} onChange={(e) => set("established", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Tagline</label>
          <input className={field} value={data.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </div>
        <div>
          <label className={label}>Description (footer / meta)</label>
          <textarea className={`${field} resize-none`} rows={2} value={data.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={label}>Client Portal URL</label>
          <input className={field} type="url" value={data.clientPortal} onChange={(e) => set("clientPortal", e.target.value)} />
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">SEO Metadata</h2>
        <div>
          <label className={label}>Meta Title</label>
          <input className={field} value={data.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
        </div>
        <div>
          <label className={label}>Meta Description</label>
          <textarea className={`${field} resize-none`} rows={2} value={data.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Navigation</h2>
        <div className="space-y-2">
          {data.navLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${field} flex-1`} placeholder="Label" value={link.label} onChange={(e) => updateNavLink(i, "label", e.target.value)} />
              <input className={`${field} flex-1`} placeholder="URL" value={link.href} onChange={(e) => updateNavLink(i, "href", e.target.value)} />
              <button onClick={() => removeNavLink(i)} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none flex-shrink-0">×</button>
            </div>
          ))}
        </div>
        <button onClick={addNavLink} className="text-sm text-[#0A2342] hover:underline">+ Add link</button>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-medium text-gray-500 mb-3">CTA Button</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Button Text</label>
              <input className={field} value={data.navCTA.text} onChange={(e) => set("navCTA", { ...data.navCTA, text: e.target.value })} />
            </div>
            <div>
              <label className={label}>URL</label>
              <input className={field} value={data.navCTA.href} onChange={(e) => set("navCTA", { ...data.navCTA, href: e.target.value })} />
            </div>
          </div>
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
