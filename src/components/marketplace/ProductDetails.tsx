"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  Check,
  MapPin,
  Package,
  Plus,
  Minus,
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

  const [activeImage, setActiveImage] =
    useState(0);

  const images =
    product.images?.filter(Boolean) || [];

  const currentImage =
    images[activeImage] || images[0];

  const isAvailable =
    product.status === "available" &&
    product.quantity > 0;

  /*
   * IMPORTANT:
   * Do not use temporary local state for "Added".
   * The cart is the source of truth.
   * This means the button remains "Added ✓"
   * after scrolling, navigating away and coming
   * back to this product, as long as it is still
   * in the cart.
   */
  const inCart =
    getItemQuantity(product._id);

  const category =
    product.category?.replaceAll(
      "_",
      " "
    );

  const price =
    Number(product.price || 0);

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        product.quantity,
        current + 1
      )
    );
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      return;
    }

    addToCart(product, quantity);
  };

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <main className="min-h-screen bg-[#f5f8f2]">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-5 sm:px-5 lg:px-6">
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] xl:gap-7">
          {/* PRODUCT IMAGE */}
          <section className="h-fit overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="relative mx-auto aspect-[4/3] max-h-[440px] overflow-hidden bg-slate-100">
              {currentImage ? (
                <>
                  <Image
                    src={currentImage}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="object-cover"
                    unoptimized
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4">
                    <span className="inline-flex rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700 shadow-sm backdrop-blur">
                      {category}
                    </span>
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousImage}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white hover:text-emerald-700"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white hover:text-emerald-700"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                        {activeImage + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-14 w-14 text-slate-300" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-slate-100 p-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setActiveImage(index)
                    }
                    className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      activeImage === index
                        ? "border-emerald-600 ring-2 ring-emerald-100"
                        : "border-transparent opacity-70 hover:border-slate-300 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* PRODUCT INFORMATION */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvailable
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                {isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>

              {inCart > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                  {inCart} in cart
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {product.description}
            </p>

            {/* PRICE */}
            <div className="mt-6 flex items-end justify-between gap-4 rounded-2xl bg-[#f4f8f3] px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Price
                </p>

                {product.transactionType === "free" ? (
                  <p className="mt-1 text-3xl font-extrabold text-emerald-700">
                    FREE
                  </p>
                ) : (
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-700">
                      ৳{price.toLocaleString("en-BD")}
                    </span>

                    <span className="text-sm font-medium text-slate-400">
                      / {product.unit}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Available
                </p>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  {product.quantity} {product.unit}
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <DetailItem
                label="Category"
                value={category}
              />

              <DetailItem
                label="Production"
                value={product.productionMethod}
              />

              <DetailItem
                label="Transaction"
                value={product.transactionType}
              />

              <DetailItem
                label="Unit"
                value={product.unit}
              />
            </div>

            {/* LOCATION */}
            {(product.location ||
              product.upazila ||
              product.district ||
              product.division) && (
              <div className="mt-4 flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <MapPin className="h-4 w-4 text-emerald-700" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {product.location ||
                      [
                        product.upazila,
                        product.district,
                        product.division,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* SELLER */}
            {product.sellerName && (
              <div className="mt-3 flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <Store className="h-4 w-4 text-emerald-700" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Seller
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                    {product.sellerName}
                  </p>
                </div>
              </div>
            )}

            {/* CART ACTION */}
            {isAvailable && (
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    Quantity
                  </span>

                  <span className="text-xs text-slate-400">
                    {product.quantity} {product.unit} available
                  </span>
                </div>

                <div className="mt-3 flex gap-3">
                  <div className="flex h-12 shrink-0 items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-full w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="flex h-full min-w-11 items-center justify-center border-x border-slate-200 px-2 text-sm font-bold text-slate-900">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={
                        quantity >= product.quantity
                      }
                      aria-label="Increase quantity"
                      className="flex h-full w-10 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-bold transition ${
                      inCart > 0
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                        : "bg-emerald-700 text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800 hover:shadow-lg"
                    }`}
                  >
                    {inCart > 0 ? (
                      <>
                        <Check className="h-5 w-5" />
                        Added ✓
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>

                {inCart > 0 && (
                  <p className="mt-2 text-center text-xs text-emerald-600">
                    This product is already in your cart.
                  </p>
                )}
              </div>
            )}

            {!isAvailable && (
              <div className="mt-6 rounded-2xl bg-slate-100 p-5 text-center">
                <Package className="mx-auto h-6 w-6 text-slate-400" />

                <p className="mt-2 text-sm font-bold text-slate-600">
                  This product is currently unavailable.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold capitalize text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}
