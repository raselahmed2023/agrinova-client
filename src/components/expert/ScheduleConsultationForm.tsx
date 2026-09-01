"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  X,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type {
  Consultation,
  ScheduleConsultationPayload,
} from "@/types/consultation";
import { getExpertAvailability } from "@/services/expert.service";
import type {
  ExpertAvailability,
  IAvailabilitySlot,
  WeekDay,
} from "@/types/expert";

interface ScheduleConsultationFormProps {
  consultation: Consultation;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (payload: ScheduleConsultationPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

const weekDayMap: WeekDay[] = [
  "SUNDAY",    // 0
  "MONDAY",    // 1
  "TUESDAY",   // 2
  "WEDNESDAY", // 3
  "THURSDAY",  // 4
  "FRIDAY",    // 5
  "SATURDAY",  // 6
];

export default function ScheduleConsultationForm({
  consultation,
  isOpen,
  onClose,
  onSchedule,
  isSubmitting = false,
}: ScheduleConsultationFormProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(
    consultation.preferredDate || defaultDateStr
  );
  const [time, setTime] = useState(
    consultation.scheduledTime || "18:00"
  );
  const [meetingLink, setMeetingLink] = useState(
    consultation.meetingLink ||
      `https://meet.agrinova.io/room/${consultation._id || consultation.id || "live"}`
  );
  const [notes, setNotes] = useState(
    consultation.notes || "Please have your crop sample ready for video inspection."
  );

  const [availability, setAvailability] = useState<ExpertAvailability | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getExpertAvailability()
      .then((data) => setAvailability(data))
      .catch(() => null);
  }, []);

  if (!isOpen) return null;

  // Helper to format "18:00" to "6:00 PM"
  const format12Hour = (time24?: string) => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    if (isNaN(h)) return time24;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  // Determine weekday and availability slot for selected date
  const selectedDateObj = new Date(date);
  const selectedWeekDay = !isNaN(selectedDateObj.getTime())
    ? weekDayMap[selectedDateObj.getDay()]
    : null;

  const currentSlot: IAvailabilitySlot | undefined =
    selectedWeekDay && availability?.availabilitySlots
      ? availability.availabilitySlots.find((s) => s.day === selectedWeekDay)
      : undefined;

  const isDayEnabled = Boolean(currentSlot?.enabled);
  const availableWindowText =
    currentSlot?.enabled && currentSlot.startTime && currentSlot.endTime
      ? `${format12Hour(currentSlot.startTime)} - ${format12Hour(currentSlot.endTime)}`
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Format ISO string
    let scheduledAtIso: string;
    try {
      const scheduledDateTime = new Date(`${date}T${time}:00`);
      if (isNaN(scheduledDateTime.getTime())) {
        throw new Error("Invalid date or time");
      }
      scheduledAtIso = scheduledDateTime.toISOString();
    } catch {
      setErrorMessage("Please select a valid date and time.");
      return;
    }

    try {
      await onSchedule({
        consultationId: consultation._id || consultation.id || "",
        scheduledAt: scheduledAtIso,
        scheduledDate: date,
        scheduledTime: time,
        meetingLink,
        notes,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "Failed to schedule consultation. Please check for time overlap."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Session Scheduling
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Schedule Consultation
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
        <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950">
              Farmer: {consultation.farmer?.name}
            </span>
            {consultation.preferredDate && (
              <span className="text-emerald-800">
                Pref: {consultation.preferredDate}
              </span>
            )}
          </div>
          <p className="text-emerald-800">
            Crop: <strong>{consultation.cropType}</strong> · {consultation.problemTitle}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date:
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm font-medium"
              />
            </div>
          </div>

          {/* Availability Info Banner */}
          <div
            className={`rounded-2xl p-3.5 border text-xs font-medium ${
              isDayEnabled
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <div>
                <span className="font-bold">
                  {selectedWeekDay ? selectedWeekDay.charAt(0) + selectedWeekDay.slice(1).toLowerCase() : "Selected Day"}:
                </span>{" "}
                {isDayEnabled ? (
                  <span>
                    Available on selected day:{" "}
                    <strong>{availableWindowText}</strong>
                  </span>
                ) : (
                  <span className="text-rose-700 font-semibold">
                    Unavailable on this day according to your recurring schedule.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Time: (30-min duration)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-3 px-4 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm"
              />
              <div className="shrink-0 px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap">
                {format12Hour(time)}
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Video Room Link
            </label>
            <input
              type="text"
              required
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Instructions for Farmer
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Please have clear lighting and infected crop samples nearby."
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
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
              {isSubmitting ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
