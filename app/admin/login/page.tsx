"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#0A2342] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ACL</span>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">Content Manager</p>
            <p className="text-gray-500 text-xs">ACL Agency (M) Sdn. Bhd.</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
        <p className="text-gray-500 text-sm mb-8">Enter your admin password to manage site content.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20 focus:border-[#0A2342] transition-colors"
            />
          </div>
          {error && (
            <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A2342] text-white font-semibold py-3 rounded-xl hover:bg-[#1A3A5C] transition-colors text-sm disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
