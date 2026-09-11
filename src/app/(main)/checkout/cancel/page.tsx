"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

export default function CheckoutCancelPage() {
  return (
    <MarketplaceBackground>
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-2xl border border-white/70 bg-white/90 p-8 text-center shadow-lg backdrop-blur-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-9 w-9 text-red-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-black">
            Payment Cancelled
          </h1>

          <p className="mt-3 text-sm leading-6 text-black">
            Your payment was cancelled or was not completed.
            You can return to checkout and try again.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/checkout"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#063B2B] px-6 text-sm font-semibold text-white transition hover:bg-[#0B513D]"
            >
              Return to Checkout
            </Link>

            <Link
              href="/marketplace"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-black transition hover:bg-slate-50"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    </MarketplaceBackground>
  );
}