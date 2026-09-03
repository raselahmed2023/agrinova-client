"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  FileCheck2,
  ArrowRight,
  Sparkles,
  User,
  Sprout,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import { getConsultations } from "@/services/consultation.service";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge, {
  UrgencyBadge,
} from "@/components/expert/ConsultationStatusBadge";
import VideoCallButton from "@/components/expert/VideoCallButton";

export default function FarmerConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultations();
      setConsultations(data);
    } catch (err) {
      console.error("Failed to load farmer consultations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeConsultations = consultations.filter((c) =>
    ["ACCEPTED", "SCHEDULED", "ONGOING"].includes(c.status)
  );
  const completedConsultations = consultations.filter(
    (c) => c.status === "COMPLETED"
  );
  const pendingConsultations = consultations.filter(
    (c) => c.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Advisory & Plant Clinics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            My Consultations & Live Sessions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your diagnostic requests, join live video sessions with agricultural specialists, and view digital prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/consultant"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            Book Specialist
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-36 rounded-3xl bg-slate-200 animate-pulse" />
          <div className="h-36 rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      ) : consultations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Sprout className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              No Consultation Requests Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Get direct 1-on-1 crop diagnosis and advice from Bangladesh Agricultural University certified agronomists.
            </p>
          </div>
          <Link
            href="/consultant"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
          >
            Book Your First Consultation
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active / Scheduled Sessions */}
          {activeConsultations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Video className="h-4 w-4 text-emerald-600" />
                <span>Upcoming & Live Video Sessions ({activeConsultations.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeConsultations.map((c) => {
                  const scheduledTimeStr = c.scheduledAt
                    ? new Date(c.scheduledAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : c.scheduledDate
                    ? `${c.scheduledDate} ${c.scheduledTime || ""}`
                    : null;

                  return (
                    <div
                      key={c._id || c.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-emerald-300 transition"
                    >
                      <div className="flex items-center justify-between">
                        <ConsultationStatusBadge status={c.status} size="sm" />
                        <UrgencyBadge urgency={c.urgency} />
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 uppercase">
                          {c.cropType} · {c.farmName || "Farmland"}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">
                          {c.problemTitle}
                        </h4>
                      </div>

                      {/* Expert Info */}
                      <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {c.expert?.name || c.expertName || "Assigned Specialist"}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {c.expert?.title || "Agronomist"}
                            </p>
                          </div>
                        </div>

                        {scheduledTimeStr && (
                          <div className="text-right">
                            <span className="font-bold text-emerald-900 block">
                              {scheduledTimeStr}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {c.status === "ONGOING" ? "Live Now" : "Scheduled Time"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Video Room Action */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link
                          href={`/dashboard/farmer/consultation/${c._id || c.id}`}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        {c.status === "ONGOING" ? (
                          <VideoCallButton
                            consultation={c}
                            isFarmer={true}
                            userName={c.farmer?.name || "Farmer"}
                          />
                        ) : c.status === "SCHEDULED" ? (
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
                              Starts at {c.scheduledTime || scheduledTimeStr}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-amber-700 font-medium">
                            Awaiting scheduling by expert
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Requests */}
          {pendingConsultations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Pending Review ({pendingConsultations.length})
              </h3>
              <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white p-4">
                {pendingConsultations.map((c) => (
                  <div
                    key={c._id || c.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-800">
                        {c.cropType}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900">
                        {c.problemTitle}
                      </h5>
                      <p className="text-xs text-slate-400">
                        Submitted on{" "}
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <ConsultationStatusBadge status={c.status} size="sm" />
                      <Link
                        href={`/dashboard/farmer/consultation/${c._id || c.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Consultations & Prescriptions */}
          {completedConsultations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                <span>Completed Consultations & Prescriptions ({completedConsultations.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedConsultations.map((c) => (
                  <div
                    key={c._id || c.id}
                    className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/30 to-white p-6 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <ConsultationStatusBadge status="COMPLETED" size="sm" />
                      <span className="text-xs text-slate-400">
                        {new Date(
                          c.completedAt || c.updatedAt || c.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900">
                      {c.problemTitle}
                    </h4>

                    {c.recommendations?.diagnosis && (
                      <div className="rounded-2xl bg-white p-3.5 border border-emerald-100 text-xs">
                        <span className="font-bold text-slate-500 block text-[10px] uppercase">
                          Doctor Diagnosis:
                        </span>
                        <p className="font-semibold text-slate-800 mt-0.5">
                          {c.recommendations.diagnosis}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end">
                      <Link
                        href={`/dashboard/farmer/consultation/${c._id || c.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                      >
                        View Full Prescription & Actions <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}