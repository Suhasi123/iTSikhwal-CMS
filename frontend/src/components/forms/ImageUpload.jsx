import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, Trash2, Replace } from "lucide-react";
import { uploadImage } from "../../services/uploadService.js";

export default function ImageUpload({ label, value, onChange, onRemove, aspect = "16 / 9" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    try {
      setUploading(true);
      const data = await uploadImage(file);
      onChange?.(data);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value?.url ? (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          <div style={{ aspectRatio: aspect }}>
            <img
              src={value.url}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-white p-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Replace className="h-3.5 w-3.5" />
              )}
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-600 hover:border-gray-400 hover:bg-white disabled:opacity-60"
          style={{ aspectRatio: aspect }}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5 text-gray-400" />
              <span>Click to upload image</span>
              <span className="text-xs text-gray-400">PNG, JPG up to a few MB</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
