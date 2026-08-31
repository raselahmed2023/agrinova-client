"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  X,
  Sparkles,
  Check,
} from "lucide-react";
import type { Consultation, ScheduleConsultationPayload } from "@/types/consultation";

interface ScheduleConsultationFormProps {
  consultation: Consultation;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (payload: ScheduleConsultationPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function ScheduleConsultationForm({
  consultation,
  isOpen,
  onClose,
  onSchedule,
  isSubmitting = false,
}: ScheduleConsultationFormProps) {
  const [date, setDate] = useState(
    consultation.scheduledDate ||
      consultation.preferredDate ||
      new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState(
    consultation.scheduledTime || consultation.preferredTime || "10:30 AM"
  );
  const [meetingLink, setMeetingLink] = useState(
    consultation.meetingLink || `https://meet.agrinova.io/room/${consultation._id || consultation.id || "live"}`
  );
  const [notes, setNotes] = useState(
    consultation.notes || "Please have your crop sample ready on video for inspection."
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSchedule({
      consultationId: consultation._id || consultation.id || "",
      scheduledDate: date,
      scheduledTime: time,
      meetingLink,
      notes,
    });
    onClose();
  };

  const quickTimes = ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM", "07:30 PM"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Session Planner
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Schedule Video Consultation
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Farmer Info Snapshot */}
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100 text-xs">
          <div>
            <p className="font-bold text-emerald-950">
              Farmer: {consultation.farmer.name}
            </p>
            <p className="text-emerald-800">
              Crop: {consultation.cropType} · {consultation.problemTitle}
            </p>
          </div>
          {consultation.preferredDate && (
            <div className="text-right text-emerald-800">
              <span className="font-semibold">Preferred:</span> {consultation.preferredDate}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Consultation Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Time Picker & Quick Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Scheduled Time Slot
            </label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 10:30 AM or 07:30 PM"
              className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {quickTimes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    time === t
                      ? "bg-emerald-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting Room Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Video Room URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="flex-1 rounded-2xl border border-slate-200 py-3 px-4 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={() =>
                  setMeetingLink(
                    `https://meet.agrinova.io/room/room-${Math.floor(1000 + Math.random() * 9000)}`
                  )
                }
                className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Instructions for Farmer
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Please ensure good lighting and keep infected crop leaf ready."
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Confirm & Notify Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
