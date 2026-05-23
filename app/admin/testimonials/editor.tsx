"use client";
import { useState } from "react";
import { saveTestimonials, type TestimonialsData, type TestimonialItem } from "./actions";

const field = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors";
const label = "block text-xs font-medium text-gray-700 mb-1";
const card = "bg-white rounded-xl border border-gray-200 p-6 space-y-4";

const blankItem = (): TestimonialItem => ({
  id: Date.now().toString(),
  name: "",
  title: "",
  body: "",
  rating: 5,
  order: 99,
});

export default function TestimonialsEditor({ initialData }: { initialData: TestimonialsData }) {
  const [data, setData] = useState<TestimonialsData>(initialData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const set = <K extends keyof TestimonialsData>(key: K, value: TestimonialsData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const updateItem = (id: string, patch: Partial<TestimonialItem>) =>
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
    const items = [...data.items];
    [items[i - 1], items[i]] = [items[i], items[i - 1]];
    set("items", items.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const moveDown = (i: number) => {
    if (i === data.items.length - 1) return;
    const items = [...data.items];
    [items[i], items[i + 1]] = [items[i + 1], items[i]];
    set("items", items.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const save = async () => {
    setStatus("saving");
    try {
      await saveTestimonials(data);
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
      </div>

      <div className={card}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">Reviews ({data.items.length})</h2>
          <button
            onClick={addItem}
            className="text-xs font-medium text-[#0A2342] hover:underline"
          >
            + Add Review
          </button>
        </div>

        <div className="space-y-2">
          {sorted.map((item, i) => (
            <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                  >▲</button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === sorted.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                  >▼</button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name || "Untitled Review"}</p>
                  <p className="text-xs text-gray-500 truncate">{item.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-xs text-[#0A2342] hover:underline"
                  >
                    {expandedId === item.id ? "Close" : "Edit"}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="px-4 py-4 space-y-3 bg-white border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={label}>Name</label>
                      <input className={field} value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                    </div>
                    <div>
                      <label className={label}>Title / Company</label>
                      <input className={field} value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={label}>Review Body</label>
                    <textarea
                      className={`${field} resize-none`}
                      rows={4}
                      value={item.body}
                      onChange={(e) => updateItem(item.id, { body: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={label}>Rating (1–5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => updateItem(item.id, { rating: n })}
                          className={`w-8 h-8 rounded-lg text-sm font-semibold border transition-colors ${
                            item.rating >= n
                              ? "bg-amber-400 border-amber-400 text-white"
                              : "bg-gray-100 border-gray-200 text-gray-400"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
