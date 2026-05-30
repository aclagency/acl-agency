"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderKind } from "@/lib/supabase/types";

const KIND_OPTIONS: Array<{ value: OrderKind; label: string; color: string }> = [
  { value: "insurance",  label: "保险",       color: "bg-blue-600 hover:bg-blue-700" },
  { value: "road_tax",   label: "JPJ路税",    color: "bg-green-600 hover:bg-green-700" },
  { value: "puspakom",   label: "Puspakom",   color: "bg-yellow-600 hover:bg-yellow-700" },
  { value: "permit",     label: "APAD",       color: "bg-purple-600 hover:bg-purple-700" },
  { value: "audit_icop", label: "AUDIT ICOP", color: "bg-red-600 hover:bg-red-700" },
];

export default function NewOrderForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [plate, setPlate]     = useState("");
  const [kind, setKind]       = useState<OrderKind | null>(null);
  const [pic, setPic]         = useState("");
  const [notes, setNotes]     = useState("");

  const reset = () => {
    setCompany(""); setPlate(""); setKind(null); setPic(""); setNotes(""); setError(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!kind) { setError("请选类型"); return; }

    startTransition(async () => {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: company, plate_no: plate, kind,
          pic_name: pic, notes,
        }),
      });
      const body = await res.json();
      if (!res.ok) { setError(body.error ?? "失败了"); return; }
      reset();
      setOpen(false);
      router.refresh();
    });
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-[#0A2342] text-white font-semibold py-4 rounded-xl hover:bg-[#1A3A5C] transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span>
        <span>新订单</span>
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border-2 border-[#0A2342] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">新订单</h3>
        <button type="button" onClick={() => { reset(); setOpen(false); }} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">公司名 *</label>
          <input
            value={company} onChange={(e) => setCompany(e.target.value)}
            required autoFocus
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342]"
            placeholder="ARS SPEED ENTERPRISE"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">车牌 *</label>
          <input
            value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())}
            required
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342]"
            placeholder="PJM4629"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">类型 *</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {KIND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setKind(opt.value)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                kind === opt.value
                  ? `${opt.color} text-white`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">PIC（可选）</label>
          <input
            value={pic} onChange={(e) => setPic(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342]"
            placeholder="Mr Lee"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">备注（可选）</label>
          <input
            value={notes} onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342]"
            placeholder="急 / NCD 20%"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#0A2342] text-white font-semibold py-3 rounded-xl hover:bg-[#1A3A5C] transition-colors text-sm disabled:opacity-50"
      >
        {pending ? "保存中…" : "保存"}
      </button>
    </form>
  );
}
