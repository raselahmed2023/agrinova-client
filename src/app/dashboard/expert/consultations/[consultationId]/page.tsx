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

  const handleStartCall = async () => {
    setIsProcessing(true);
    try {
      await updateConsultationStatus(consultationId, "ONGOING");
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSchedule = async (payload: ScheduleConsultationPayload) => {
    setIsProcessing(true);
    try {
      await scheduleConsultation(payload);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecommendationSubmit = async (
    payload: CreateRecommendationPayload
  ) => {
    setIsProcessing(true);
    try {
      await submitRecommendation(payload);
      setShowRecommendationForm(false);
      await loadData();
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
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/expert/consultations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Consultations
        </Link>

        {/* Top interactive actions */}
        <div className="flex flex-wrap items-center gap-3">
          {(consultation.status === "SCHEDULED" ||
            consultation.status === "ONGOING") && (
            <VideoCallButton
              consultation={consultation}
              onCallEnded={async () => {
                await updateConsultationStatus(consultationId, "ONGOING");
                setShowRecommendationForm(true);
                await loadData();
              }}
            />
          )}

          <ConsultationActions
            consultation={consultation}
            onOpenSchedule={() => setIsScheduleOpen(true)}
            onStartCall={handleStartCall}
            onOpenRecommendation={() => setShowRecommendationForm(true)}
            isProcessing={isProcessing}
          />
        </div>
      </div>

      {/* Write Prescription / Recommendation Section */}
      {showRecommendationForm && (
        <RecommendationForm
          consultation={consultation}
          isOpen={true}
          onClose={() => setShowRecommendationForm(false)}
          onSubmit={handleRecommendationSubmit}
          isSubmitting={isProcessing}
        />
      )}

      {/* Consultation Details */}
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
    </div>
  );
}
