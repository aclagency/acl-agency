"use client";
import { useState } from "react";
import { saveServices, type ServicesData, type ServiceItem } from "./actions";
import { ICONS, ICON_IDS, type IconId } from "@/lib/icons";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

const blankItem = (): ServiceItem => ({
  id: Date.now().toString(),
  icon: "briefcase",
  title: "",
  description: "",
  tags: [],
  order: 99,
});

function IconPicker({ value, onChange }: { value: IconId; onChange: (id: IconId) => void }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {ICON_IDS.map((id) => {
        const icon = ICONS[id];
        return (
          <button
            key={id}
            type="button"
            title={icon.label}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
              value === id
                ? "border-[#0A2342] bg-[#0A2342]/5"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {icon.paths.map((p, i) => (
                <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />
              ))}
            </svg>
            <span className="text-[9px] text-gray-500 text-center leading-tight">{icon.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
            {tag}
            <button onClick={() => onChange(tags.filter((t) => t !== tag))} className="text-gray-400 hover:text-red-500 leading-none">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${field} flex-1`}
          placeholder="Add tag…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button onClick={add} className="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors">Add</button>
      </div>
    </div>
  );
}

export default function ServicesEditor({ initialData }: { initialData: ServicesData }) {
  const [data, setData] = useState<ServicesData>(initialData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newPartner, setNewPartner] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = <K extends keyof ServicesData>(key: K, value: ServicesData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateItem = (id: string, patch: Partial<ServiceItem>) =>
    set("items", data.items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const deleteItem = (id: string) =>
    set("items", data.items.filter((item) => item.id !== id));

  const addItem = () => {
    const item = blankItem();
    set("items", [...data.items, item]);
    setExpandedId(item.id);
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const items = [...sorted];
    [items[i - 1], items[i]] = [items[i], items[i - 1]];
    set("items", items.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const moveDown = (i: number) => {
    if (i === sorted.length - 1) return;
    const items = [...sorted];
    [items[i], items[i + 1]] = [items[i + 1], items[i]];
    set("items", items.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const addPartner = () => {
    if (!newPartner.trim()) return;
    set("partners", [...data.partners, newPartner.trim()]);
    setNewPartner("");
  };

  const removePartner = (i: number) =>
    set("partners", data.partners.filter((_, idx) => idx !== i));

  const save = async () => {
    setStatus("saving");
    try {
      await saveServices(data);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  };

  const sorted = [...data.items].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Section Copy</h2>
        <div>
          <label className={label}>Section Label</label>
          <input className={field} value={data.sectionLabel} onChange={(e) => set("sectionLabel", e.target.value)} />
        </div>
        <div>
          <label className={label}>Heading</label>
          <input className={field} value={data.heading} onChange={(e) => set("heading", e.target.value)} />
        </div>
        <div>
          <label className={label}>Subheading</label>
          <textarea className={`${field} resize-none`} rows={2} value={data.subheading} onChange={(e) => set("subheading", e.target.value)} />
        </div>
        <div>
          <label className={label}>Partners Strip Label</label>
          <input className={field} value={data.partnersLabel} onChange={(e) => set("partnersLabel", e.target.value)} />
        </div>
      </div>

      <div className={card}>
        <h2 className="font-semibold text-gray-900 text-sm">Insurance Partners</h2>
        <div className="flex flex-wrap gap-2">
          {data.partners.map((p, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs">
              {p}
              <button onClick={() => removePartner(i)} className="text-gray-400 hover:text-red-500 transition-colors leading-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={`${field} flex-1`}
            placeholder="Add partner…"
            value={newPartner}
            onChange={(e) => setNewPartner(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPartner()}
          />
          <button onClick={addPartner} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">Add</button>
        </div>
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Service Cards ({data.items.length})</h2>
          <button onClick={addItem} className="text-xs font-medium text-[#0A2342] hover:underline">+ Add Service</button>
        </div>

        <div className="space-y-2">
          {sorted.map((item, i) => {
            const icon = ICONS[item.icon];
            return (
              <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                  <div className="flex gap-1">
                    <button onClick={() => moveUp(i)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▲</button>
                    <button onClick={() => moveDown(i)} disabled={i === sorted.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs">▼</button>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {icon.paths.map((p, pi) => <path key={pi} strokeLinecap="round" strokeLinejoin="round" d={p} />)}
                  </svg>
                  <p className="flex-1 text-sm font-medium text-gray-800 truncate">{item.title || "Untitled Service"}</p>
                  <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)} className="text-xs text-[#0A2342] hover:underline">
                    {expandedId === item.id ? "Close" : "Edit"}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="text-xs text-red-400 hover:text-red-600 hover:underline">Delete</button>
                </div>

                {expandedId === item.id && (
                  <div className="px-4 py-4 space-y-4 bg-white border-t border-gray-100">
                    <div>
                      <label className={label}>Title</label>
                      <input className={field} value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <label className={label}>Description</label>
                      <textarea className={`${field} resize-none`} rows={3} value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
                    </div>
                    <div>
                      <label className={label}>Tags</label>
                      <TagsInput tags={item.tags} onChange={(tags) => updateItem(item.id, { tags })} />
                    </div>
                    <div>
                      <label className={label}>Icon</label>
                      <IconPicker value={item.icon} onChange={(icon) => updateItem(item.id, { icon })} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
