"use client";

import { useState } from "react";

interface Summary {
  ok: boolean;
  rows_in_file?: number;
  customers_upserted?: number;
  vehicles_upserted?: number;
  renewals_inserted?: number;
  errors?: string[];
  error?: string;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setSummary(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/import", { method: "POST", body: fd });
    const body: Summary = await res.json();
    setSummary(body);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">导入 Excel 主表</h1>
      <p className="text-sm text-gray-500 mb-6">
        上传你的 &quot;ALL IN ONE MASTER&quot; 文件。系统会自动识别公司、车辆和到期日期。重复上传会更新到期日期，不会删除历史。
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0A2342] file:text-white file:font-semibold hover:file:bg-[#1A3A5C]"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="bg-[#0A2342] text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "导入中…" : "开始导入"}
        </button>
      </form>

      {summary && (
        <div className={`mt-8 p-5 rounded-xl border ${summary.ok ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          {summary.error && <p className="text-red-700 font-semibold">{summary.error}</p>}
          {summary.rows_in_file !== undefined && (
            <ul className="text-sm space-y-1">
              <li>文件里的行数：<b>{summary.rows_in_file}</b></li>
              <li>新增客户：<b>{summary.customers_upserted ?? 0}</b></li>
              <li>新增 / 更新车辆：<b>{summary.vehicles_upserted ?? 0}</b></li>
              <li>新增到期记录：<b>{summary.renewals_inserted ?? 0}</b></li>
            </ul>
          )}
          {summary.errors && summary.errors.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-amber-800 font-medium">
                {summary.errors.length} 行有问题（点开看）
              </summary>
              <ul className="mt-2 text-xs text-amber-900 space-y-1 max-h-64 overflow-y-auto">
                {summary.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
