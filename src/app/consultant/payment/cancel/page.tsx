"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  XCircle,
  Loader2,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

import {
  cancelConsultationStripeCheckout,
} from "@/services/consultant-booking.service";

function PaymentCancelContent() {
  const searchParams =
    useSearchParams();

  const consultationId =
    searchParams.get("consultationId") ||
    "";

  const [updating, setUpdating] =
    useState(
      Boolean(consultationId)
    );

  useEffect(() => {
    let active = true;

    if (!consultationId) {
      setUpdating(false);
      return;
    }

    cancelConsultationStripeCheckout(
      consultationId
    )
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setUpdating(false);
        }
      });

    return () => {
      active = false;
    };
  }, [consultationId]);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-16">

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

        {updating ? (
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-amber-600" />
        )}

        <h1 className="mt-4 text-2xl font-black text-slate-900">
          Consultation payment cancelled
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          No paid consultation was sent
          to the expert. You can choose the
          expert and book again whenever
          you are ready.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            href="/consultant"
            className="rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
          >
            Return to Experts
          </Link>

          <Link
            href="/dashboard/farmer/consultation"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
          >
            My Consultations
          </Link>

        </div>

      </div>
    </main>
  );
}

export default function ConsultationPaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <Suspense
        fallback={
          <main className="min-h-[70vh] bg-slate-50" />
        }
      >
        <PaymentCancelContent />
      </Suspense>

      <Footer />

    </div>
  );
}