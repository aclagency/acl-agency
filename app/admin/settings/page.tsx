import { readData } from "@/lib/data";
import SettingsEditor from "./editor";
import type { SettingsData } from "./actions";

export default async function SettingsPage() {
  const settings = await readData<SettingsData>("settings.json");
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Company info, SEO metadata, and navigation links.</p>
      </div>
      <SettingsEditor initialData={settings} />
    </div>
  );
}
