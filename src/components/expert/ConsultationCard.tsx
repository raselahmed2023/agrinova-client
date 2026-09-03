import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  User,
  ArrowRight,
  Sparkles,
  FileCheck2,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge from "./ConsultationStatusBadge";

interface ConsultationCardProps {
  consultation: Consultation;
  onStartCall?: (id: string) => void;
  onOpenSchedule?: (consultation: Consultation) => void;
}

export default function ConsultationCard({
  consultation,
  onStartCall,
  onOpenSchedule,
}: ConsultationCardProps) {
  const isOngoing = consultation.status === "ONGOING";
  const isScheduled = consultation.status === "SCHEDULED";
  const isAccepted = consultation.status === "ACCEPTED";
  const isCompleted = consultation.status === "COMPLETED";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        isOngoing
          ? "border-rose-300 ring-1 ring-rose-200/70"
          : "border-slate-200/90 hover:border-emerald-300"
      }`}
    >
      {/* Ongoing Live Banner */}
      {isOngoing && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 animate-pulse" />
      )}

      <div className="flex flex-col justify-between h-full space-y-4">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 overflow-hidden border border-slate-200">
              {consultation.farmer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={consultation.farmer.avatar}
                  alt={consultation.farmer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {consultation.farmer.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Crop: <span className="font-semibold text-emerald-800">{consultation.cropType}</span>
              </p>
            </div>
          </div>

          <ConsultationStatusBadge status={consultation.status} size="sm" />
        </div>

        {/* Problem description info */}
        <div>
          <h5 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-950 transition line-clamp-1">
            {consultation.problemTitle}
          </h5>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {consultation.problemDescription}
          </p>
        </div>

        {/* Schedule / Time pill */}
        {(consultation.scheduledDate || consultation.scheduledTime) && (
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs border border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Calendar className="h-3.5 w-3.5 text-indigo-600" />
              {consultation.scheduledDate}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {consultation.scheduledTime}
            </span>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          {isOngoing && (
            <Link
              href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 animate-pulse"
            >
              <Video className="h-4 w-4" />
              Join Live Consultation
            </Link>
          )}

          {isScheduled && (
            <>
              <button
                type="button"
                onClick={() =>
                  onStartCall
                    ? onStartCall(consultation._id || consultation.id || "")
                    : undefined
                }
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                <Video className="h-3.5 w-3.5" />
                Start Session
              </button>
              <Link
                href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                title="View Room"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {isAccepted && (
            <button
              type="button"
              onClick={() => onOpenSchedule && onOpenSchedule(consultation)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              <Calendar className="h-3.5 w-3.5" />
              Schedule Time
            </button>
          )}

          {isCompleted && (
            <Link
              href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 py-2 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              View Recommendation
            </Link>
          )}

          {!isOngoing && !isScheduled && !isAccepted && !isCompleted && (
            <Link
              href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <span>View Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
