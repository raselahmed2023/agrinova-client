
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";
import { OrderService } from "@/services/order.service";

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CancelContent />
    </Suspense>
  );
}

function CancelContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [releasing, setReleasing] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;
    let active = true;

    OrderService.cancelStripeOrder(orderId)
      .catch(() => undefined)
      .finally(() => {
        if (active) setReleasing(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  if (releasing) return <Spinner />;

  return (
    <MarketplaceBackground>
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white/95 p-8 text-center shadow-xl backdrop-blur-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-9 w-9 text-red-600" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-950">Payment cancelled</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The card checkout was cancelled and the reserved marketplace stock was released. Your cart is still available if you want to try again.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/checkout" className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-6 text-sm font-bold text-white hover:bg-emerald-800">Return to checkout</Link>
            <Link href="/marketplace" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">Back to marketplace</Link>
          </div>
        </div>
      </main>
    </MarketplaceBackground>
  );
}

function Spinner() {
  return (
    <MarketplaceBackground>
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700" />
      </main>
    </MarketplaceBackground>
  );
}

