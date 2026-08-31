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
  Building2,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge, {
  UrgencyBadge,
} from "./ConsultationStatusBadge";

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
  const farmName =
    request.farmName || request.farmer?.farmName || "Standard Farmland";
  const district =
    request.district ||
    request.farmer?.district ||
    request.farmer?.location ||
    "Bangladesh";
  const requestedDate =
    request.preferredDate ||
    new Date(request.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
      {/* Header */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-800 font-bold overflow-hidden border border-emerald-200">
              {request.farmer?.avatar ? (
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
                {request.farmer?.name}
              </h4>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 font-medium">
                <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{farmName}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <ConsultationStatusBadge status={request.status} size="sm" />
            <UrgencyBadge urgency={request.urgency} />
          </div>
        </div>

        {/* Location & Crop Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
            <MapPin className="h-3 w-3 text-rose-500" />
            {district}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800">
            <Sprout className="h-3 w-3 text-emerald-600" />
            {request.cropType}
          </span>
        </div>

        {/* Problem Title & Crop */}
        <div className="rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100 space-y-1">
          <h5 className="text-sm font-bold text-slate-900 line-clamp-1">
            {request.problemTitle}
          </h5>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {request.problemDescription}
          </p>
        </div>

        {/* Requested Date */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-0.5 pt-0.5">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
            Requested: <strong className="text-slate-800">{requestedDate}</strong>
          </span>
          {request.preferredTime && (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              {request.preferredTime}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center gap-2 pt-3 border-t border-slate-100">
        <Link
          href={`/dashboard/expert/requests/${request._id || request.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Eye className="h-3.5 w-3.5 text-slate-500" />
          View
        </Link>

        {request.status === "PENDING" && (
          <>
            {onReject && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onReject(request._id || request.id || "")}
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100/80 disabled:opacity-50"
                title="Reject Request"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </button>
            )}

            {onAccept && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onAccept(request._id || request.id || "")}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
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
