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
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  User,
  Plus,
  RefreshCw,
  Globe,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
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
import { getConsultationOngoingInfo } from "@/utils/consultationTiming";

export default function ExpertDashboardPage() {
  const { data: session } = useSession();
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

  // Fallback for expert name when dynamic profile data is not available
  const expertName = session?.user?.name || profile?.name || "Expert";

  // Scheduling modal state
  const [schedulingConsultation, setSchedulingConsultation] =
    useState<Consultation | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  // 1-second live heartbeat for accurate 30-min timers
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Filter out any consultation requests (PENDING) and ACCEPTED from the expert overview
  const activeConsultations = allConsultations.filter(
    (c) => c.status !== "PENDING" && c.status !== "ACCEPTED"
  );
  const upcomingConsultations = allConsultations.filter(
    (c) => c.status === "SCHEDULED" && !getConsultationOngoingInfo(c, now).isOngoing
  );
  const ongoingConsultations = allConsultations.filter(
    (c) => getConsultationOngoingInfo(c, now).isOngoing
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-7 md:p-8 text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700/50">
              <Sparkles className="h-3 w-3" />
              Specialist Advisory Hub
            </span>
            {availability?.availabilityStatus === "AVAILABLE" && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-600/60">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live & Available
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {expertName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Manage your consultations, scheduled sessions, and farmer advisory services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
          <button
            type="button"
            onClick={loadData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20 active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 3 Top Stat Cards */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Consultations Overview
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Real-time status breakdown
          </span>
        </div>
        <ExpertStatsCard stats={stats} isLoading={isLoading} />
      </section>

      {/* Ongoing Consultation Alert Banner (if any, showing for 30 minutes) */}
      {ongoingConsultations.length > 0 && (
        <section className="rounded-2xl sm:rounded-3xl border-2 border-rose-200 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg animate-pulse">
                <Radio className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-white uppercase animate-pulse">
                    Live Session Active (30m)
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3 text-rose-500" />
                    {getConsultationOngoingInfo(ongoingConsultations[0], now).formattedRemaining} remaining
                  </span>
                  <span className="text-xs text-slate-500 font-medium truncate">
                    with {ongoingConsultations[0].farmer?.name || ongoingConsultations[0].farmerName || "Farmer"}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
                  {ongoingConsultations[0].problemTitle?.trim() ||
                    ongoingConsultations[0].problemDescription?.trim() ||
                    "Live Advisory Session"}
                  {ongoingConsultations[0].cropType?.trim()
                    ? ` (${ongoingConsultations[0].cropType.trim()})`
                    : ""}
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <VideoCallButton consultation={ongoingConsultations[0]} onCallEnded={loadData} />
              <Link
                href={`/dashboard/expert/consultations/${ongoingConsultations[0]._id || ongoingConsultations[0].id}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center"
              >
                Open Room
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Consultations & Requests + Availability Side Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Columns: Table of consultations + Recent Requests */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Main Consultations Table (Matches the required specification) */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Recent Consultations
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Active farmer queries and upcoming scheduled appointments
                </p>
              </div>
              <Link
                href="/dashboard/expert/consultations"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline self-start sm:self-auto"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Table with responsive horizontal scroll */}
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[560px] text-left border-collapse">
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
                  {activeConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                        No consultations found.
                      </td>
                    </tr>
                  ) : (
                    activeConsultations.slice(0, 6).map((item) => (
                      <tr
                        key={item._id || item.id}
                        className="group transition hover:bg-slate-50/80"
                      >
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold overflow-hidden border border-slate-200">
                              {item.farmer?.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.farmer.avatar}
                                  alt={item.farmer?.name || item.farmerName || "Farmer"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-emerald-900 transition">
                                {item.farmer?.name || item.farmerName || "Farmer"}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {item.cropType || item.cropName || "General Crop"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <p className="font-semibold text-slate-800 truncate">
                            {item.problemTitle || "Crop Advisory"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {item.problemDescription || "No description provided"}
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
                          <Link
                            href={`/dashboard/expert/consultations/${item._id || item.id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition"
                          >
                            <span>Open</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
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
                    now={now}
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
          {(() => {
            const isAvailable = availability?.availabilityStatus !== "UNAVAILABLE";
            const ALL_DAYS: { day: string; short: string; full: string }[] = [
              { day: "SATURDAY", short: "Sat", full: "Saturday" },
              { day: "SUNDAY", short: "Sun", full: "Sunday" },
              { day: "MONDAY", short: "Mon", full: "Monday" },
              { day: "TUESDAY", short: "Tue", full: "Tuesday" },
              { day: "WEDNESDAY", short: "Wed", full: "Wednesday" },
              { day: "THURSDAY", short: "Thu", full: "Thursday" },
              { day: "FRIDAY", short: "Fri", full: "Friday" },
            ];

            const activeSlots = (availability?.availabilitySlots || []).filter(
              (s) => s.enabled
            );

            const formatTime = (timeStr?: string) => {
              if (!timeStr) return "";
              const [hStr, mStr] = timeStr.split(":");
              const h = parseInt(hStr, 10);
              if (isNaN(h)) return timeStr;
              const period = h >= 12 ? "PM" : "AM";
              const formattedH = h % 12 === 0 ? 12 : h % 12;
              return `${formattedH}:${mStr} ${period}`;
            };

            return (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold shadow-2xs">
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
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-emerald-800 transition"
                  >
                    <span>Edit</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Status Card Banner */}
                <div
                  className={`rounded-2xl p-4 border transition-all ${
                    isAvailable
                      ? "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-emerald-50/70 border-emerald-200/80"
                      : "bg-amber-50/70 border-amber-200/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Booking Status
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold border shadow-2xs ${
                        isAvailable
                          ? "bg-emerald-100/90 text-emerald-900 border-emerald-300"
                          : "bg-amber-100/90 text-amber-900 border-amber-300"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isAvailable
                            ? "bg-emerald-600 animate-pulse"
                            : "bg-amber-600"
                        }`}
                      />
                      {isAvailable ? "Accepting Bookings" : "Temporarily Paused"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Timezone: Asia/Dhaka (BST, GMT+6)</span>
                  </div>
                </div>

                {/* 7-Day Glance Strip */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Weekly Schedule Glance
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      {activeSlots.length} {activeSlots.length === 1 ? "day" : "days"} active
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {ALL_DAYS.map(({ day, short }) => {
                      const slot = availability?.availabilitySlots?.find(
                        (s) => s.day === day
                      );
                      const isEnabled = slot?.enabled;
                      return (
                        <div
                          key={day}
                          title={`${day}: ${
                            isEnabled
                              ? `${slot?.startTime} - ${slot?.endTime}`
                              : "Off"
                          }`}
                          className={`flex flex-col items-center justify-center py-1.5 sm:py-2 px-0.5 rounded-xl text-center border transition ${
                            isEnabled
                              ? "bg-[#063B2B] text-white border-emerald-950 shadow-xs"
                              : "bg-slate-50 text-slate-400 border-slate-100"
                          }`}
                        >
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">
                            {short}
                          </span>
                          <span
                            className={`h-1.5 w-1.5 rounded-full mt-1 ${
                              isEnabled ? "bg-emerald-400" : "bg-transparent"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Working Hours List */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Working Hours
                  </h4>

                  {activeSlots.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5 text-center">
                      <p className="text-xs font-medium text-slate-500">
                        No active consultation hours set for this week.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {activeSlots.map((slot) => {
                        const dayInfo = ALL_DAYS.find((d) => d.day === slot.day);
                        return (
                          <div
                            key={slot.day}
                            className="flex items-center justify-between rounded-xl bg-slate-50/80 px-3 py-2 border border-slate-100 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">
                                {dayInfo?.full || slot.day}
                              </span>
                            </div>

                            <span className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0">
                              <Clock className="h-3 w-3 text-emerald-600" />
                              {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Manage Button */}
                <Link
                  href="/dashboard/expert/availability"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-[#063B2B] hover:bg-[#0B513D] py-3 text-xs font-bold text-white shadow-md shadow-emerald-950/15 transition-all hover:shadow-lg active:scale-98"
                >
                  <Clock className="h-3.5 w-3.5 text-emerald-300" />
                  <span>Manage Working Hours</span>
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-300" />
                </Link>
              </div>
            );
          })()}

          {/* Expert Quick Summary */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-900 shrink-0">
                {profile?.avatar || session?.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile?.avatar || session?.user?.image || ""}
                    alt={expertName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {expertName}
                </h4>
                <p className="text-xs text-slate-500 font-medium truncate">
                  {profile?.title || "Agriculture Advisory Specialist"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rating</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">⭐ {profile?.rating || "5.0"}</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Calls</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">{profile?.totalConsultations || "0"}</p>
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