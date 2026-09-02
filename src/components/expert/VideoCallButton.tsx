"use client";

import React, { useState } from "react";
import {
  Video,
  PhoneOff,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  X,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";

const EARLY_JOIN_MINUTES = 15;
const CONSULTATION_DURATION_MINUTES = 30;
const LATE_JOIN_GRACE_MINUTES = 30;

interface VideoCallButtonProps {
  consultation: Consultation;
  onCallEnded?: () => void;
  className?: string;
  userName?: string;
  isFarmer?: boolean;
}

export default function VideoCallButton({
  consultation,
  onCallEnded,
  className = "",
  userName = "AgriNova User",
  isFarmer = false,
}: VideoCallButtonProps) {
  const [isInCall, setIsInCall] = useState(false);

  const cleanId = consultation._id || consultation.id || "live";
  const videoRoomId =
    consultation.videoRoomId || `agrinova-consultation-${cleanId}`;
  const meetingUrl = `https://meet.jit.si/${videoRoomId}#config.prejoinPageEnabled=false&userInfo.displayName=${encodeURIComponent(
    userName
  )}`;

  const isOngoing = consultation.status === "ONGOING";

  // Check start window if scheduled
  const isScheduled = consultation.status === "SCHEDULED";
  let isWindowOpen = isOngoing;
  let windowMessage = "";

  if (isScheduled && consultation.scheduledAt) {
    const scheduledTime = new Date(consultation.scheduledAt).getTime();
    const now = Date.now();
    const earliestStart = scheduledTime - EARLY_JOIN_MINUTES * 60 * 1000;
    const latestStart =
      scheduledTime +
      (CONSULTATION_DURATION_MINUTES + LATE_JOIN_GRACE_MINUTES) * 60 * 1000;

    if (now < earliestStart) {
      isWindowOpen = false;
      const diffMins = Math.ceil((earliestStart - now) / (60 * 1000));
      windowMessage = `Available in ${diffMins} min (15 min before scheduled time)`;
    } else if (now > latestStart) {
      isWindowOpen = false;
      windowMessage = "Call window has expired";
    } else {
      isWindowOpen = true;
    }
  }

  const handleEndCall = () => {
    setIsInCall(false);
    if (onCallEnded) onCallEnded();
  };

  return (
    <>
      <div className="inline-flex flex-col items-end">
        <button
          type="button"
          disabled={!isWindowOpen && !isOngoing}
          onClick={() => setIsInCall(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
            isOngoing
              ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-700"
          } ${className}`}
        >
          <Video className="h-4 w-4" />
          <span>{isOngoing ? "Join Video Call" : "Start Video Call"}</span>
        </button>

        {windowMessage && (
          <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3 text-amber-500" />
            {windowMessage}
          </span>
        )}
      </div>

      {/* Jitsi Meet Live Video Room Modal */}
      {isInCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-4 backdrop-blur-md">
          <div className="flex h-full max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>
                      {isFarmer
                        ? `Live Consultation with ${consultation.expert?.name || consultation.expertName || "Specialist"}`
                        : `Live Consultation with ${consultation.farmer?.name || consultation.farmerName || "Farmer"}`}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      (Jitsi Meet)
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Room: <span className="font-mono">{videoRoomId}</span> · Crop: {consultation.cropType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://meet.jit.si/${videoRoomId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in New Tab
                </a>

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 shadow transition"
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
      )}
    </>
  );
}
