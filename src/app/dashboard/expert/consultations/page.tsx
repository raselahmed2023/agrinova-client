"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Video,
  Calendar,
  CheckCircle2,
  Radio,
  Sparkles,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import ConsultationCard from "@/components/expert/ConsultationCard";
import ScheduleConsultationForm from "@/components/expert/ScheduleConsultationForm";
import {
  getConsultations,
  scheduleConsultation,
} from "@/services/consultation.service";
import type {
  Consultation,
  ConsultationStatus,
  ScheduleConsultationPayload,
} from "@/types/consultation";

function ExpertConsultationsContent() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams.get("status") as ConsultationStatus) || "ALL";

  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Scheduling modal state
  const [schedulingConsultation, setSchedulingConsultation] =
    useState<Consultation | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultations({
        status: (activeTab as ConsultationStatus | "ALL"),
        search: search.trim() || undefined,
      });
      setConsultations(data);
    } catch (err) {
      console.error("Failed to load consultations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, search]);

  const handleScheduleSubmit = async (payload: ScheduleConsultationPayload) => {
    await scheduleConsultation(payload);
    await loadData();
  };

  const tabs = [
    { key: "ALL", label: "All Consultations" },
    { key: "SCHEDULED", label: "Scheduled" },
    { key: "ONGOING", label: "Ongoing / Live" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "COMPLETED", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
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
            My Consultations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your booked video appointments, live advisory sessions, and completed prescriptions.
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

      {/* Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search consultation by farmer name, crop, or topic..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 shadow-sm"
          />
        </div>
      </div>

      {/* Consultations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
            />
          ))}
        </div>
      ) : consultations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Consultations Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No consultations match the selected status filter or search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {consultations.map((consultation) => (
            <ConsultationCard
              key={consultation._id || consultation.id}
              consultation={consultation}
              onOpenSchedule={(c) => setSchedulingConsultation(c)}
            />
          ))}
        </div>
      )}

      {/* Scheduling Modal */}
      {schedulingConsultation && (
        <ScheduleConsultationForm
          consultation={schedulingConsultation}
          isOpen={true}
          onClose={() => setSchedulingConsultation(null)}
          onSchedule={handleScheduleSubmit}
        />
      )}
    </div>
  );
}

export default function ExpertConsultationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading consultations...</div>}>
      <ExpertConsultationsContent />
    </Suspense>
  );
}

