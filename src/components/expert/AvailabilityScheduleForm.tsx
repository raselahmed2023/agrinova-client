"use client";

import React, { useState } from "react";
import {
  Clock,
  Save,
  Check,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import type {
  ExpertAvailability,
  IAvailabilitySlot,
  WeekDay,
} from "@/types/expert";

interface AvailabilityScheduleFormProps {
  initialData: ExpertAvailability;
  onSave: (data: {
    availabilityStatus: "AVAILABLE" | "UNAVAILABLE";
    availabilitySlots: IAvailabilitySlot[];
  }) => Promise<void> | void;
}

const ALL_WEEKDAYS: { day: WeekDay; label: string }[] = [
  { day: "SATURDAY", label: "Saturday" },
  { day: "SUNDAY", label: "Sunday" },
  { day: "MONDAY", label: "Monday" },
  { day: "TUESDAY", label: "Tuesday" },
  { day: "WEDNESDAY", label: "Wednesday" },
  { day: "THURSDAY", label: "Thursday" },
  { day: "FRIDAY", label: "Friday" },
];

export default function AvailabilityScheduleForm({
  initialData,
  onSave,
}: AvailabilityScheduleFormProps) {
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "AVAILABLE" | "UNAVAILABLE"
  >(initialData.availabilityStatus === "UNAVAILABLE" ? "UNAVAILABLE" : "AVAILABLE");

  // Ensure all 7 days exist in state
  const initialSlots: IAvailabilitySlot[] = ALL_WEEKDAYS.map(({ day }) => {
    const existing = initialData.availabilitySlots?.find((s) => s.day === day);
    if (existing) return { ...existing };
    return {
      day,
      enabled: false,
      startTime: "18:00",
      endTime: "21:00",
    };
  });

  const [slots, setSlots] = useState<IAvailabilitySlot[]>(initialSlots);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleToggleDay = (day: WeekDay) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.day === day
          ? {
              ...s,
              enabled: !s.enabled,
              startTime: s.startTime || "18:00",
              endTime: s.endTime || "21:00",
            }
          : s
      )
    );
  };

  const handleTimeChange = (
    day: WeekDay,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSlots((prev) =>
      prev.map((s) => (s.day === day ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client side validation
    for (const slot of slots) {
      if (slot.enabled) {
        if (!slot.startTime || !slot.endTime) {
          setErrorMessage(`Start time and End time are required for ${slot.day}.`);
          return;
        }
        if (slot.startTime >= slot.endTime) {
          setErrorMessage(
            `Start time (${slot.startTime}) must be earlier than End time (${slot.endTime}) on ${slot.day}.`
          );
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      await onSave({
        availabilityStatus,
        availabilitySlots: slots,
      });
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to format "18:00" to "06:00 PM"
  const format12Hour = (time24?: string) => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    if (isNaN(h)) return time24;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Availability Status Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Master Availability Switch
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              Availability Status
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Toggle whether you are currently active to receive and schedule consultation bookings.
            </p>
          </div>

          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setAvailabilityStatus("AVAILABLE")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                availabilityStatus === "AVAILABLE"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              AVAILABLE
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityStatus("UNAVAILABLE")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                availabilityStatus === "UNAVAILABLE"
                  ? "bg-rose-600 text-white shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <XCircle className="h-4 w-4" />
              UNAVAILABLE
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-500">Current Status:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
              availabilityStatus === "AVAILABLE"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {availabilityStatus}
          </span>
          {availabilityStatus === "UNAVAILABLE" && (
            <span className="text-rose-600 text-[11px]">
              (Farmers will not be able to schedule bookings while unavailable)
            </span>
          )}
        </div>
      </div>

      {/* Weekly Availability Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-lg font-black text-slate-900">
              Weekly Availability
            </h4>
            <p className="text-xs text-slate-500">
              Set recurring available consultation hours for each day of the week (24-hour HH:mm format).
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-rose-800 text-xs font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 divide-y divide-slate-100">
          {ALL_WEEKDAYS.map(({ day, label }) => {
            const slot = slots.find((s) => s.day === day) || {
              day,
              enabled: false,
              startTime: "18:00",
              endTime: "21:00",
            };

            return (
              <div
                key={day}
                className={`pt-3.5 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl transition ${
                  slot.enabled ? "bg-emerald-50/30" : "bg-slate-50/50 opacity-75"
                }`}
              >
                {/* Day & Toggle */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                      slot.enabled
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {slot.enabled ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Enabled
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        Disabled
                      </>
                    )}
                  </button>
                  <span className="text-sm font-bold text-slate-900">
                    {label}
                  </span>
                </div>

                {/* Hours inputs if enabled */}
                {slot.enabled ? (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">Start:</span>
                      <input
                        type="time"
                        value={slot.startTime || "18:00"}
                        onChange={(e) =>
                          handleTimeChange(day, "startTime", e.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 font-mono font-bold text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({format12Hour(slot.startTime || "18:00")})
                      </span>
                    </div>

                    <span className="text-slate-300 font-bold">—</span>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500">End:</span>
                      <input
                        type="time"
                        value={slot.endTime || "21:00"}
                        onChange={(e) =>
                          handleTimeChange(day, "endTime", e.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 font-mono font-bold text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                      />
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({format12Hour(slot.endTime || "21:00")})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-slate-400 italic">
                    Unavailable on this day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur shadow-lg">
        <div>
          {successToast ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-fade-in">
              <Check className="h-4 w-4" />
              Availability saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Click &quot;Save Availability&quot; to apply your weekly schedule.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </form>
  );
}
