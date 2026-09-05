"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  PhoneOff,
  ExternalLink,
  Clock,
  Copy,
  Check,
  Lock,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";

const EARLY_JOIN_MINUTES = 15;
const CONSULTATION_DURATION_MINUTES = 30;
const LATE_JOIN_GRACE_MINUTES = 30;

export interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation;
  userName?: string;
  isFarmer?: boolean;
}

export function VideoCallModal({
  isOpen,
  onClose,
  consultation,
  userName = "AgriNova User",
  isFarmer = false,
}: VideoCallModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cleanId = consultation._id || consultation.id || "live";
  const videoRoomId =
    consultation.videoRoomId || `agrinova-consultation-${cleanId}`;
  const directLink = `https://meet.jit.si/${videoRoomId}`;
  const meetingUrl = `https://meet.jit.si/${videoRoomId}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(
    userName
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md">
      <div className="flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 py-3 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-3 w-3 shrink-0 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">
                  {isFarmer
                    ? `Live Consultation with ${
                        consultation.expert?.name ||
                        consultation.expertName ||
                        "Specialist"
                      }`
                    : `Live Consultation with ${
                        consultation.farmer?.name ||
                        consultation.farmerName ||
                        "Farmer"
                      }`}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                  (Jitsi Meet)
                </span>
              </h4>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                Crop: {consultation.cropType} · {consultation.problemTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition"
              title="Copy meeting link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>

            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Tab
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow transition"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              Exit Call
            </button>
          </div>
        </div>

        {/* Jitsi Meet Embedded IFrame */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden">
          <iframe
            src={meetingUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-full w-full border-0"
            title="AgriNova Jitsi Consultation"
          />
        </div>
      </div>
    </div>
  );
}

interface VideoCallButtonProps {
  consultation: Consultation;
  onCallEnded?: () => void;
  className?: string;
  userName?: string;
  isFarmer?: boolean;
  isActive?: boolean;
}

export default function VideoCallButton({
  consultation,
  onCallEnded,
  className = "",
  userName = "AgriNova User",
  isFarmer = false,
  isActive,
}: VideoCallButtonProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  // 1-second interval to update time diff
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOngoing = consultation.status === "ONGOING";
  const isScheduled = consultation.status === "SCHEDULED";

  // Parse exact date & time
  let scheduledTime: number | null = null;
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
        scheduledTime = new Date(parts[0], parts[1] - 1, parts[2], hours, minutes, 0).getTime();
      }
    }
  }

  if (!scheduledTime && consultation.scheduledAt) {
    const d = new Date(consultation.scheduledAt);
    if (!isNaN(d.getTime())) scheduledTime = d.getTime();
  }

  let isTimerStopped = true;
  let windowMessage = "";

  if (isScheduled && scheduledTime) {
    const diff = scheduledTime - now;

    if (diff > 0 && !isOngoing) {
      isTimerStopped = false;
      const diffMins = Math.ceil(diff / (60 * 1000));
      if (diffMins < 60) {
        windowMessage = `Unlocks in ${diffMins} min`;
      } else {
        const diffHours = Math.floor(diffMins / 60);
        windowMessage = `Unlocks in ${diffHours}h ${diffMins % 60}m`;
      }
    } else {
      isTimerStopped = true;
      windowMessage = "Room active and ready";
    }
  }

  // If parent specified isActive, respect it; otherwise active when ongoing or timer has reached 0
  const effectiveIsActive = isActive !== undefined ? isActive : (isOngoing || isTimerStopped);

  const handleEndCall = () => {
    setIsInCall(false);
    if (onCallEnded) onCallEnded();
  };

  return (
    <>
      <div className="inline-flex flex-col items-stretch sm:items-end w-full sm:w-auto">
        <button
          type="button"
          disabled={!effectiveIsActive}
          onClick={() => {
            if (effectiveIsActive) setIsInCall(true);
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-bold transition shadow-sm ${
            !effectiveIsActive
              ? "bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed opacity-75"
              : isOngoing
              ? "bg-rose-600 hover:bg-rose-700 animate-pulse text-white cursor-pointer active:scale-95"
              : "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
          } ${className}`}
        >
          {!effectiveIsActive ? (
            <Lock className="h-4 w-4 text-slate-400" />
          ) : (
            <Video className="h-4 w-4" />
          )}
          <span>
            {!effectiveIsActive
              ? "Join Video (Locked until start)"
              : isOngoing
              ? "Join Video Call (Live)"
              : "Join Video Call"}
          </span>
        </button>

        {!effectiveIsActive ? (
          <span className="text-[10px] text-amber-400/90 mt-1 flex items-center justify-center sm:justify-end gap-1 font-medium">
            <Clock className="h-3 w-3 text-amber-400" />
            {windowMessage || "Unlocks when timer ends"}
          </span>
        ) : (
          windowMessage && (
            <span className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center sm:justify-end gap-1 font-medium">
              <Clock className="h-3 w-3 text-emerald-400" />
              {windowMessage}
            </span>
          )
        )}
      </div>

      <VideoCallModal
        isOpen={isInCall}
        onClose={handleEndCall}
        consultation={consultation}
        userName={userName}
        isFarmer={isFarmer}
      />
    </>
  );
}
