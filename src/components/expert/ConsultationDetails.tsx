"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Sprout,
  User,
  Building2,
  CheckCircle2,
  Info,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import type { Consultation } from "@/types/consultation";
import ConsultationStatusBadge, {
  UrgencyBadge,
} from "./ConsultationStatusBadge";

interface ConsultationDetailsProps {
  consultation: Consultation;
}

export default function ConsultationDetails({
  consultation,
}: ConsultationDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formattedCreatedDate = new Date(
    consultation.createdAt || consultation.requestedAt || Date.now()
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const farmName =
    consultation.farmName ||
    consultation.farmer?.farmName ||
    "Standard Farmland";

  const district =
    consultation.district ||
    consultation.farmer?.district ||
    consultation.farmer?.location ||
    "Bangladesh";

  const scheduledDisplay =
    consultation.scheduledAt
      ? new Date(consultation.scheduledAt).toLocaleString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : consultation.scheduledDate
      ? `${consultation.scheduledDate} · ${consultation.scheduledTime || ""}`
      : null;

  return (
    <div className="space-y-6">
      {/* 1. Top Banner: Farmer Overview & Status Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-emerald-100/70 border border-emerald-200 overflow-hidden flex items-center justify-center font-bold text-emerald-800 text-xl shadow-inner">
              {consultation.farmer?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={consultation.farmer.avatar}
                  alt={consultation.farmer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-black text-slate-900">
                  {consultation.farmer?.name || consultation.farmerName}
                </h2>
                <ConsultationStatusBadge
                  status={consultation.status}
                  size="md"
                />
                <UrgencyBadge urgency={consultation.urgency} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Consultation ID:{" "}
                <span className="font-mono text-slate-600">
                  {consultation._id || consultation.id}
                </span>{" "}
                · Requested {formattedCreatedDate}
              </p>
            </div>
          </div>

          {/* Quick Farmer Contacts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {consultation.farmer?.phone && (
              <a
                href={`tel:${consultation.farmer.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 transition shadow-sm"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                {consultation.farmer.phone}
              </a>
            )}
            {(consultation.farmer?.email || consultation.farmerEmail) && (
              <a
                href={`mailto:${consultation.farmer?.email || consultation.farmerEmail}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 transition shadow-sm"
              >
                <Mail className="h-3.5 w-3.5 text-sky-600" />
                {consultation.farmer?.email || consultation.farmerEmail}
              </a>
            )}
          </div>
        </div>

        {/* 2. Structured 4-Column Grid: Farmer, Farm, Crop, Scheduled Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Farmer Information */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              Farmer Information
            </span>
            <p className="text-sm font-bold text-slate-900">
              {consultation.farmer?.name || consultation.farmerName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {consultation.farmer?.phone || consultation.farmer?.email || "Registered Farmer"}
            </p>
            <p className="text-xs text-slate-400">
              District: {district}
            </p>
          </div>

          {/* Farm Information */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              Farm Information
            </span>
            <p className="text-sm font-bold text-slate-900 truncate">
              {farmName}
            </p>
            <p className="text-xs text-slate-500">
              Size: {consultation.farmer?.farmSize || "Standard Area"}
            </p>
            <p className="text-xs text-slate-400">
              Type: {consultation.farmer?.farmType || "Farmland / Open Crop Field"}
            </p>
          </div>

          {/* Crop Information */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sprout className="h-3.5 w-3.5 text-emerald-600" />
              Crop Information
            </span>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-emerald-700">{consultation.cropType}</span>
              {consultation.cropName && consultation.cropName !== consultation.cropType && (
                <span className="text-xs text-slate-500 font-normal">({consultation.cropName})</span>
              )}
            </p>
            <p className="text-xs text-slate-500 truncate">
              Issue: {consultation.problemTitle}
            </p>
            <p className="text-xs text-slate-400">
              Severity: {consultation.urgency || "MEDIUM"}
            </p>
          </div>

          {/* Consultation Schedule */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Scheduled Date & Time
            </span>
            {scheduledDisplay ? (
              <>
                <p className="text-sm font-bold text-emerald-900">
                  {scheduledDisplay}
                </p>
                <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  30-Min Live Slot Confirmed
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-700">
                  {consultation.preferredDate || "Awaiting Schedule"}
                </p>
                <p className="text-xs text-slate-400">
                  Preferred: {consultation.preferredTime || "Flexible"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Video Consultation Card (For SCHEDULED, ONGOING, or COMPLETED) */}
      {(consultation.status === "SCHEDULED" ||
        consultation.status === "ONGOING" ||
        consultation.status === "COMPLETED") && (
        <div className="rounded-3xl border border-sky-200 bg-sky-50/40 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  Video Consultation Session
                </h4>
                <p className="text-xs text-slate-500">
                  Room ID: <span className="font-mono font-bold text-slate-800">{consultation.videoRoomId || `room-${consultation._id}`}</span>
                </p>
              </div>
            </div>

            {consultation.meetingLink && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 truncate max-w-xs">
                  {consultation.meetingLink}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Problem Description & Uploaded Images */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 mb-2">
            Problem Description
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {consultation.problemTitle}
          </h3>
          <div className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
            {consultation.problemDescription}
          </div>
        </div>

        {/* Uploaded Field Images */}
        {consultation.images && consultation.images.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>Problem Images</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-bold">
                {consultation.images.length}
              </span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {consultation.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="group relative aspect-video sm:aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition hover:border-emerald-500 focus:outline-none shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Crop issue specimen ${idx + 1}`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                    Click to Enlarge
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes if any */}
        {consultation.notes && (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80 text-amber-900 text-xs">
            <Info className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-bold">Consultation Instructions / Notes: </span>
              {consultation.notes}
            </div>
          </div>
        )}
      </div>

      {/* 5. Recommendation Section (View Only when completed or recommendation present) */}
      {(consultation.recommendations || consultation.recommendation) && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <span>Official Recommendation & Advisory Issued</span>
            </div>
            {consultation.recommendations?.createdAt && (
              <span className="text-xs text-slate-500">
                Issued on{" "}
                {new Date(
                  consultation.recommendations.createdAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Expert Diagnosis
              </h5>
              <p className="text-sm font-semibold text-slate-900">
                {consultation.recommendations?.diagnosis || consultation.recommendation}
              </p>
            </div>

            {consultation.recommendations?.prescriptions &&
              consultation.recommendations.prescriptions.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Prescriptions / Chemical & Organic Inputs Recommended
                  </h5>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {consultation.recommendations.prescriptions.map((p, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {consultation.recommendations?.treatmentSteps &&
              consultation.recommendations.treatmentSteps.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Treatment Action Plan
                  </h5>
                  <ol className="space-y-2 text-sm text-slate-700">
                    {consultation.recommendations.treatmentSteps.map(
                      (step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      )
                    )}
                  </ol>
                </div>
              )}

            {consultation.recommendations?.followUpDate && (
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-emerald-100/50 p-3 rounded-xl">
                <Calendar className="h-4 w-4 text-emerald-700" />
                <span>
                  Recommended Follow-up Review:{" "}
                  <strong className="text-slate-900">
                    {consultation.recommendations.followUpDate}
                  </strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Crop enlarged preview"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
            <div className="p-3 text-center">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
