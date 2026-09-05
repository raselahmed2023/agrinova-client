"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Calendar,
  Video,
  FileCheck2,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";

interface ConsultationActionsProps {
  consultation: Consultation;
  onAccept?: () => Promise<void> | void;
  onReject?: (reason: string) => Promise<void> | void;
  onOpenSchedule?: () => void;
  onStartCall?: () => void;
  onOpenRecommendation?: () => void;
  onMarkCompleted?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  isProcessing?: boolean;
}

export default function ConsultationActions({
  consultation,
  onAccept,
  onReject,
  onOpenSchedule,
  onStartCall,
  onOpenRecommendation,
  onMarkCompleted,
  onDelete,
  isProcessing = false,
}: ConsultationActionsProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleConfirmReject = async () => {
    if (onReject) {
      await onReject(rejectReason || "Expert unavailable for this consultation.");
      setShowRejectModal(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 1. PENDING State: Accept or Reject */}
      {consultation.status === "PENDING" && (
        <>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setShowRejectModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100/80 transition disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Reject Request
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onAccept}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Accept Consultation
          </button>
        </>
      )}

      {/* 2. ACCEPTED State: Schedule Consultation */}
      {consultation.status === "ACCEPTED" && (
        <button
          type="button"
          disabled={isProcessing}
          onClick={onOpenSchedule}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <Calendar className="h-4 w-4" />
          Schedule Consultation
        </button>
      )}

      {/* 3. SCHEDULED State: Reschedule & Start Video Call */}
      {consultation.status === "SCHEDULED" && (
        <>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onOpenSchedule}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Clock className="h-4 w-4 text-slate-500" />
            Reschedule
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onStartCall}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <Video className="h-4 w-4" />
            Start Video Call
          </button>
        </>
      )}

      {/* 4. ONGOING State: Join Video Call, Add/Update Recommendation, Mark as Completed */}
      {consultation.status === "ONGOING" && (
        <>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onStartCall}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition animate-pulse"
          >
            <Video className="h-4 w-4" />
            Join Video Call
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onOpenRecommendation}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition"
          >
            <Sparkles className="h-4 w-4" />
            Add / Update Recommendation
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onMarkCompleted || onOpenRecommendation}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark as Completed
          </button>
        </>
      )}

      {/* Delete Upcoming Consultation button */}
      {onDelete &&
        (consultation.status === "SCHEDULED" ||
          consultation.status === "ACCEPTED" ||
          consultation.status === "PENDING") && (
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100/80 transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Consultation</span>
          </button>
        )}

      {/* 5. COMPLETED State: View Only */}
      {consultation.status === "COMPLETED" && (
        <span className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Completed (Recommendation View-Only)
        </span>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <Trash2 className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Delete Upcoming Consultation
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              Are you sure you want to delete this upcoming consultation? The booked appointment slot will be released and this session will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={async () => {
                  if (onDelete) {
                    await onDelete();
                    setShowDeleteModal(false);
                  }
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Yes, Delete Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-slate-900">
                Reject Consultation Request
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Please provide a brief reason for the farmer.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Outside my specialization, or fully booked this week."
              className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
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
