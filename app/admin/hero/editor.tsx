"use client";
import { useState } from "react";
import { saveHero, type HeroData } from "./actions";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

export default function HeroEditor({ initialData }: { initialData: HeroData }) {
  const [data, setData] = useState<HeroData>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newTrust, setNewTrust] = useState("");

  const set = (key: keyof HeroData, value: unknown) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      await saveHero(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const addTrust = () => {
    if (!newTrust.trim()) return;
    set("trustItems", [...data.trustItems, newTrust.trim()]);
    setNewTrust("");
  };

  const removeTrust = (i: number) =>
    set("trustItems", data.trustItems.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Badge */}
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Badge</h2>
        <div>
          <label className={label}>Badge Text</label>
          <input className={field} value={data.badge} onChange={(e) => set("badge", e.target.value)} />
        </div>
      </div>

      {/* Headline */}
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Headline</h2>
        <p className="text-xs text-gray-500">Renders as: <em>[Main] [Accent] [End]</em></p>
        <div>
          <label className={label}>Main (black)</label>
          <input className={field} value={data.headlineMain} onChange={(e) => set("headlineMain", e.target.value)} />
        </div>
        <div>
          <label className={label}>Accent (navy)</label>
          <input className={field} value={data.headlineAccent} onChange={(e) => set("headlineAccent", e.target.value)} />
        </div>
        <div>
          <label className={label}>End (black)</label>
          <input className={field} value={data.headlineEnd} onChange={(e) => set("headlineEnd", e.target.value)} />
        </div>
        <div>
          <label className={label}>Subheadline</label>
          <textarea
            className={`${field} resize-none`}
            rows={3}
            value={data.subheadline}
            onChange={(e) => set("subheadline", e.target.value)}
          />
        </div>
      </div>

      {/* CTAs */}
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Call-to-Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">Primary CTA</p>
            <div>
              <label className={label}>Text</label>
              <input className={field} value={data.primaryCTA.text} onChange={(e) => set("primaryCTA", { ...data.primaryCTA, text: e.target.value })} />
            </div>
            <div>
              <label className={label}>URL</label>
              <input className={field} value={data.primaryCTA.href} onChange={(e) => set("primaryCTA", { ...data.primaryCTA, href: e.target.value })} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500">Secondary CTA</p>
            <div>
              <label className={label}>Text</label>
              <input className={field} value={data.secondaryCTA.text} onChange={(e) => set("secondaryCTA", { ...data.secondaryCTA, text: e.target.value })} />
            </div>
            <div>
              <label className={label}>URL</label>
              <input className={field} value={data.secondaryCTA.href} onChange={(e) => set("secondaryCTA", { ...data.secondaryCTA, href: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Items */}
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Trust Bar Items</h2>
        <div className="flex flex-wrap gap-2">
          {data.trustItems.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs">
              {item}
              <button onClick={() => removeTrust(i)} className="text-gray-400 hover:text-red-500 transition-colors leading-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={`${field} flex-1`}
            placeholder="Add trust item…"
            value={newTrust}
            onChange={(e) => setNewTrust(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTrust()}
          />
          <button onClick={addTrust} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">Add</button>
        </div>
      </div>

      {/* Save */}
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
