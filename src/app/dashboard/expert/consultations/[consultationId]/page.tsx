"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  FileCheck2,
  Calendar,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import ConsultationDetails from "@/components/expert/ConsultationDetails";
import ConsultationActions from "@/components/expert/ConsultationActions";
import ScheduleConsultationForm from "@/components/expert/ScheduleConsultationForm";
import VideoCallButton from "@/components/expert/VideoCallButton";
import RecommendationForm from "@/components/expert/RecommendationForm";
import {
  getConsultationById,
  updateConsultationStatus,
  submitRecommendation,
  scheduleConsultation,
  acceptConsultation,
  rejectConsultation,
  startVideoConsultation,
} from "@/services/consultation.service";
import type {
  Consultation,
  CreateRecommendationPayload,
  ScheduleConsultationPayload,
} from "@/types/consultation";

export default function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const resolvedParams = use(params);
  const consultationId = resolvedParams.consultationId;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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
    setActionError(null);
    try {
      await acceptConsultation(consultationId);
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to accept consultation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await rejectConsultation(consultationId, reason);
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to reject consultation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartCall = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      if (consultation?.status === "SCHEDULED") {
        await startVideoConsultation(consultationId);
      }
      setIsCallOpen(true);
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to start video call");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!consultation?.recommendations && !consultation?.recommendation) {
      // Prompt expert to write recommendation
      setShowRecommendationForm(true);
      return;
    }

    setIsProcessing(true);
    setActionError(null);
    try {
      await updateConsultationStatus(consultationId, "COMPLETED");
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to complete consultation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSchedule = async (payload: ScheduleConsultationPayload) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await scheduleConsultation(payload);
      setIsScheduleOpen(false);
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to schedule consultation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecommendationSubmit = async (
    payload: CreateRecommendationPayload
  ) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await submitRecommendation(payload);
      setShowRecommendationForm(false);
      await loadData();
    } catch (err: any) {
      setActionError(err?.message || "Failed to submit recommendation");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-6 sm:p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-40 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-8 text-center">
        <p className="text-sm text-slate-500">Consultation not found.</p>
        <Link
          href="/dashboard/expert/consultations"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Consultations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/expert/consultations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Consultations
        </Link>

        {/* Top Interactive Actions by Status */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Consultation"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <ConsultationActions
            consultation={consultation}
            onAccept={handleAccept}
            onReject={handleReject}
            onOpenSchedule={() => setIsScheduleOpen(true)}
            onStartCall={handleStartCall}
            onOpenRecommendation={() => setShowRecommendationForm(true)}
            onMarkCompleted={handleMarkCompleted}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {actionError && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-rose-800 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Write Prescription / Recommendation Modal */}
      {showRecommendationForm && (
        <RecommendationForm
          consultation={consultation}
          isOpen={true}
          onClose={() => setShowRecommendationForm(false)}
          onSubmit={handleRecommendationSubmit}
          isSubmitting={isProcessing}
        />
      )}

      {/* Consultation Details Components */}
      <ConsultationDetails consultation={consultation} />

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <ScheduleConsultationForm
          consultation={consultation}
          isOpen={true}
          onClose={() => setIsScheduleOpen(false)}
          onSchedule={handleSchedule}
          isSubmitting={isProcessing}
        />
      )}

      {/* Jitsi Meet Video Call Modal */}
      {isCallOpen && (
        <VideoCallButton
          consultation={consultation}
          userName={consultation.expert?.name || "AgriNova Specialist"}
          onCallEnded={async () => {
            setIsCallOpen(false);
            if (consultation.status === "ONGOING") {
              setShowRecommendationForm(true);
            }
            await loadData();
          }}
        />
      )}
    </div>
  );
}
