"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  Package,
  ShoppingCart,
  Store,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

import type {
  IProduct,
} from "@/types/marketplace";

export default function ProductDetails({
  product,
  backHref = "/marketplace",
}: {
  product: IProduct;
  backHref?: string;
}) {
  const {
    addToCart,
    getItemQuantity,
  } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const isAvailable =
    product.status ===
      "available" &&
    product.quantity > 0;

  const inCart =
    getItemQuantity(
      product._id
    );

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="mt-6 grid gap-7 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="h-[420px] bg-slate-100">
              {product.images?.[0] ? (
                <img
                  src={
                    product.images[0]
                  }
                  alt={
                    product.title
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          <section className="rounded-3xl border bg-white p-7 shadow-sm">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
              {product.category.replaceAll(
                "_",
                " "
              )}
            </span>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {product.title}
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              {
                product.description
              }
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Info
                label="Available"
                value={`${product.quantity} ${product.unit}`}
              />

              <Info
                label="Production"
                value={
                  product.productionMethod
                }
              />

              <Info
                label="Transaction"
                value={
                  product.transactionType
                }
              />

              <Info
                label="Price"
                value={
                  product.transactionType ===
                  "free"
                    ? "Free"
                    : `৳${Number(
                        product.price
                      ).toLocaleString(
                        "en-BD"
                      )} / ${product.unit}`
                }
              />
            </div>

            {(product.location ||
              product.district ||
              product.division) && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <span>
                  {product.location ||
                    [
                      product.upazila,
                      product.district,
                      product.division,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        ", "
                      )}
                </span>
              </div>
            )}

            {product.sellerName && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <Store className="h-5 w-5 text-emerald-600" />
                {
                  product.sellerName
                }
              </div>
            )}

            {isAvailable && (
              <div className="mt-7">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min={1}
                    max={
                      product.quantity
                    }
                    value={
                      quantity
                    }
                    onChange={(
                      event
                    ) =>
                      setQuantity(
                        Math.min(
                          product.quantity,
                          Math.max(
                            1,
                            Number(
                              event
                                .target
                                .value
                            ) || 1
                          )
                        )
                      )
                    }
                    className="h-11 w-28 rounded-xl border px-3 text-center outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      product,
                      quantity
                    )
                  }
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 font-bold text-white hover:bg-emerald-800"
                >
                  <ShoppingCart className="h-5 w-5" />

                  {inCart
                    ? `Add More • ${inCart} Already in Cart`
                    : "Add to Cart"}
                </button>
              </div>
            )}

            {!isAvailable && (
              <div className="mt-7 rounded-xl bg-slate-100 p-4 text-center text-sm font-semibold text-slate-500">
                This product is
                currently
                unavailable.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-semibold capitalize text-slate-900">
        {value}
      </p>
    </div>
  );
}