"use client";

import Image from "next/image";
import { ChangeEvent } from "react";
import {
  ImagePlus,
  Trash2,
} from "lucide-react";

interface ProductImageUploadProps {
  imageFile: File | null;
  imagePreview: string;
  disabled?: boolean;
  onImageChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onRemove: () => void;
}

export default function ProductImageUpload({
  imageFile,
  imagePreview,
  disabled,
  onImageChange,
  onRemove,
}: ProductImageUploadProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold text-slate-900">
          Product Image
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Add a clear photo of your product.
        </p>
      </div>

      <div className="p-5">
        {!imagePreview ? (
          <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <ImagePlus className="h-6 w-6 text-emerald-600" />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-700">
              Upload product image
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              PNG, JPG or WEBP
              <br />
              Maximum 5MB
            </p>

            <span className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">
              Choose Image
            </span>

            <input
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="relative h-64 bg-slate-50">
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 p-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {imageFile?.name}
                </p>

                {imageFile && (
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {(
                      imageFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={onRemove}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}