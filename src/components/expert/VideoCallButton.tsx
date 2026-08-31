"use client";

import React, { useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Users,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";

interface VideoCallButtonProps {
  consultation: Consultation;
  onCallEnded?: () => void;
  className?: string;
}

export default function VideoCallButton({
  consultation,
  onCallEnded,
  className = "",
}: VideoCallButtonProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // simulated seconds

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    setIsInCall(false);
    if (onCallEnded) onCallEnded();
  };

  const isOngoing = consultation.status === "ONGOING";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsInCall(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 px-4 text-xs font-bold text-white shadow-sm transition ${
          isOngoing
            ? "bg-rose-600 hover:bg-rose-700 animate-pulse"
            : "bg-emerald-600 hover:bg-emerald-700"
        } ${className}`}
      >
        <Video className="h-4 w-4" />
        <span>{isOngoing ? "Join Active Call" : "Launch Video Room"}</span>
      </button>

      {/* Interactive Video Call Room Simulator */}
      {isInCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 sm:p-6 backdrop-blur-md">
          <div className="flex h-full max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            {/* Call Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Consultation with {consultation.farmer.name}</span>
                    <span className="text-xs font-mono text-slate-400">({formatSeconds(callDuration)})</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Crop: {consultation.cropType} · {consultation.problemTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Encrypted HD Call
                </span>
              </div>
            </div>

            {/* Main Stage Video Feeds */}
            <div className="relative flex-1 bg-slate-950 p-4 flex flex-col md:flex-row gap-4 items-center justify-center overflow-hidden">
              {/* Farmer Feed (Main) */}
              <div className="relative h-full w-full flex-1 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                {/* Simulated Farmer Feed Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=1200&auto=format&fit=crop&q=80"
                  alt="Farmer video feed showing crop field"
                  className="h-full w-full object-cover opacity-90"
                />

                {/* Farmer Overlay Info */}
                <div className="absolute bottom-4 left-4 rounded-xl bg-slate-950/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white border border-slate-800">
                  🌾 {consultation.farmer.name} (Live Video)
                </div>

                <div className="absolute top-4 right-4 rounded-xl bg-slate-950/70 backdrop-blur px-3 py-1 text-[11px] font-mono text-emerald-400 border border-slate-800">
                  HD · 1080p
                </div>
              </div>

              {/* Expert Self View (Picture-in-picture) */}
              <div className="absolute top-8 right-8 w-44 sm:w-56 aspect-video rounded-2xl overflow-hidden bg-slate-800 border-2 border-emerald-500 shadow-2xl">
                {isCamOn ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                    alt="Expert self view"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
                    Camera Off
                  </div>
                )}
                <div className="absolute bottom-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white">
                  You (Expert)
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                    isMicOn
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCamOn(!isCamOn)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                    isCamOn
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  }`}
                  title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isCamOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
              </div>

              {/* End Call Button */}
              <button
                type="button"
                onClick={handleEndCall}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-rose-700 transition"
              >
                <PhoneOff className="h-4 w-4" />
                End Consultation Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
