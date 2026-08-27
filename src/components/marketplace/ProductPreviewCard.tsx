"use client";

import Image from "next/image";
import {
  MapPin,
  Package,
} from "lucide-react";

interface ProductPreviewCardProps {
  title: string;
  category: string;
  price: string;
  quantity: string;
  unit: string;
  location: string;
  imagePreview: string;
}

export default function ProductPreviewCard({
  title,
  category,
  price,
  quantity,
  unit,
  location,
  imagePreview,
}: ProductPreviewCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">
            Listing Preview
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            How buyers may see it
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          Available
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <div className="relative flex h-36 items-center justify-center bg-slate-100">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Listing preview"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <Package className="h-10 w-10 text-slate-300" />
          )}
        </div>

        <div className="bg-white p-4">
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">
            {category}
          </span>

          <h3 className="mt-1 line-clamp-1 font-bold text-slate-900">
            {title || "Your product title"}
          </h3>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-extrabold text-emerald-600">
                ৳
                {Number(
                  price || 0
                ).toLocaleString()}
              </p>

              <p className="text-[11px] text-slate-400">
                per {unit}
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-500">
              {quantity || 0} {unit}
            </p>
          </div>

          {location && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              {location}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}