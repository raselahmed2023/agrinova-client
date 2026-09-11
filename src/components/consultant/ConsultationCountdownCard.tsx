"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  ExternalLink,
  Edit3,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import VideoCallButton from "@/components/expert/VideoCallButton";

interface ConsultationCountdownCardProps {
  consultation: Consultation;
  onEditDetails?: () => void;
  onReschedule?: () => void;
  onRefresh?: () => void;
}

import {
  getConsultationOngoingInfo,
  CONSULTATION_DURATION_MINUTES,
} from "@/utils/consultationTiming";

export function parseScheduledDate(consultation: Consultation): Date | null {
  // If scheduledDate (YYYY-MM-DD) and scheduledTime (e.g. "06:00 PM") exist
  if (consultation.scheduledDate && consultation.scheduledTime) {
    const match = consultation.scheduledTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const parts = consultation.scheduledDate.split("-").map(Number);
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0);
      }
      const d = new Date(consultation.scheduledDate);
      if (!isNaN(d.getTime())) {
        d.setHours(hours, minutes, 0, 0);
        return d;
      }
    }
  }

  // Fallback to scheduledAt
  if (consultation.scheduledAt) {
    const d = new Date(consultation.scheduledAt);
    if (!isNaN(d.getTime())) return d;
  }

  // Fallback to preferredDate and preferredTime
  if (consultation.preferredDate && consultation.preferredTime) {
    const match = consultation.preferredTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const meridiem = match[3]?.toUpperCase();
      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const parts = consultation.preferredDate.split("-").map(Number);
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0);
      }
      const d = new Date(consultation.preferredDate);
      if (!isNaN(d.getTime())) {
        d.setHours(hours, minutes, 0, 0);
        return d;
      }
    }
  }

  return null;
}

export default function ConsultationCountdownCard({
  consultation,
  onEditDetails,
  onReschedule,
  onRefresh,
}: ConsultationCountdownCardProps) {
  const [now, setNow] = useState<number>(Date.now());

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timing = getConsultationOngoingInfo(consultation, now);
  const scheduledDateTime = parseScheduledDate(consultation);

  const cleanId = consultation._id || consultation.id || "live";
  const videoRoomId =
    consultation.videoRoomId || `agrinova-consultation-${cleanId}`;
  const meetingLink =
    consultation.meetingLink || `https://meet.jit.si/${videoRoomId}`;

  // Compute countdown calculations and active status
  let countdownDisplay = "";
  let statusBadgeType: "UPCOMING" | "LIVE" | "PAST" | "COMPLETED" = "UPCOMING";
  let isCallActive = false;

  if (consultation.status === "COMPLETED") {
    statusBadgeType = "COMPLETED";
    countdownDisplay = "Session Completed";
    isCallActive = false;
  } else if (timing.isOngoing) {
    statusBadgeType = "LIVE";
    countdownDisplay = `Live Session Open · ${timing.formattedRemaining} remaining`;
    isCallActive = true;
  } else if (timing.isMissedOrIncomplete) {
    statusBadgeType = "PAST";
    countdownDisplay = "Session Window Ended · Not Completed";
    isCallActive = false;
  } else if (scheduledDateTime) {
    const diff = scheduledDateTime.getTime() - now;

    if (diff > 0) {
      statusBadgeType = "UPCOMING";
      isCallActive = false;
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        countdownDisplay = `${days}d ${String(hours).padStart(2, "0")}h ${String(
          minutes
        ).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
      } else {
        countdownDisplay = `${String(hours).padStart(2, "0")}h ${String(
          minutes
        ).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
      }
    } else {
      statusBadgeType = "PAST";
      countdownDisplay = "Scheduled Window Passed";
      isCallActive = false;
    }
  } else {
    countdownDisplay = "Awaiting Schedule";
    isCallActive = false;
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-[#063B2B] to-[#042A1F] p-4 sm:p-6 lg:p-8 text-white shadow-xl shadow-emerald-950/20 space-y-6">
      {/* Top Bar: Live countdown ticker & actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-emerald-800/60 pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                statusBadgeType === "LIVE"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  : statusBadgeType === "UPCOMING"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : statusBadgeType === "COMPLETED"
                  ? "bg-slate-500/20 text-slate-300 border border-slate-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              {statusBadgeType === "LIVE" && (
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
              )}
              {statusBadgeType === "UPCOMING" && (
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
              )}
              <span>
                {statusBadgeType === "LIVE"
                  ? "Session Active Now"
                  : statusBadgeType === "UPCOMING"
                  ? "Countdown to Call"
                  : statusBadgeType === "COMPLETED"
                  ? "Consultation Completed"
                  : "Scheduled Window Passed"}
              </span>
            </span>
          </div>

          {/* Large Countdown Digits */}
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight text-white break-all sm:break-normal">
              {countdownDisplay}
            </h3>
          </div>

          <p className="text-xs text-emerald-200/80 mt-1.5 flex flex-wrap items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>
              Scheduled for:{" "}
              <strong className="text-white">
                {consultation.scheduledDate || "Date TBD"}
              </strong>{" "}
              at{" "}
              <strong className="text-emerald-300">
                {consultation.scheduledTime || "Time TBD"} (BST)
              </strong>
            </span>
          </p>
        </div>

        {/* Video Call Entry Actions (Only shown when call is active) */}
        {isCallActive && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <VideoCallButton
              consultation={consultation}
              isFarmer={true}
              userName={consultation.farmer?.name || "Farmer"}
              className="w-full sm:w-auto"
              isActive={isCallActive}
            />

            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-800/70 border border-emerald-600/50 px-4 py-2.5 text-xs font-bold text-emerald-100 hover:bg-emerald-700/80 transition w-full sm:w-auto"
              title="Open Jitsi room directly in new browser tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-emerald-300" />
              <span>External Window</span>
            </a>
          </div>
        )}
      </div>

      {/* Quick Farmer Actions Bar or Completed Notification */}
      {consultation.status === "COMPLETED" ? (
        <div className="pt-2 flex items-center gap-2 border-t border-emerald-800/60 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Consultation finished · Official diagnostic advice and prescription issued below.</span>
        </div>
      ) : timing.isMissedOrIncomplete ? (
        <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-emerald-800/60 text-xs bg-rose-950/40 p-4 rounded-2xl border border-rose-500/30">
          <div className="text-rose-200 text-xs">
            <span className="font-bold text-rose-100 block flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              Specialist did not mark complete / missed this consultation session.
            </span>
            <span className="text-rose-300/80 text-[11px] mt-0.5 block">
              The 30-minute consultation window has elapsed. You can reschedule to a new available date and time slot.
            </span>
          </div>

          {onReschedule && (
            <button
              type="button"
              onClick={onReschedule}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2.5 text-xs font-bold text-slate-950 transition shadow-md flex-1 sm:flex-none"
            >
              <CalendarDays className="h-4 w-4 text-slate-950" />
              <span>Reschedule Slot Now</span>
            </button>
          )}
        </div>
      ) : onEditDetails || onReschedule ? (
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-emerald-800/60 text-xs">
          <div className="text-emerald-200/90 text-xs">
            Need to change your problem details or schedule?
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onEditDetails && (
              <button
                type="button"
                onClick={onEditDetails}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-bold text-white border border-white/20 transition shadow-sm flex-1 sm:flex-none"
              >
                <Edit3 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Edit Details</span>
              </button>
            )}

            {onReschedule && (
              <button
                type="button"
                onClick={onReschedule}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition shadow-sm flex-1 sm:flex-none"
              >
                <CalendarDays className="h-3.5 w-3.5 text-slate-950" />
                <span>Reschedule Date/Time</span>
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
