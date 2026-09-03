import React from "react";
import type { ConsultationStatus, ConsultationUrgency } from "@/types/consultation";

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export default function ConsultationStatusBadge({
  status,
  size = "md",
  showDot = true,
}: ConsultationStatusBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const getStatusConfig = () => {
    switch (status) {
      case "PENDING":
        return {
          label: "PENDING",
          bg: "bg-amber-50 text-amber-800 border-amber-200/80",
          dot: "bg-amber-500",
        };
      case "ACCEPTED":
        return {
          label: "ACCEPTED",
          bg: "bg-sky-50 text-sky-800 border-sky-200/80",
          dot: "bg-sky-500",
        };
      case "SCHEDULED":
        return {
          label: "SCHEDULED",
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
          dot: "bg-indigo-500",
        };
      case "ONGOING":
        return {
          label: "ONGOING",
          bg: "bg-rose-50 text-rose-800 border-rose-200/80 animate-pulse",
          dot: "bg-rose-500 ring-4 ring-rose-100",
        };
      case "COMPLETED":
        return {
          label: "COMPLETED",
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
          dot: "bg-emerald-500",
        };
      case "CANCELLED":
        return {
          label: "CANCELLED",
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
      case "REJECTED":
        return {
          label: "REJECTED",
          bg: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        };
      default:
        return {
          label: status,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold tracking-wide border rounded-full ${config.bg} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`}
        />
      )}
      {config.label}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency?: ConsultationUrgency }) {
  if (!urgency) return null;

  const config = {
    LOW: { label: "Low Priority", cls: "bg-slate-100 text-slate-600 border-slate-200" },
    MEDIUM: { label: "Medium", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    HIGH: { label: "High Priority", cls: "bg-orange-50 text-orange-700 border-orange-200" },
    EMERGENCY: { label: "EMERGENCY", cls: "bg-red-50 text-red-700 border-red-300 font-bold" },
  }[urgency];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] rounded-md border ${config.cls}`}>
      {config.label}
    </span>
  );
}
