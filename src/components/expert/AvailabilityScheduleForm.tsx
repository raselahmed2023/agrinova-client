"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Clock,
  Globe,
  Save,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import type { ExpertAvailability, DayAvailability } from "@/types/expert";
import AvailabilityDayRow from "./AvailabilityDayRow";

interface AvailabilityScheduleFormProps {
  initialData: ExpertAvailability;
  onSave: (data: ExpertAvailability) => Promise<void> | void;
}

export default function AvailabilityScheduleForm({
  initialData,
  onSave,
}: AvailabilityScheduleFormProps) {
  const [formData, setFormData] = useState<ExpertAvailability>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleToggleAccepting = () => {
    setFormData((prev) => ({
      ...prev,
      isAcceptingConsultations: !prev.isAcceptingConsultations,
    }));
  };

  const handleDayChange = (updatedDay: DayAvailability) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.map((d) =>
        d.day === updatedDay.day ? updatedDay : d
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner Card: Master toggle */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Master Availability Switch
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Accepting New Consultations
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              When toggled off, farmers will see you as temporarily away or fully booked, and no new requests will arrive.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.isAcceptingConsultations}
              onChange={handleToggleAccepting}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Timezone & Slot duration settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-400" />
                Timezone
              </span>
            </label>
            <select
              value={formData.timezone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, timezone: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Asia/Dhaka (GMT+6)">Asia/Dhaka (GMT+6 - Bangladesh Standard Time)</option>
              <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30 - IST)</option>
              <option value="UTC (GMT+0)">UTC (GMT+0)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Default Session Duration
              </span>
            </label>
            <select
              value={formData.slotDurationMinutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slotDurationMinutes: Number(e.target.value),
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value={20}>20 Minutes per consultation</option>
              <option value={30}>30 Minutes per consultation</option>
              <option value={45}>45 Minutes per consultation</option>
              <option value={60}>60 Minutes per consultation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Weekly Consultation Hours
            </h4>
            <p className="text-xs text-slate-500">
              Configure daily availability windows when farmers can book live video meetings.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {formData.weeklySchedule.map((day) => (
            <AvailabilityDayRow
              key={day.day}
              dayData={day}
              onChange={handleDayChange}
            />
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur shadow-lg">
        <div>
          {showSavedToast ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <Check className="h-4 w-4" />
              Availability preferences saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Remember to save changes after updating hours.
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
