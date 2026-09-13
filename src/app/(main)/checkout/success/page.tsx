
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";
import { useCart } from "@/context/CartContext";
import { OrderService } from "@/services/order.service";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");
  const orderIdFromUrl = searchParams.get("orderId");
  const isCOD = searchParams.get("paymentMethod") === "cod";

  const [checking, setChecking] = useState(Boolean(sessionId));
  const [verified, setVerified] = useState(isCOD);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState(orderIdFromUrl || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isCOD) return;
    if (!sessionId) {
      setChecking(false);
      setError("Stripe session information is missing. Check My Orders for the latest payment status.");
      return;
    }

    let active = true;

    OrderService.getStripeCheckoutSession(sessionId)
      .then((result) => {
        if (!active) return;
        const paid = result.paymentStatus === "paid" || result.orderPaymentStatus === "paid";
        setVerified(paid);
        setOrderNumber(result.orderNumber);
        setOrderId(result.orderId);
        if (paid) clearCart();
        if (!paid) setError("Payment is not confirmed yet. Please check My Orders before trying another payment.");
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to verify this payment.");
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [clearCart, isCOD, sessionId]);

  if (checking) return <PageSpinner />;

  return (
    <MarketplaceBackground>
      <main className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/70 bg-white/95 p-8 text-center shadow-xl backdrop-blur-sm sm:p-12">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${verified ? "bg-emerald-50" : "bg-amber-50"}`}>
              {verified ? (
                <CheckCircle2 className="h-11 w-11 text-emerald-600" />
              ) : (
                <Clock3 className="h-11 w-11 text-amber-600" />
              )}
            </div>

            <h1 className="mt-7 text-3xl font-extrabold text-slate-950 sm:text-4xl">
              {isCOD
                ? "Order placed successfully"
                : verified
                  ? "Payment confirmed"
                  : "Payment status needs attention"}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-600">
              {isCOD
                ? "Your stock has been reserved and the seller can now prepare the order. AgriNova will coordinate collection and delivery after the seller marks it ready for pickup."
                : verified
                  ? "Your card payment is verified. The seller has been notified and can start preparing your order."
                  : error}
            </p>

            {(orderNumber || orderId) && (
              <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-left">
                {orderNumber && <p className="text-sm font-bold text-slate-900">Order {orderNumber}</p>}
                {orderId && <p className="mt-1 break-all text-xs text-slate-500">ID: {orderId}</p>}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/marketplace" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-bold text-white hover:bg-emerald-800">
                <ShoppingBag className="h-4 w-4" /> Continue shopping
              </Link>
              <Link href="/orders" className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 hover:border-emerald-400 hover:text-emerald-700">
                View my orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    </MarketplaceBackground>
  );
}

function PageSpinner() {
  return (
    <MarketplaceBackground>
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-700" />
      </main>
    </MarketplaceBackground>
  );
}

