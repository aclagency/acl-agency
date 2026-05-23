"use client";
import { useState } from "react";
import { saveWhyUs, type WhyUsData } from "./actions";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

export default function WhyUsEditor({ initialData }: { initialData: WhyUsData }) {
  const [data, setData] = useState<WhyUsData>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newBullet, setNewBullet] = useState("");

  const set = <K extends keyof WhyUsData>(key: K, value: WhyUsData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setStatus("saving");
    try {
      await saveWhyUs(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const addBullet = () => {
    if (!newBullet.trim()) return;
    set("bulletPoints", [...data.bulletPoints, newBullet.trim()]);
    setNewBullet("");
  };

  const removeBullet = (i: number) =>
    set("bulletPoints", data.bulletPoints.filter((_, idx) => idx !== i));

  const updateBullet = (i: number, val: string) =>
    set("bulletPoints", data.bulletPoints.map((b, idx) => (idx === i ? val : b)));

  const updateStat = (i: number, key: "value" | "label", val: string) =>
    set("stats", data.stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  const updateValue = (i: number, key: "label" | "desc", val: string) =>
    set("coreValues", data.coreValues.map((v, idx) => (idx === i ? { ...v, [key]: val } : v)));

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
          <label className={label}>Description</label>
          <textarea className={`${field} resize-none`} rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {data.stats.map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div>
                <label className={label}>Value</label>
                <input className={field} value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
              </div>
              <div>
                <label className={label}>Label</label>
                <input className={field} value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Bullet Points</h2>
        <div className="space-y-2">
          {data.bulletPoints.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={`${field} flex-1`} value={b} onChange={(e) => updateBullet(i, e.target.value)} />
              <button onClick={() => removeBullet(i)} className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none flex-shrink-0">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={`${field} flex-1`}
            placeholder="Add bullet point…"
            value={newBullet}
            onChange={(e) => setNewBullet(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addBullet()}
          />
          <button onClick={addBullet} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">Add</button>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Core Values</h2>
        <div className="space-y-3">
          {data.coreValues.map((v, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Label</label>
                <input className={field} value={v.label} onChange={(e) => updateValue(i, "label", e.target.value)} />
              </div>
              <div>
                <label className={label}>Description</label>
                <input className={field} value={v.desc} onChange={(e) => updateValue(i, "desc", e.target.value)} />
              </div>
            </div>
          ))}
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
