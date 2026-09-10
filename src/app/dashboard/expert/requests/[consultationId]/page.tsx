"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import ConsultationDetails from "@/components/expert/ConsultationDetails";
import {
  getConsultationById,
  acceptConsultationRequest,
  rejectConsultationRequest,
} from "@/services/consultation.service";
import type { Consultation } from "@/types/consultation";

export default function ConsultationRequestDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const consultationId = resolvedParams.consultationId;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultationById(consultationId);
      setConsultation(data);
    } catch (err) {
      console.error("Failed to load consultation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [consultationId]);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await acceptConsultationRequest(consultationId);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReject = async () => {
    setIsProcessing(true);
    try {
      await rejectConsultationRequest(
        consultationId,
        rejectReason || "Unable to handle this consultation."
      );
      setShowRejectModal(false);
      router.push("/dashboard/expert/requests");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-6 sm:p-8">
        <div className="h-64 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-8 text-center">
        <p className="text-sm text-slate-500">Consultation request not found.</p>
        <Link
          href="/dashboard/expert/requests"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Bar: Back Link & Conditional Action Buttons (Only when status = PENDING) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/expert/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultation Requests
        </Link>

        {/* Buttons only when status = PENDING */}
        {consultation.status === "PENDING" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => {
                setRejectReason("Unable to handle this consultation.");
                setShowRejectModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Reject Request
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAccept}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              Accept Request
            </button>
          </div>
        )}
      </div>

      {/* Main Details: Farmer Details, Farm Details, District, Crop, Problem Title, Problem Description, Uploaded Images, Requested Date */}
      <ConsultationDetails consultation={consultation} />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2 rounded-xl bg-rose-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject Consultation Request
                </h3>
                <p className="text-xs text-slate-500">
                  Provide an optional reason explaining why you are rejecting this request.
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Unable to handle this consultation."
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
