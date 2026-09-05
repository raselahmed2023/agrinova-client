"use client";

import React, { useState, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import { rescheduleConsultation, getConsultations } from "@/services/consultation.service";

interface RescheduleConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation;
  onSuccess: (updated: Consultation) => void;
}

const DEFAULT_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
];

export default function RescheduleConsultationModal({
  isOpen,
  onClose,
  consultation,
  onSuccess,
}: RescheduleConsultationModalProps) {
  // Compute upcoming next 14 days
  const upcomingDays = useMemo(() => {
    const days: { dateStr: string; displayDay: string; displayDate: string }[] =
      [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const displayDay = d.toLocaleDateString("en-US", { weekday: "short" });
      const displayDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      days.push({ dateStr, displayDay, displayDate });
    }
    return days;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(
    consultation.scheduledDate || (upcomingDays[0]?.dateStr ?? "")
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    consultation.scheduledTime || "06:00 PM"
  );
  const [rescheduleNotes, setRescheduleNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [existingConsultations, setExistingConsultations] = useState<Consultation[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      getConsultations()
        .then((list) => setExistingConsultations(list))
        .catch(() => {});
    }
  }, [isOpen]);

  const conflictingSlots = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    const currentId = consultation._id || consultation.id;
    const set = new Set<string>();
    for (const c of existingConsultations) {
      const cId = c._id || c.id;
      if (
        cId !== currentId &&
        ["ACCEPTED", "SCHEDULED", "ONGOING"].includes(c.status) &&
        c.scheduledDate === selectedDate &&
        c.scheduledTime
      ) {
        set.add(c.scheduledTime);
      }
    }
    return set;
  }, [selectedDate, existingConsultations, consultation]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedDate || !selectedTime) {
      setErrorMsg("Please select both a new appointment date and time slot.");
      return;
    }

    if (conflictingSlots.has(selectedTime)) {
      setErrorMsg(
        "The selected time slot conflicts with another consultation you have scheduled. Please choose a different time."
      );
      return;
    }

    const targetId = consultation._id || consultation.id;
    if (!targetId) {
      setErrorMsg("Consultation ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const updated = await rescheduleConsultation(
        targetId,
        selectedDate,
        selectedTime,
        rescheduleNotes.trim() || undefined
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error("Failed to reschedule consultation:", err);
      setErrorMsg(err?.message || "Failed to reschedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl transition-all my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Reschedule Video Consultation
              </h3>
              <p className="text-[11px] text-slate-500">
                Select a new date and time for your specialist meeting
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 shrink-0">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Current Schedule Pill */}
        <div className="px-4 sm:px-6 pt-4 pb-0 shrink-0">
          <div className="rounded-2xl bg-slate-100 p-3.5 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-1">
            <span className="font-medium text-slate-500">Current Schedule:</span>
            <span className="font-bold text-slate-900">
              {consultation.scheduledDate || "None"} at{" "}
              {consultation.scheduledTime || "TBD"}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Pick Date */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>1. Choose New Date</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
              {upcomingDays.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-2 sm:p-2.5 text-xs transition border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-75">
                      {item.displayDay}
                    </span>
                    <span className="text-xs font-black mt-0.5">
                      {item.displayDate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pick Time Slot */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600" />
              <span>2. Choose 30-Minute Schedule Slot</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {DEFAULT_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                const isConflicted = conflictingSlots.has(slot);
                if (isConflicted) {
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={true}
                      className="flex flex-col items-center justify-center rounded-xl p-2 text-xs font-semibold border border-rose-200 bg-rose-50/70 text-rose-500 cursor-not-allowed opacity-75"
                      title="Time Conflict: You already have another consultation scheduled at this time with another specialist."
                    >
                      <span className="line-through text-slate-500">{slot}</span>
                      <span className="text-[9px] font-bold text-rose-600">Time Conflict</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`flex items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition border ${
                      isSelected
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800 font-bold shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rescheduling Notes */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Reason / Notes for Specialist (Optional)
            </label>
            <textarea
              rows={2}
              value={rescheduleNotes}
              onChange={(e) => setRescheduleNotes(e.target.value)}
              placeholder="e.g. Field power outage, need earlier time, urgent progression..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || conflictingSlots.has(selectedTime)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B513D] disabled:opacity-50 transition"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Rescheduling...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Confirm New Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
