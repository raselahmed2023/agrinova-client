"use client";

import React from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Star,
  Clock,
  Calendar,
  Sparkles,
  MapPin,
  GraduationCap,
  Award,
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
  onViewProfile,
}: ExpertCardProps) {
  // Enabled availability days
  const activeSlots = (expert.availabilitySlots || []).filter((s) => s.enabled);
  const activeDaysSummary =
    activeSlots.length > 0
      ? activeSlots
          .map((s) => s.day.slice(0, 3))
          .join(", ")
      : "Flexible Schedule";

  const primaryTimeRange =
    activeSlots.length > 0 && activeSlots[0].startTime && activeSlots[0].endTime
      ? `${activeSlots[0].startTime} - ${activeSlots[0].endTime}`
      : "Evening Slots";

  const specializations = Array.isArray(expert.specialization)
    ? expert.specialization
    : expert.specialization
    ? [expert.specialization]
    : ["General Agronomy"];

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/5">
      {/* Top Header & Avatar */}
      <div>
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-100 bg-slate-100 shadow-inner">
            <img
              src={
                expert.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              }
              alt={expert.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {expert.availabilityStatus === "AVAILABLE" && (
              <span
                className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
                title="Available for bookings"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {expert.name}
              </h3>
              {expert.isVerified && (
                <span title="Verified Agricultural Specialist">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-emerald-800 line-clamp-1 mt-0.5">
              {expert.title}
            </p>

            {expert.institution && (
              <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 line-clamp-1">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                <span>{expert.institution}</span>
              </p>
            )}

            {expert.location && (
              <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span>{expert.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Rating & Stats Strip */}
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50/80 px-3.5 py-2.5 text-xs border border-slate-100">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-800">
              {expert.rating ? expert.rating.toFixed(1) : "4.9"}
            </span>
            <span className="text-[11px] text-slate-400">
              ({expert.ratingCount || 100}+ reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700">
              {expert.experienceYears || 10}+ yrs exp
            </span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span className="font-semibold text-emerald-700">
              {expert.totalConsultations || 200}+ cases
            </span>
          </div>
        </div>

        {/* Specialization Tags */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Key Diagnostic Expertise
          </p>
          <div className="flex flex-wrap gap-1.5">
            {specializations.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-100/60"
              >
                {tag}
              </span>
            ))}
            {specializations.length > 3 && (
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                +{specializations.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Availability Schedule Indicator */}
        <div className="mt-4 rounded-2xl border border-dashed border-emerald-200/80 bg-emerald-50/40 p-3 text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-emerald-950">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>Days: {activeDaysSummary}</span>
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Accepting
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Usual Window: {primaryTimeRange} (BST)</span>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Advisory Fee
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">
              ৳{expert.consultationFee || 500}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              / 30 min call
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onBook(expert)}
          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#063B2B] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/10 transition-all hover:bg-[#0B513D] hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95"
        >
          <Video className="h-3.5 w-3.5 text-emerald-300" />
          <span>Book Schedule</span>
          <ChevronRight className="h-3.5 w-3.5 text-emerald-300" />
        </button>
      </div>
    </div>
  );
}
