"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          Payment Successful!
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your payment has been completed successfully.
          Thank you for your purchase.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#063B2B] px-6 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
          >
            View My Orders
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}