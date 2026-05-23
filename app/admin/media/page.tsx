import { readData } from "@/lib/data";
import MediaGallery from "./gallery";

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

export default async function MediaPage() {
  const media = await readData<MediaData>("media.json");
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-500 text-sm mt-1">Upload and manage images and custom SVG icons.</p>
      </div>
      <MediaGallery initialMedia={media} />
    </div>
  );
}
