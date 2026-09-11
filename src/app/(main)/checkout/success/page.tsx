"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();

  const paymentMethod =
    searchParams.get("paymentMethod");

  const isCOD =
    paymentMethod === "cod";

  return (
    <main className="min-h-screen bg-[#f5f8f2] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/70 bg-white p-8 text-center shadow-lg sm:p-12">

          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-11 w-11 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="mt-7 text-3xl font-bold text-slate-900 sm:text-4xl">
            {isCOD
              ? "Order Placed Successfully!"
              : "Payment Successful!"}
          </h1>

          {/* Message */}
          {isCOD ? (
            <div className="mx-auto mt-5 max-w-lg">
              <p className="text-base font-medium leading-7 text-slate-700">
                AgriNova will contact with you
                very soon.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Thank you for staying with us.
              </p>
            </div>
          ) : (
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-600">
              Your payment has been completed
              successfully. Thank you for your
              purchase.
            </p>
          )}

          {/* Order ID */}
          {searchParams.get("orderId") && (
            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                {searchParams.get("orderId")}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link
              href="/marketplace"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>

            <Link
              href="/dashboard/buyer/orders"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              View My Orders
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}