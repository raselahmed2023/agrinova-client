import React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Check,
  X,
  Eye,
  Sprout,
  User,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge, { UrgencyBadge } from "./ConsultationStatusBadge";

interface ConsultationRequestCardProps {
  request: Consultation;
  onAccept?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => Promise<void> | void;
  isProcessing?: boolean;
}

export default function ConsultationRequestCard({
  request,
  onAccept,
  onReject,
  isProcessing = false,
}: ConsultationRequestCardProps) {
  const formattedDate = new Date(request.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100/70 text-emerald-800 font-bold overflow-hidden border border-emerald-200">
              {request.farmer.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={request.farmer.avatar}
                  alt={request.farmer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {request.farmer.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                {request.farmer.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {request.farmer.location}
                  </span>
                )}
                {request.farmer.farmSize && (
                  <span className="text-slate-400">· {request.farmer.farmSize}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <ConsultationStatusBadge status={request.status} size="sm" />
            <UrgencyBadge urgency={request.urgency} />
          </div>
        </div>

        {/* Problem Title & Crop */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
            <Sprout className="h-3.5 w-3.5" />
            <span>Crop: {request.cropType}</span>
          </div>
          <h5 className="text-sm font-semibold text-slate-800 line-clamp-1">
            {request.problemTitle}
          </h5>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {request.problemDescription}
          </p>
        </div>

        {/* Preferred Time / Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-0.5">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Received: {formattedDate}
          </span>
          {request.preferredDate && (
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Pref: {request.preferredDate}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100">
        <Link
          href={`/dashboard/expert/requests/${request._id || request.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Eye className="h-3.5 w-3.5" />
          View Details
        </Link>

        {request.status === "PENDING" && (
          <>
            {onReject && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onReject(request._id || request.id || "")}
                className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 p-2 text-rose-700 transition hover:bg-rose-100/80 disabled:opacity-50"
                title="Reject Request"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {onAccept && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onAccept(request._id || request.id || "")}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                Accept
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
