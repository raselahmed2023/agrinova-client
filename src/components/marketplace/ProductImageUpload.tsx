"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";

const MAX_IMAGES = 5;

interface ProductImageUploadProps {
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
}

interface UploadResponse {
  success?: boolean;
  url?: string;
  message?: string;
}

export default function ProductImageUpload({
  images,
  setImages,
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    let result: UploadResponse | null = null;

    try {
      result = (await response.json()) as UploadResponse;
    } catch {
      throw new Error("Image upload returned an invalid response.");
    }

    if (!response.ok || !result?.success || !result.url) {
      throw new Error(
        result?.message || "Unable to upload product image."
      );
    }

    return result.url;
  };

  const handleFiles = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const remainingSlots = Math.max(
      MAX_IMAGES - images.length,
      0
    );

    if (remainingSlots === 0) {
      setError(
        `You can upload up to ${MAX_IMAGES} product images.`
      );

      event.target.value = "";
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    try {
      setUploading(true);
      setError("");

      const uploaded: string[] = [];

      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) {
          throw new Error(
            `${file.name} is not a valid image file.`
          );
        }

        if (file.size > 8 * 1024 * 1024) {
          throw new Error(
            `${file.name} must be 8 MB or smaller.`
          );
        }

        uploaded.push(await uploadImage(file));
      }

      setImages((current) => [...current, ...uploaded]);
    } catch (err) {
      console.error("Product image upload failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload product image."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((current) =>
      current.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
  };

  return (
    <div className="space-y-4">
      <label
        className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
          uploading
            ? "cursor-wait border-emerald-300 bg-emerald-50"
            : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/50"
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || images.length >= MAX_IMAGES}
          onChange={handleFiles}
          className="sr-only"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-transform duration-200 group-hover:scale-105">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <p className="mt-3 text-sm font-bold text-slate-800">
          Upload product images
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Select up to 5 product photos, maximum 8 MB each
        </p>
      </label>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-40 bg-slate-100">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={uploading}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-500 opacity-0 shadow-sm transition-opacity hover:bg-red-50 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-2.5">
                <ImagePlus className="h-4 w-4 shrink-0 text-emerald-600" />

                <span className="truncate text-xs text-slate-500">
                  Product image {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-xs text-slate-400">
          No product images uploaded yet.
        </div>
      )}
    </div>
  );
}