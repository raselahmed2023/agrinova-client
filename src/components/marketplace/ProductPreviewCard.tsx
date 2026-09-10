"use client";

import { IProduct } from "@/types/marketplace";

interface ProductPreviewCardProps {
  product: IProduct;
}

export default function ProductPreviewCard({
  product,
}: ProductPreviewCardProps) {
  const locationParts = [
    product.location,
    product.upazila,
    product.district,
    product.division,
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0
  );

  const locationText =
    locationParts.join(", ");

  const priceText =
    product.transactionType === "free"
      ? "Free"
      : `৳${Number(
          product.price || 0
        ).toLocaleString("en-BD")}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* IMAGE */}

      {product.images?.[0] && (
        <div className="h-56 bg-slate-100">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* CONTENT */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold text-slate-900">
              {product.title}
            </h3>

            <p className="mt-1 text-sm capitalize text-slate-500">
              {product.category}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
            {product.status}
          </span>
        </div>

        {/* DESCRIPTION */}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {product.description}
        </p>

        {/* DETAILS */}

        <div className="mt-5 space-y-3">

          {/* PRICE */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Price
            </span>

            <span className="font-bold text-[#0B513D]">
              {priceText}

              {product.transactionType ===
                "sale" &&
                product.unit && (
                  <span className="font-normal text-slate-500">
                    {" "}
                    / {product.unit}
                  </span>
                )}
            </span>
          </div>

          {/* QUANTITY */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Quantity
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {product.quantity}{" "}
              {product.unit}
            </span>
          </div>

          {/* LOCATION */}

          {locationText && (
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 text-sm text-slate-500">
                Location
              </span>

              <span className="max-w-[65%] text-right text-sm font-medium text-slate-800">
                {locationText}
              </span>
            </div>
          )}

          {/* PRODUCTION METHOD */}

          {product.productionMethod && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">
                Production
              </span>

              <span className="text-sm font-medium capitalize text-slate-800">
                {product.productionMethod}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}