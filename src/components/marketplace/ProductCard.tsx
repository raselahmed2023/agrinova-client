"use client";

import Link from "next/link";

import {
  MapPin,
  Package,
  ShoppingCart,
  Store,
  Check,
} from "lucide-react";

import type { IProduct } from "@/types/marketplace";

import { useCart } from "@/context/CartContext";

export default function ProductCard({
  product,
}: {
  product: IProduct;
}) {
  const {
    addToCart,
    getItemQuantity,
  } = useCart();

  const image =
    product.images?.[0];

  const inCart =
    getItemQuantity(
      product._id
    );

  const isAvailable =
    product.status ===
      "available" &&
    product.quantity > 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/marketplace/${product._id}`}
        className="block"
      >
        <div className="relative h-52 overflow-hidden bg-slate-100">
          {image ? (
            <img
              src={image}
              alt={product.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-12 w-12 text-slate-300" />
            </div>
          )}

          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow">
            {product.category.replaceAll(
              "_",
              " "
            )}
          </span>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/marketplace/${product._id}`}
            className="min-w-0"
          >
            <h2 className="line-clamp-2 text-lg font-bold text-slate-900 hover:text-emerald-700">
              {product.title}
            </h2>
          </Link>

          <div className="shrink-0 text-right">
            {product.transactionType ===
            "free" ? (
              <p className="font-extrabold text-emerald-600">
                FREE
              </p>
            ) : (
              <>
                <p className="font-extrabold text-emerald-600">
                  ৳
                  {Number(
                    product.price
                  ).toLocaleString(
                    "en-BD"
                  )}
                </p>

                <p className="text-xs text-slate-400">
                  / {product.unit}
                </p>
              </>
            )}
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">
              Available
            </span>

            <span className="font-semibold text-slate-800">
              {product.quantity}{" "}
              {product.unit}
            </span>
          </div>

          {(product.location ||
            product.district) && (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-500" />

              <span className="truncate">
                {product.location ||
                  [
                    product.district,
                    product.division,
                  ]
                    .filter(Boolean)
                    .join(", ")}
              </span>
            </div>
          )}

          {product.sellerName && (
            <div className="flex items-center gap-2 text-slate-500">
              <Store className="h-4 w-4 shrink-0 text-emerald-500" />

              <span className="truncate">
                {product.sellerName}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!isAvailable}
          onClick={() => {
            if (isAvailable) {
              addToCart(
                product,
                1
              );
            }
          }}
          className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
            !isAvailable
              ? "cursor-not-allowed bg-slate-300 text-white"
              : inCart > 0
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
          }`}
        >
          {!isAvailable ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              Out of Stock
            </>
          ) : inCart > 0 ? (
            <>
              <Check className="h-4 w-4" />
              Added ✓
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}