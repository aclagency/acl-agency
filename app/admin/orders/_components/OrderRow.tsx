"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { IncomingOrder } from "@/lib/supabase/types";

const KIND_LABELS: Record<string, string> = {
  insurance:  "保险",
  road_tax:   "JPJ路税",
  puspakom:   "Puspakom",
  permit:     "APAD",
  audit_icop: "AUDIT ICOP",
};

const KIND_BG: Record<string, string> = {
  insurance:  "bg-blue-100 text-blue-800",
  road_tax:   "bg-green-100 text-green-800",
  puspakom:   "bg-yellow-100 text-yellow-800",
  permit:     "bg-purple-100 text-purple-800",
  audit_icop: "bg-red-100 text-red-800",
};

export default function OrderRow({ order }: { order: IncomingOrder }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggleDone = () => {
    startTransition(async () => {
      const nextStatus = order.status === "done" ? "pending" : "done";
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) router.refresh();
    });
  };

  const remove = () => {
    if (!confirm("确定删除这一单？")) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    });
  };

  const time = new Date(order.created_at).toLocaleTimeString("zh-CN", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  const isDone = order.status === "done";

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
      isDone ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"
    }`}>
      <span className="text-xs text-gray-500 font-mono w-12">{time}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isDone ? "line-through text-gray-500" : "text-gray-900"}`}>
          {order.company_name}
          <span className="ml-2 text-gray-600 font-normal">{order.plate_no}</span>
        </p>
        {(order.pic_name || order.notes) && (
          <p className="text-xs text-gray-500 mt-0.5">
            {order.pic_name && <span>{order.pic_name}</span>}
            {order.pic_name && order.notes && <span> · </span>}
            {order.notes && <span>{order.notes}</span>}
          </p>
        )}
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${KIND_BG[order.kind]}`}>
        {KIND_LABELS[order.kind]}
      </span>
      <button
        onClick={toggleDone}
        disabled={pending}
        className={`text-xs px-3 py-1.5 rounded-lg flex-shrink-0 disabled:opacity-50 ${
          isDone
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isDone ? "↩ 撤销" : "✓ 完成"}
      </button>
      <button
        onClick={remove}
        disabled={pending}
        className="text-xs px-2 py-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0 disabled:opacity-50"
        title="删除"
      >
        ✕
      </button>
    </div>
  );
}
