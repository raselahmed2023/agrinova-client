"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar,
  Video,
} from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { verifyConsultationStripeCheckout } from "@/services/consultant-booking.service";
import type { Consultation } from "@/types/consultation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const sessionId =
    searchParams.get("session_id") || "";

  const [
    consultation,
    setConsultation,
  ] = useState<Consultation | null>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!sessionId) {
        setError(
          "Stripe session ID is missing."
        );
        setLoading(false);
        return;
      }

      try {
        const result =
          await verifyConsultationStripeCheckout(
            sessionId
          );

        if (active) {
          setConsultation(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify payment."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void verify();

    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-10">

        {loading ? (
          <div className="flex flex-col items-center py-14 text-center">

            <Loader2 className="h-10 w-10 animate-spin text-emerald-700" />

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Verifying your payment
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please keep this page open for a moment.
            </p>

          </div>
        ) : error ? (
          <div className="text-center">

            <AlertCircle className="mx-auto h-12 w-12 text-rose-600" />

            <h1 className="mt-4 text-2xl font-black text-slate-900">
              Payment verification needs attention
            </h1>

            <p className="mt-3 text-sm text-slate-600">
              {error}
            </p>

            <Link
              href="/consultant"
              className="mt-6 inline-flex rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white"
            >
              Back to Experts
            </Link>

          </div>
        ) : consultation ? (
          <div>

            <div className="text-center">

              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />

              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Payment Confirmed
              </p>

              <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                Your expert consultation is booked
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The paid appointment is now available
                in your farmer dashboard and to the
                assigned expert.
              </p>

            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">

              <div className="flex items-center gap-2 font-bold text-slate-900">

                <Calendar className="h-4 w-4 text-emerald-700" />

                <span>
                  {consultation.scheduledDate ||
                    consultation.preferredDate ||
                    "Scheduled date"}
                  {" · "}
                  {consultation.scheduledTime ||
                    consultation.preferredTime ||
                    "Scheduled time"}
                </span>

              </div>

              <p className="mt-3">
                <span className="font-bold">
                  Expert:
                </span>{" "}
                {consultation.expertName ||
                  consultation.expert?.name ||
                  "AgriNova Expert"}
              </p>

              <p className="mt-1">
                <span className="font-bold">
                  Fee paid:
                </span>{" "}
                ৳
                {Number(
                  consultation.consultationFee ||
                    0
                ).toLocaleString("en-BD")}
              </p>

              {consultation.meetingLink && (
                <p className="mt-3 flex items-start gap-2">

                  <Video className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

                  <span>
                    Your secure meeting link is
                    ready inside the consultation
                    details page.
                  </span>

                </p>
              )}

            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <Link
                href="/dashboard/farmer/consultation"
                className="inline-flex justify-center rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-900"
              >
                View My Consultations
              </Link>

              <Link
                href="/consultant"
                className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Back to Experts
              </Link>

            </div>

          </div>
        ) : null}

      </div>
    </main>
  );
}

export default function ConsultationPaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <Suspense
        fallback={
          <main className="min-h-[70vh] bg-slate-50" />
        }
      >
        <PaymentSuccessContent />
      </Suspense>

      <Footer />

    </div>
  );
}