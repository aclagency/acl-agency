import { listOrders, countToday } from "@/lib/orders/queries";
import NewOrderForm from "./_components/NewOrderForm";
import OrderRow from "./_components/OrderRow";
import type { IncomingOrder } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function dateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today))     return "今天";
  if (sameDay(d, yesterday)) return "昨天";
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
}

function groupByDay(orders: IncomingOrder[]): Array<{ key: string; label: string; items: IncomingOrder[] }> {
  const groups = new Map<string, IncomingOrder[]>();
  for (const o of orders) {
    const dayKey = new Date(o.created_at).toISOString().slice(0, 10);
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey)!.push(o);
  }
  return [...groups.entries()].map(([key, items]) => ({
    key, label: dateLabel(items[0].created_at), items,
  }));
}

export default async function OrdersPage() {
  const [orders, todayCount] = await Promise.all([listOrders(), countToday()]);
  const groups = groupByDay(orders);
  const pendingTotal = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">今日订单</h1>
          <p className="text-sm text-gray-500">
            今天 <b>{todayCount}</b> 单 · 待处理 <b>{pendingTotal}</b> 单
          </p>
        </div>
      </div>

      <div className="mb-6">
        <NewOrderForm />
      </div>

      {groups.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">还没有订单，点上面&quot;新订单&quot;开始记录</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="flex items-baseline gap-3 mb-2 px-1">
                <h2 className="text-sm font-bold text-gray-700">{g.label}</h2>
                <span className="text-xs text-gray-500">{g.items.length} 单</span>
              </div>
              <div className="space-y-2">
                {g.items.map((o) => <OrderRow key={o.id} order={o} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
