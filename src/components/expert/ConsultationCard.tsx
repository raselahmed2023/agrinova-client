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
  Trash2,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge from "./ConsultationStatusBadge";
import { getConsultationOngoingInfo } from "@/utils/consultationTiming";

interface ConsultationCardProps {
  consultation: Consultation;
  onStartCall?: (id: string) => void;
  onOpenSchedule?: (consultation: Consultation) => void;
  onDelete?: (id: string) => void;
  now?: number;
}

export default function ConsultationCard({
  consultation,
  onStartCall,
  onOpenSchedule,
  onDelete,
  now,
}: ConsultationCardProps) {
  const timing = getConsultationOngoingInfo(consultation, now);
  const isOngoing = timing.isOngoing;
  const isMissed = timing.isMissedOrIncomplete;
  const isScheduled = consultation.status === "SCHEDULED" && !isOngoing && !isMissed;
  const isAccepted = consultation.status === "ACCEPTED";
  const isCompleted = consultation.status === "COMPLETED";

  const effectiveStatus = isOngoing
    ? "ONGOING"
    : isMissed
    ? "MISSED"
    : consultation.status;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        isOngoing
          ? "border-rose-300 ring-2 ring-rose-200/80 shadow-rose-100/50"
          : isMissed
          ? "border-amber-200 bg-amber-50/20"
          : "border-slate-200/90 hover:border-emerald-300"
      }`}
    >
      {/* Ongoing Live Banner */}
      {isOngoing && (
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 animate-pulse" />
      )}

      <div className="flex flex-col justify-between h-full space-y-4">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700 overflow-hidden border border-slate-200">
              {consultation.farmer?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={consultation.farmer.avatar}
                  alt={consultation.farmer?.name || consultation.farmerName || "Farmer"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {consultation.farmer?.name || consultation.farmerName || "Farmer"}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Crop: <span className="font-semibold text-emerald-800">{consultation.cropType}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <ConsultationStatusBadge status={effectiveStatus} size="sm" />
            {isOngoing && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-ping" />
                {timing.formattedRemaining} left
              </span>
            )}
            {isMissed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Session Incomplete
              </span>
            )}
          </div>
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
            <>
              {onStartCall ? (
                <button
                  type="button"
                  onClick={() => onStartCall(consultation._id || consultation.id || "")}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 animate-pulse"
                >
                  <Video className="h-4 w-4" />
                  Join Live Session ({timing.formattedRemaining})
                </button>
              ) : (
                <Link
                  href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 animate-pulse"
                >
                  <Video className="h-4 w-4" />
                  Join Live Session ({timing.formattedRemaining})
                </Link>
              )}
              <Link
                href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                title="View Room & Prescription"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
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
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(consultation._id || consultation.id || "")}
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                  title="Delete upcoming consultation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {isAccepted && (
            <>
              <button
                type="button"
                onClick={() => onOpenSchedule && onOpenSchedule(consultation)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule Time
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(consultation._id || consultation.id || "")}
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                  title="Delete upcoming consultation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
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

          {isMissed && (
            <>
              <Link
                href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/70 py-2 px-3 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                <span>View Incomplete Session</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(consultation._id || consultation.id || "")}
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                  title="Remove consultation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {!isOngoing && !isScheduled && !isAccepted && !isCompleted && !isMissed && (
            <>
              <Link
                href={`/dashboard/expert/consultations/${consultation._id || consultation.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(consultation._id || consultation.id || "")}
                  className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 p-2 text-rose-600 transition hover:bg-rose-100 hover:text-rose-800"
                  title="Delete upcoming consultation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
