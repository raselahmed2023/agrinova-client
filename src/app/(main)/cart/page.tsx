
"use client";

import { useEffect } from "react";
import Link from "next/link";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

const DELIVERY_FEE = 120;

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    refreshCart,
    loading,
  } = useCart();

  useEffect(() => {
    if (!loading) {
      refreshCart().catch(() => undefined);
    }
    // Refresh once when the persisted cart becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  /*
   * Loading state:
   * spinner only — no text, no favicon, no logo.
   */
  if (loading) {
    return (
      <MarketplaceBackground>
        <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
          <div className="mx-auto flex min-h-[500px] w-full max-w-[1400px] items-center justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700"
              aria-label="Loading"
            />
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  /*
   * Empty cart
   */
  if (!items.length) {
    return (
      <MarketplaceBackground>
        <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
          <div className="mx-auto flex min-h-[500px] w-full max-w-[1400px] items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl border border-white/70 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm sm:p-10">
              <ShoppingCart className="mx-auto h-14 w-14 text-slate-400" />

              <h1 className="mt-5 text-3xl font-bold text-black">
                Your Cart Is Empty
              </h1>

              <p className="mt-3 text-sm font-medium leading-6 text-black">
                Browse the AgriNova Marketplace and
                add products to your cart.
              </p>

              <Link
                href="/marketplace"
                className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </main>
      </MarketplaceBackground>
    );
  }

  const total =
    subtotal + DELIVERY_FEE;

  return (
    <MarketplaceBackground>
      <main className="min-h-screen px-3 py-6 sm:px-5 sm:py-8 lg:px-6">
        <div className="mx-auto w-full max-w-[1400px]">

          {/* Header */}
          <div className="inline-block rounded-2xl bg-white/55 px-4 py-3 shadow-sm backdrop-blur-[2px]">
          <h1 className="text-3xl font-bold text-black drop-shadow-sm">
            My Cart
          </h1>

          <p className="mt-1 text-sm font-medium text-black drop-shadow-sm">
            Review your selected marketplace products
            before checkout.
          </p>
        </div>

        {/* Cart + Summary */}
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* Cart Products */}
          <section className="space-y-3">
            {items.map(
              ({
                product,
                quantity,
              }) => {
                const lineTotal =
                  Number(
                    product.price || 0
                  ) * quantity;

                return (
                  <article
                    key={product._id}
                    className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:p-5"
                  >
                    <div className="flex gap-4">

                      {/* Product Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
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
                          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-600">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Information */}
                      <div className="min-w-0 flex-1">

                        <Link
                          href={`/marketplace/${product._id}`}
                          className="block font-bold text-black transition hover:text-emerald-700"
                        >
                          {product.title}
                        </Link>

                        <p className="mt-1 text-sm font-medium text-black">
                          {product.transactionType ===
                            "free"
                            ? "FREE"
                            : `৳${Number(
                              product.price
                            ).toLocaleString(
                              "en-BD"
                            )}${product.unit
                              ? ` / ${product.unit}`
                              : ""
                            }`}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                          {product.quantity} {product.unit || "unit"} remaining
                        </p>

                        {/* Quantity Controls */}
                        <div className="mt-4 flex items-center gap-3">

                          <button
                            type="button"
                            disabled={
                              quantity <= 1
                            }
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-black transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="min-w-6 text-center text-sm font-bold text-black">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            disabled={
                              quantity >=
                              Number(
                                product.quantity
                              )
                            }
                            onClick={() =>
                              updateQuantity(
                                product._id,
                                quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-black transition hover:border-emerald-400 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                product._id
                              )
                            }
                            aria-label="Remove product"
                            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                        </div>
                      </div>

                      {/* Desktop Total */}
                      <div className="hidden shrink-0 text-right sm:block">
                        {product.transactionType ===
                          "free" ? (
                          <p className="font-bold text-emerald-700">
                            FREE
                          </p>
                        ) : (
                          <p className="font-bold text-black">
                            ৳
                            {lineTotal.toLocaleString(
                              "en-BD"
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile Total */}
                    <div className="mt-3 flex justify-end border-t border-slate-200 pt-3 sm:hidden">
                      {product.transactionType ===
                        "free" ? (
                        <p className="font-bold text-emerald-700">
                          FREE
                        </p>
                      ) : (
                        <p className="font-bold text-black">
                          ৳
                          {lineTotal.toLocaleString(
                            "en-BD"
                          )}
                        </p>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </section>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:p-6 lg:sticky lg:top-6">

            <h2 className="text-xl font-bold text-black">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">

              {/* Subtotal */}
              <div className="flex justify-between text-black">
                <span>Subtotal</span>

                <span className="font-semibold">
                  ৳
                  {subtotal.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between text-black">
                <span>Delivery Charge</span>

                <span className="font-semibold">
                  ৳
                  {DELIVERY_FEE.toLocaleString(
                    "en-BD"
                  )}
                </span>
              </div>

            </div>

            <div className="my-5 border-t border-slate-300" />

            {/* Total */}
            <div className="flex justify-between text-lg font-bold text-black">
              <span>Total</span>

              <span className="text-emerald-700">
                ৳
                {total.toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>

            {/* Checkout */}
            <Link
              href="/checkout"
              className="mt-6 flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <Link
              href="/marketplace"
              className="mt-3 flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-black transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Continue Shopping
            </Link>

          </aside>
        </div>
      </div>
    </main>
    </MarketplaceBackground >
  );
}
