"use client";

import Link from "next/link";

import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!items.length) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <ShoppingCart className="mx-auto h-14 w-14 text-slate-300" />

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Browse the AgriNova
            Marketplace and add
            products to your cart.
          </p>

          <Link
            href="/marketplace"
            className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
          >
            Browse Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Cart
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review your selected
              marketplace products.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-semibold text-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_350px]">
          <section className="space-y-4">
            {items.map(
              ({
                product,
                quantity,
              }) => (
                <article
                  key={
                    product._id
                  }
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      {product
                        .images?.[0] ? (
                        <img
                          src={
                            product
                              .images[0]
                          }
                          alt={
                            product.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-slate-900">
                        {
                          product.title
                        }
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        ৳
                        {Number(
                          product.price
                        ).toLocaleString(
                          "en-BD"
                        )}
                        {product.unit
                          ? ` / ${product.unit}`
                          : ""}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={
                            quantity <=
                            1
                          }
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              quantity -
                                1
                            )
                          }
                          className="rounded-lg border p-2 disabled:opacity-40"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-6 text-center font-semibold">
                          {
                            quantity
                          }
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
                              quantity +
                                1
                            )
                          }
                          className="rounded-lg border p-2 disabled:opacity-40"
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
                          className="ml-auto rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="font-bold text-slate-900">
                      ৳
                      {(
                        Number(
                          product.price
                        ) *
                        quantity
                      ).toLocaleString(
                        "en-BD"
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </section>

          <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-5 flex justify-between text-slate-600">
              <span>
                Subtotal
              </span>

              <span>
                ৳
                {subtotal.toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>

            <div className="my-5 border-t" />

            <div className="flex justify-between text-lg font-bold">
              <span>
                Subtotal
              </span>

              <span>
                ৳
                {subtotal.toLocaleString(
                  "en-BD"
                )}
              </span>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block rounded-xl bg-emerald-700 px-5 py-3.5 text-center text-sm font-bold text-white hover:bg-emerald-800"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}