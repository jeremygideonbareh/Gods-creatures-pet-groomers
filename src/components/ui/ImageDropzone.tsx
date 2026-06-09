import { useState, useRef, type DragEvent } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import { nhost } from "@/lib/nhost";

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN || "";
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION || "";

function getStorageUrl(fileId: string): string {
  return `https://${NHOST_SUBDOMAIN}.storage.${NHOST_REGION}.nhost.run/v1/files/${fileId}`;
}

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageDropzone({ value, onChange, label }: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const res = await nhost.storage.uploadFiles({
        "bucket-id": "cms-images",
        "file[]": [file],
      });
      const fileId = res.body?.processedFiles?.[0]?.id;
      if (fileId) {
        onChange(getStorageUrl(fileId));
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && (
        <label className="block text-white/80 text-xs font-semibold mb-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/20 group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium hover:bg-white/30 transition-all"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-full bg-red-500/30 backdrop-blur-md border border-red-300/40 text-red-200 hover:bg-red-500/50 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-white/60 bg-white/15"
              : "border-white/25 bg-white/5 hover:border-white/40 hover:bg-white/10"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="animate-spin text-white/60" />
              <p className="text-white/50 text-xs">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-white/40" />
              <p className="text-white/50 text-xs">
                Drag & drop an image here, or click to browse
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
}

export default ImageDropzone;
