"use client";
import { useState, useRef } from "react";

interface MediaEntry {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface MediaData {
  images: MediaEntry[];
  icons: MediaEntry[];
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
}

function UploadZone({ type, onUploaded }: { type: "image" | "icon"; onUploaded: (entry: MediaEntry) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (res.ok) {
      const entry = await res.json();
      onUploaded(entry);
    } else {
      setError("Upload failed. Try again.");
    }
    setUploading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#0A2342]/30 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-gray-500">
          {uploading ? "Uploading…" : `Drop ${type === "icon" ? "SVG icon" : "image"} here or click to browse`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {type === "icon" ? "SVG files only" : "PNG, JPG, WebP, GIF, SVG"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={type === "icon" ? ".svg" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function EntryCard({ entry, onDelete }: { entry: MediaEntry; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(entry.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const del = async () => {
    if (!confirm(`Delete "${entry.name}"?`)) return;
    setDeleting(true);
    const type = entry.type === "image/svg+xml" && entry.name.endsWith(".svg") ? "icon" : "image";
    await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, type }),
    });
    onDelete();
  };

  const isImage = entry.type.startsWith("image/");

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden group">
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={entry.url} alt={entry.name} className="w-full h-full object-contain p-2" />
        ) : (
          <div className="text-gray-400 text-xs text-center p-4">
            <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12" />
            </svg>
            {entry.type}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-gray-700 truncate">{entry.name}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(entry.size)} · {formatDate(entry.uploadedAt)}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={copy}
            className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
          <button
            onClick={del}
            disabled={deleting}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
          >
            {deleting ? "…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MediaGallery({ initialMedia }: { initialMedia: MediaData }) {
  const [media, setMedia] = useState<MediaData>(initialMedia);
  const [tab, setTab] = useState<"images" | "icons">("images");

  const addEntry = (entry: MediaEntry, type: "image" | "icon") => {
    if (type === "icon") setMedia((m) => ({ ...m, icons: [entry, ...m.icons] }));
    else setMedia((m) => ({ ...m, images: [entry, ...m.images] }));
  };

  const removeEntry = (id: string, type: "images" | "icons") =>
    setMedia((m) => ({ ...m, [type]: m[type].filter((e) => e.id !== id) }));

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {(["images", "icons"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "images" ? `Images (${media.images.length})` : `Icons (${media.icons.length})`}
          </button>
        ))}
      </div>

      {tab === "images" && (
        <div className="space-y-4">
          <UploadZone type="image" onUploaded={(e) => addEntry(e, "image")} />
          {media.images.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {media.images.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={() => removeEntry(entry.id, "images")} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "icons" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs text-blue-700">Upload custom SVG icons to use in service cards. After uploading, copy the URL and use it in the Services editor.</p>
          </div>
          <UploadZone type="icon" onUploaded={(e) => addEntry(e, "icon")} />
          {media.icons.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No custom icons uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {media.icons.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={() => removeEntry(entry.id, "icons")} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
