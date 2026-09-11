"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Video,
  Calendar,
  CheckCircle2,
  Radio,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Trash2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import ConsultationCard from "@/components/expert/ConsultationCard";
import ScheduleConsultationForm from "@/components/expert/ScheduleConsultationForm";
import { VideoCallModal } from "@/components/expert/VideoCallButton";
import {
  getConsultations,
  scheduleConsultation,
  deleteConsultation,
  startVideoConsultation,
  updateConsultationStatus,
} from "@/services/consultation.service";
import type {
  Consultation,
  ConsultationStatus,
  ScheduleConsultationPayload,
} from "@/types/consultation";
import { getConsultationOngoingInfo } from "@/utils/consultationTiming";

function ExpertConsultationsContent() {
  const searchParams = useSearchParams();
  const rawStatus = (searchParams.get("status") as ConsultationStatus) || "ALL";
  const initialStatus =
    rawStatus === "ACCEPTED" || rawStatus === "PENDING" ? "ALL" : rawStatus;

  const [activeTab, setActiveTab] = useState<string>(initialStatus);
  const [allConsultations, setAllConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState<number>(Date.now());

  // Call modal & active call state
  const [activeCallConsultation, setActiveCallConsultation] =
    useState<Consultation | null>(null);

  // Scheduling & Deleting modal state
  const [schedulingConsultation, setSchedulingConsultation] =
    useState<Consultation | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // 1-second live heartbeat for accurate 30-min ongoing timers
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultations({
        status: "ALL",
        search: search.trim() || undefined,
        isExpert: true,
      });
      setAllConsultations(data);
    } catch (err) {
      console.error("Failed to load consultations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  // Handle starting call from consultation card or banner
  const handleStartCall = async (consultationId: string) => {
    try {
      const target = allConsultations.find(
        (c) => c._id === consultationId || c.id === consultationId
      );
      if (!target) return;

      if (target.status === "SCHEDULED") {
        await startVideoConsultation(consultationId);
      }
      setActiveCallConsultation({
        ...target,
        status: "ONGOING",
        startedAt: target.startedAt || new Date().toISOString(),
      });
      await loadData();
    } catch (err: any) {
      console.error("Failed to start video call:", err);
      alert(err?.message || "Failed to start call");
    }
  };

  const handleMarkComplete = async (consultationId: string) => {
    try {
      await updateConsultationStatus(consultationId, "COMPLETED");
      await loadData();
    } catch (err: any) {
      console.error("Failed to mark complete:", err);
      alert(err?.message || "Failed to mark as completed");
    }
  };

  const handleScheduleSubmit = async (payload: ScheduleConsultationPayload) => {
    await scheduleConsultation(payload);
    await loadData();
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteConsultation(deletingId);
      setAllConsultations((prev) =>
        prev.filter((c) => c._id !== deletingId && c.id !== deletingId)
      );
      setDeletingId(null);
    } catch (err: any) {
      console.error("Failed to delete consultation:", err);
      setDeleteError(err?.message || "Failed to delete consultation");
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute active ongoing consultations (showing for 30 minutes from start)
  const ongoingConsultations = allConsultations.filter(
    (c) => getConsultationOngoingInfo(c, now).isOngoing
  );

  // Filter consultations according to active tab
  const displayedConsultations = allConsultations.filter((c) => {
    const timing = getConsultationOngoingInfo(c, now);

    if (activeTab === "ONGOING") {
      return timing.isOngoing;
    }

    if (activeTab === "SCHEDULED") {
      // Scheduled consultations that have not yet started
      return c.status === "SCHEDULED" && !timing.isOngoing && !timing.isMissedOrIncomplete;
    }

    if (activeTab === "COMPLETED") {
      return c.status === "COMPLETED";
    }

    // "ALL" tab: Exclude PENDING & ACCEPTED requests (which belong to requests page)
    return c.status !== "PENDING" && c.status !== "ACCEPTED";
  });

  const tabs = [
    { key: "ALL", label: `All Consultations (${allConsultations.filter((c) => c.status !== "PENDING" && c.status !== "ACCEPTED").length})` },
    { key: "SCHEDULED", label: `Scheduled (${allConsultations.filter((c) => c.status === "SCHEDULED" && !getConsultationOngoingInfo(c, now).isOngoing).length})` },
    {
      key: "ONGOING",
      label: `Ongoing / Live (${ongoingConsultations.length})`,
      isLive: ongoingConsultations.length > 0,
    },
    { key: "COMPLETED", label: `Completed (${allConsultations.filter((c) => c.status === "COMPLETED").length})` },
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
            Manage your booked video appointments, live 30-minute advisory sessions, and completed prescriptions.
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

      {/* Prominent Ongoing Consultation Showcase Banner (Shows for 30 minutes when set) */}
      {ongoingConsultations.length > 0 && (
        <div className="space-y-3">
          {ongoingConsultations.map((ongoing) => {
            const timing = getConsultationOngoingInfo(ongoing, now);
            const targetId = ongoing._id || ongoing.id || "";
            return (
              <div
                key={targetId}
                className="relative overflow-hidden rounded-3xl border-2 border-rose-400/80 bg-gradient-to-br from-rose-50 via-white to-pink-50/40 p-5 sm:p-6 shadow-lg shadow-rose-100/60"
              >
                {/* Top Live Progress Bar (30-min duration) */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${timing.progressPercent}%` }}
                  />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse">
                      <Radio className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 text-white px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                          Live Session Active · 30 Mins Window
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-xs font-mono font-bold">
                          <Clock className="h-3 w-3 text-rose-400" />
                          {timing.formattedRemaining} remaining
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1.5">
                        Consultation with {ongoing.farmer?.name || ongoing.farmerName || "Farmer"}
                      </h3>

                      <p className="text-xs text-slate-600 mt-0.5">
                        Crop: <strong className="text-emerald-800">{ongoing.cropType}</strong>
                        {ongoing.problemTitle ? ` · ${ongoing.problemTitle}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => handleStartCall(targetId)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95 animate-pulse"
                    >
                      <Video className="h-4 w-4" />
                      <span>Join Live Consultation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMarkComplete(targetId)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-4 py-2.5 text-xs font-bold transition"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Mark Complete</span>
                    </button>

                    <Link
                      href={`/dashboard/expert/consultations/${targetId}`}
                      className="inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 text-xs font-bold transition shadow-sm"
                    >
                      <span>Room Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "bg-emerald-950 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.isLive && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
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
      ) : displayedConsultations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === "ONGOING"
              ? "No Live Consultations Right Now"
              : "No Consultations Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === "ONGOING"
              ? "When a consultation is set, it will show here as ongoing for 30 minutes."
              : "No consultations match the selected status filter or search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation._id || consultation.id}
              consultation={consultation}
              now={now}
              onStartCall={handleStartCall}
              onOpenSchedule={(c) => setSchedulingConsultation(c)}
              onDelete={(id) => setDeletingId(id)}
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

      {/* Live Video Call Modal */}
      {activeCallConsultation && (
        <VideoCallModal
          isOpen={Boolean(activeCallConsultation)}
          onClose={async () => {
            setActiveCallConsultation(null);
            await loadData();
          }}
          consultation={activeCallConsultation}
          userName="AgriNova Specialist"
          isFarmer={false}
        />
      )}

      {/* Delete Upcoming Consultation Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Upcoming Consultation
                </h3>
                <p className="text-xs text-slate-500">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              Are you sure you want to delete this upcoming consultation? The booked appointment slot will be released and this session will be permanently removed from your consultations list.
            </p>

            {deleteError && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-3 border border-rose-200 text-rose-800 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingId(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Consultation"}
              </button>
            </div>
          </div>
        </div>
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
