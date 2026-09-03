"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Radio,
  ArrowRight,
  Sparkles,
  ClipboardList,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  User,
  Plus,
  RefreshCw,
  Eye,
} from "lucide-react";
import ExpertStatsCard from "@/components/expert/ExpertStatsCard";
import ConsultationStatusBadge from "@/components/expert/ConsultationStatusBadge";
import ConsultationCard from "@/components/expert/ConsultationCard";
import ScheduleConsultationForm from "@/components/expert/ScheduleConsultationForm";
import VideoCallButton from "@/components/expert/VideoCallButton";
import {
  getConsultations,
  getExpertStats,
  scheduleConsultation,
} from "@/services/consultation.service";
import { getExpertAvailability, getExpertProfile } from "@/services/expert.service";
import type {
  Consultation,
  ConsultationStats,
  ScheduleConsultationPayload,
} from "@/types/consultation";
import type { ExpertAvailability, ExpertProfile } from "@/types/expert";

export default function ExpertDashboardPage() {
  const [stats, setStats] = useState<ConsultationStats>({
    newRequests: 0,
    accepted: 0,
    scheduled: 0,
    ongoing: 0,
    completed: 0,
  });
  const [allConsultations, setAllConsultations] = useState<Consultation[]>([]);
  const [availability, setAvailability] = useState<ExpertAvailability | null>(null);
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scheduling modal state
  const [schedulingConsultation, setSchedulingConsultation] =
    useState<Consultation | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, listData, availData, profData] = await Promise.all([
        getExpertStats(),
        getConsultations(),
        getExpertAvailability(),
        getExpertProfile(),
      ]);
      setStats(statsData);
      setAllConsultations(listData);
      setAvailability(availData);
      setProfile(profData);
    } catch (err) {
      console.error("Failed to load expert dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleSubmit = async (payload: ScheduleConsultationPayload) => {
    await scheduleConsultation(payload);
    await loadData();
  };

  // Filter sections
  const recentRequests = allConsultations.filter(
    (c) => c.status === "PENDING"
  );
  const upcomingConsultations = allConsultations.filter(
    (c) => c.status === "SCHEDULED"
  );
  const ongoingConsultations = allConsultations.filter(
    (c) => c.status === "ONGOING"
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700/50">
              <Sparkles className="h-3 w-3" />
              Specialist Advisory Hub
            </span>
            {availability?.isAcceptingConsultations && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-600/60">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live & Available
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {profile?.name || "Dr. Rafiqul Islam"}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl">
            You have <strong className="text-white">{stats.newRequests} new farmer requests</strong> waiting for review and <strong className="text-white">{stats.scheduled + stats.ongoing} sessions</strong> scheduled for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/dashboard/expert/requests"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-950 shadow-md transition hover:bg-emerald-50"
          >
            <ClipboardList className="h-4 w-4 text-emerald-700" />
            Review Requests ({stats.newRequests})
          </Link>
        </div>
      </div>

      {/* 5 Top Stat Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Consultations Overview
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Real-time status breakdown
          </span>
        </div>
        <ExpertStatsCard stats={stats} isLoading={isLoading} />
      </section>

      {/* Ongoing Consultation Alert Banner (if any) */}
      {ongoingConsultations.length > 0 && (
        <section className="rounded-3xl border-2 border-rose-200 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg animate-pulse">
                <Radio className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white uppercase animate-pulse">
                    Live Session Now
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Consultation with {ongoingConsultations[0].farmer.name}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {ongoingConsultations[0].problemTitle} ({ongoingConsultations[0].cropType})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <VideoCallButton consultation={ongoingConsultations[0]} onCallEnded={loadData} />
              <Link
                href={`/dashboard/expert/consultations/${ongoingConsultations[0]._id || ongoingConsultations[0].id}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Open Room
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Consultations & Requests + Availability Side Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Table of consultations + Recent Requests */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Consultations Table (Matches the required specification) */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Consultations
                </h3>
                <p className="text-xs text-slate-400">
                  Active farmer queries and upcoming scheduled appointments
                </p>
              </div>
              <Link
                href="/dashboard/expert/consultations"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 px-3">Farmer</th>
                    <th className="pb-3 px-3">Problem</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Schedule</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {allConsultations.slice(0, 6).map((item) => (
                    <tr
                      key={item._id || item.id}
                      className="group transition hover:bg-slate-50/80"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold overflow-hidden border border-slate-200">
                            {item.farmer.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.farmer.avatar}
                                alt={item.farmer.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-emerald-900 transition">
                              {item.farmer.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {item.cropType}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.problemTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.problemDescription}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <ConsultationStatusBadge status={item.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3 font-medium text-slate-600 whitespace-nowrap">
                        {item.scheduledDate ? (
                          <span className="flex items-center gap-1 text-slate-800">
                            <Calendar className="h-3 w-3 text-indigo-600" />
                            {item.scheduledDate} {item.scheduledTime}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {item.status === "PENDING" ? (
                          <Link
                            href={`/dashboard/expert/requests/${item._id || item.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Link>
                        ) : (
                          <Link
                            href={`/dashboard/expert/consultations/${item._id || item.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Consultations Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upcoming Consultations
                </h3>
                <p className="text-xs text-slate-400">
                  Booked video calls awaiting session execution
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {upcomingConsultations.length} Scheduled
              </span>
            </div>

            {upcomingConsultations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
                <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-medium">No upcoming consultations right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingConsultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation._id || consultation.id}
                    consultation={consultation}
                    onOpenSchedule={(c) => setSchedulingConsultation(c)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Availability Status & Quick Profile Widgets */}
        <div className="space-y-6">
          {/* Availability Status Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 font-bold">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Availability Status
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Your active booking schedule
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/expert/availability"
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Accepting Requests
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {availability?.isAcceptingConsultations ? "Active" : "Paused"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                Timezone: {availability?.timezone || "Asia/Dhaka (GMT+6)"}
              </p>
            </div>

            {/* Weekly Days Snapshot */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Weekly Active Days
              </h4>
              <div className="space-y-1.5 text-xs">
                {availability?.weeklySchedule?.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50"
                  >
                    <span className="font-semibold capitalize text-slate-700">
                      {day.day}
                    </span>
                    {day.isAvailable ? (
                      <span className="font-mono text-[11px] text-emerald-700 font-bold">
                        {day.slots.map((s) => `${s.start}-${s.end}`).join(", ")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Off</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/expert/availability"
              className="block w-full text-center rounded-2xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Manage Working Hours
            </Link>
          </div>

          {/* Expert Quick Summary */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-900">
                {profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {profile?.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {profile?.title}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Rating</span>
                <p className="text-sm font-black text-slate-900">⭐ {profile?.rating || "4.9"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Calls</span>
                <p className="text-sm font-black text-slate-900">{profile?.totalConsultations || "340+"}</p>
              </div>
            </div>

            <Link
              href="/dashboard/expert/profile"
              className="block w-full text-center rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Edit Expert Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Schedule Form Modal */}
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