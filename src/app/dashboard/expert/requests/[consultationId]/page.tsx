"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  ShieldCheck,
} from "lucide-react";
import ConsultationDetails from "@/components/expert/ConsultationDetails";
import ConsultationActions from "@/components/expert/ConsultationActions";
import ScheduleConsultationForm from "@/components/expert/ScheduleConsultationForm";
import {
  getConsultationById,
  acceptConsultationRequest,
  rejectConsultationRequest,
  scheduleConsultation,
} from "@/services/consultation.service";
import type {
  Consultation,
  ScheduleConsultationPayload,
} from "@/types/consultation";

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
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

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

  const handleReject = async (reason: string) => {
    setIsProcessing(true);
    try {
      await rejectConsultationRequest(consultationId, reason);
      router.push("/dashboard/expert/requests");
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
      {/* Back and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/expert/requests"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultation Requests
        </Link>

        {/* Action Buttons */}
        <ConsultationActions
          consultation={consultation}
          onAccept={handleAccept}
          onReject={handleReject}
          onOpenSchedule={() => setIsScheduleModalOpen(true)}
          isProcessing={isProcessing}
        />
      </div>

      {/* Main Details */}
      <ConsultationDetails consultation={consultation} />

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleConsultationForm
          consultation={consultation}
          isOpen={true}
          onClose={() => setIsScheduleModalOpen(false)}
          onSchedule={handleSchedule}
          isSubmitting={isProcessing}
        />
      )}
    </div>
  );
}
