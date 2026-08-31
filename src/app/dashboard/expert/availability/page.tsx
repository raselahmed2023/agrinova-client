"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import AvailabilityScheduleForm from "@/components/expert/AvailabilityScheduleForm";
import {
  getExpertAvailability,
  updateExpertAvailability,
} from "@/services/expert.service";
import type { ExpertAvailability } from "@/types/expert";

export default function ExpertAvailabilityPage() {
  const [availability, setAvailability] = useState<ExpertAvailability | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getExpertAvailability();
      setAvailability(data);
    } catch (err) {
      console.error("Failed to load expert availability:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data: ExpertAvailability) => {
    const res = await updateExpertAvailability(data);
    setAvailability(res);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/expert"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Overview
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Weekly Availability Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your active days and daily time slots when farmers can book live video consultations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
      ) : availability ? (
        <AvailabilityScheduleForm
          initialData={availability}
          onSave={handleSave}
        />
      ) : (
        <div className="p-8 text-center text-slate-500">
          Failed to load availability settings.
        </div>
      )}
    </div>
  );
}
