import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Package,
  Store,
} from "lucide-react";

import type { MarketplaceProduct } from "@/types/marketplace";

interface ProductCardProps {
  product: MarketplaceProduct;
}

const formatCategory = (
  category: string
) =>
  category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

export default function ProductCard({
  product,
}: ProductCardProps) {
  const image =
    product.images?.[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-2 text-xs font-medium text-slate-400">
                No product image
              </p>
            </div>
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {formatCategory(
            product.category
          )}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
            {product.title}
          </h2>

          <div className="shrink-0 text-right">
            <p className="text-lg font-extrabold text-emerald-600">
              ৳
              {product.price.toLocaleString()}
            </p>

            <p className="text-xs text-slate-400">
              per {product.unit}
            </p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Available
            </span>

            <span className="font-semibold text-slate-800">
              {product.quantity}{" "}
              {product.unit}
            </span>
          </div>

          {product.location && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-500" />

              <span className="truncate">
                {product.location}
              </span>
            </div>
          )}

          {product.sellerName && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Store className="h-4 w-4 shrink-0 text-emerald-500" />

              <span className="truncate">
                {product.sellerName}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/dashboard/farmer/marketplace/${product._id}`}
          className="mt-5 flex h-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}