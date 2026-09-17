"use client";

import React from "react";
import {
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  MapPin,
  GraduationCap,
  Video,
  ChevronRight,
} from "lucide-react";
import type { ExpertProfile } from "@/types/expert";

interface ExpertCardProps {
  expert: ExpertProfile;
  onBook: (expert: ExpertProfile) => void;
  onViewProfile?: (expert: ExpertProfile) => void;
}

export default function ExpertCard({
  expert,
  onBook,
}: ExpertCardProps) {
  const activeSlots = (expert.availabilitySlots || []).filter(
    (slot) => slot.enabled
  );

  const activeDaysSummary =
    activeSlots.length > 0
      ? activeSlots.map((slot) => slot.day.slice(0, 3)).join(", ")
      : "No schedule published";

  const primaryTimeRange =
    activeSlots.length > 0 &&
    activeSlots[0].startTime &&
    activeSlots[0].endTime
      ? `${activeSlots[0].startTime} - ${activeSlots[0].endTime}`
      : "No time slots published";

  const specializations = Array.isArray(expert.specialization)
    ? expert.specialization.filter(Boolean)
    : [];

  const isAcceptingBookings =
    expert.availabilityStatus === "AVAILABLE" && activeSlots.length > 0;

  const hasRating =
    (expert.ratingCount || 0) > 0 || (expert.rating || 0) > 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5">
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-100 bg-slate-100 shadow-inner">
            <img
              src={
                expert.avatar ||
                expert.image ||
                "/images/default-avatar.png"
              }
              alt={expert.name}
              onError={(event) => {
                const target = event.currentTarget;

                if (!target.src.endsWith("/images/default-avatar.png")) {
                  target.src = "/images/default-avatar.png";
                }
              }}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {isAcceptingBookings && (
              <span
                className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
                title="Available for bookings"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                {expert.name}
              </h3>

              {expert.isVerified && (
                <span title="Verified Agricultural Specialist">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                </span>
              )}
            </div>

            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-emerald-800">
              {expert.title || "Agricultural Expert"}
            </p>

            {expert.institution && (
              <p className="mt-1 flex items-center gap-1 line-clamp-1 text-[11px] text-slate-500">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span>{expert.institution}</span>
              </p>
            )}

            {expert.location && (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{expert.location}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 text-xs">
          <div className="flex items-center gap-1">
            <Star
              className={`h-3.5 w-3.5 ${
                hasRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />

            {hasRating ? (
              <>
                <span className="font-bold text-slate-800">
                  {(expert.rating || 0).toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({expert.ratingCount || 0} reviews)
                </span>
              </>
            ) : (
              <span className="text-[11px] font-medium text-slate-500">
                No ratings yet
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700">
              {expert.experienceYears || 0} yrs exp
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="font-semibold text-emerald-700">
              {expert.totalConsultations || 0} cases
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Key Diagnostic Expertise
          </p>

          <div className="flex flex-wrap gap-1.5">
            {specializations.length > 0 ? (
              <>
                {specializations.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-lg border border-emerald-100/60 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800"
                  >
                    {tag}
                  </span>
                ))}

                {specializations.length > 3 && (
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                    +{specializations.length - 3} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-slate-400">
                Specialization not added
              </span>
            )}
          </div>
        </div>

        <div
          className={`mt-4 rounded-2xl border border-dashed p-3 text-xs space-y-1 ${
            isAcceptingBookings
              ? "border-emerald-200/80 bg-emerald-50/40"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span
              className={`flex items-center gap-1.5 font-bold ${
                isAcceptingBookings ? "text-emerald-950" : "text-slate-700"
              }`}
            >
              <Calendar
                className={`h-3.5 w-3.5 ${
                  isAcceptingBookings ? "text-emerald-600" : "text-slate-400"
                }`}
              />
              <span>Days: {activeDaysSummary}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                isAcceptingBookings ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAcceptingBookings ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {isAcceptingBookings ? "Accepting" : "Unavailable"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Published Window: {primaryTimeRange} (BST)</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <span className="block text-[10px] font-bold uppercase text-slate-400">
            Advisory Fee
          </span>

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">
              ৳{expert.consultationFee || 0}
            </span>
            <span className="text-[10px] font-medium text-slate-500">
              / 30 min call
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!isAcceptingBookings}
          onClick={() => {
            if (isAcceptingBookings) {
              onBook(expert);
            }
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#063B2B] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/10 transition-all hover:bg-[#0B513D] hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
        >
          <Video className="h-3.5 w-3.5" />
          <span>{isAcceptingBookings ? "Book Schedule" : "Unavailable"}</span>
          {isAcceptingBookings && <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
