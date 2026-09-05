"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  FileCheck2,
  Calendar,
  Clock,
  User,
  Building2,
  MapPin,
  Sprout,
  CheckCircle2,
  Info,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Edit3,
  CalendarDays,
} from "lucide-react";
import { getConsultationById } from "@/services/consultation.service";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge, {
  UrgencyBadge,
} from "@/components/expert/ConsultationStatusBadge";
import VideoCallButton from "@/components/expert/VideoCallButton";
import ConsultationCountdownCard from "@/components/consultant/ConsultationCountdownCard";
import EditConsultationModal from "@/components/consultant/EditConsultationModal";
import RescheduleConsultationModal from "@/components/consultant/RescheduleConsultationModal";

export default function FarmerConsultationDetailPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const resolvedParams = use(params);
  const consultationId = resolvedParams.consultationId;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-8 text-center max-w-md mx-auto space-y-4">
        <p className="text-sm text-slate-500">
          Consultation not found or you are not authorized to view this request.
        </p>
        <Link
          href="/dashboard/farmer/consultation"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Consultations
        </Link>
      </div>
    );
  }

  const scheduledDisplay = consultation.scheduledAt
    ? new Date(consultation.scheduledAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : consultation.scheduledDate
    ? `${consultation.scheduledDate} · ${consultation.scheduledTime || ""}`
    : null;

  return (
    <div className="min-h-screen bg-slate-50/60 p-3 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <Link
          href="/dashboard/farmer/consultation"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Consultations
        </Link>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm flex-1 sm:flex-none"
          >
            <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Edit Details</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRescheduleModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100/80 shadow-sm flex-1 sm:flex-none"
          >
            <CalendarDays className="h-3.5 w-3.5 text-emerald-700" />
            <span>Reschedule</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm flex-1 sm:flex-none"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 1. Live Countdown & Video Room Hero Card */}
      <ConsultationCountdownCard
        consultation={consultation}
        onEditDetails={() => setIsEditModalOpen(true)}
        onReschedule={() => setIsRescheduleModalOpen(true)}
        onRefresh={loadData}
      />

      {/* 2. Expert & Consultation Session Banner */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-800 text-lg sm:text-xl shadow-inner">
              {consultation.expert?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={consultation.expert.avatar}
                  alt={consultation.expert.name || "Specialist"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-700" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 break-words">
                  {consultation.expert?.name || consultation.expertName || "Assigned Specialist"}
                </h2>
                <ConsultationStatusBadge status={consultation.status} size="md" />
                <UrgencyBadge urgency={consultation.urgency} />
              </div>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {consultation.expert?.title || "Senior Agronomist & Plant Pathologist"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsRescheduleModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <Calendar className="h-3.5 w-3.5 text-emerald-700" />
              Change Slot
            </button>
          </div>
        </div>

        {/* Schedule & Crop Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Scheduled Date & Time
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {scheduledDisplay || "Awaiting Expert Schedule"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Farm & District
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {consultation.farmName || "Registered Farm"} · {consultation.district || "Bangladesh"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Crop & Issue
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {consultation.cropType} · {consultation.problemTitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Official Recommendation Card if completed */}
      {(consultation.recommendations || consultation.recommendation) && (
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base sm:text-lg">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 shrink-0" />
              <span>Specialist Diagnostic Recommendation</span>
            </div>
            {consultation.recommendations?.createdAt && (
              <span className="text-xs text-slate-500">
                Issued on{" "}
                {new Date(
                  consultation.recommendations.createdAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Doctor Diagnosis
              </h5>
              <p className="text-sm font-bold text-slate-900">
                {consultation.recommendations?.diagnosis || consultation.recommendation}
              </p>
            </div>

            {consultation.recommendations?.prescriptions &&
              consultation.recommendations.prescriptions.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Prescribed Treatments & Inputs
                  </h5>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {consultation.recommendations.prescriptions.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {consultation.recommendations?.treatmentSteps &&
              consultation.recommendations.treatmentSteps.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Action Plan
                  </h5>
                  <ol className="space-y-2 text-sm text-slate-700">
                    {consultation.recommendations.treatmentSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            {consultation.recommendations?.followUpDate && (
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-emerald-100/50 p-3 rounded-xl">
                <Calendar className="h-4 w-4 text-emerald-700" />
                <span>
                  Follow-up Review Date:{" "}
                  <strong className="text-slate-900">
                    {consultation.recommendations.followUpDate}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Problem Description & Uploaded Images */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
              Submitted Issue
            </span>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl transition"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 break-words">
            {consultation.problemTitle}
          </h3>
          <div className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 break-words">
            {consultation.problemDescription}
          </div>
        </div>

        {consultation.images && consultation.images.length > 0 && (
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-3">
              Uploaded Crop Images ({consultation.images.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {consultation.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Specimen ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Crop enlarged preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Consultation Details Modal */}
      <EditConsultationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        consultation={consultation}
        onSuccess={(updated) => {
          setConsultation(updated);
          loadData();
        }}
      />

      {/* Reschedule Consultation Appointment Modal */}
      <RescheduleConsultationModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        consultation={consultation}
        onSuccess={(updated) => {
          setConsultation(updated);
          loadData();
        }}
      />
    </div>
  );
}
