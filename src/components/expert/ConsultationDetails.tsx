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
  Layers,
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

  const formattedDate = new Date(consultation.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const farmName =
    consultation.farmName ||
    consultation.farmer?.farmName ||
    "Standard Farmland";
  const district =
    consultation.district ||
    consultation.farmer?.district ||
    consultation.farmer?.location ||
    "Bangladesh";
  const requestedDate =
    consultation.preferredDate ||
    new Date(consultation.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Farmer Overview */}
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
                  {consultation.farmer?.name}
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
                · Submitted {formattedDate}
              </p>
            </div>
          </div>

          {/* Quick Farmer Contacts */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {consultation.farmer?.phone && (
              <a
                href={`tel:${consultation.farmer.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                {consultation.farmer.phone}
              </a>
            )}
            {consultation.farmer?.email && (
              <a
                href={`mailto:${consultation.farmer.email}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <Mail className="h-3.5 w-3.5 text-sky-600" />
                {consultation.farmer.email}
              </a>
            )}
          </div>
        </div>

        {/* Structured 4-Column Grid: Farmer Details, Farm Details, District, Crop & Requested Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Farmer Details */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-slate-500" />
              Farmer Details
            </span>
            <p className="text-sm font-bold text-slate-900">
              {consultation.farmer?.name}
            </p>
            <p className="text-xs text-slate-500">
              {consultation.farmer?.phone || consultation.farmer?.email || "Registered Member"}
            </p>
          </div>

          {/* Farm Details */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              Farm Details
            </span>
            <p className="text-sm font-bold text-slate-900 truncate">
              {farmName}
            </p>
            <p className="text-xs text-slate-500">
              {consultation.farmer?.farmSize || "Area N/A"} · {consultation.farmer?.farmType || "Farmland"}
            </p>
          </div>

          {/* District & Crop */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-rose-500" />
              District & Crop
            </span>
            <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
              <span>{district}</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <Sprout className="h-3.5 w-3.5" />
                {consultation.cropType}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Division: {consultation.farmer?.location?.split(",")?.[1]?.trim() || "National"}
            </p>
          </div>

          {/* Requested Date */}
          <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              Requested Date
            </span>
            <p className="text-sm font-bold text-slate-900">
              {requestedDate}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {consultation.preferredTime || "Preferred slot flexible"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Issue Card: Problem Title, Description, Uploaded Images */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 mb-2">
            Problem Title & Description
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {consultation.problemTitle}
          </h3>
          <div className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
            {consultation.problemDescription}
          </div>
        </div>

        {/* Uploaded Field Images */}
        {consultation.images && consultation.images.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>Uploaded Images</span>
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
              <span className="font-bold">Consultation Notes: </span>
              {consultation.notes}
            </div>
          </div>
        )}
      </div>

      {/* Completed Recommendation Card if present */}
      {consultation.recommendations && (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <span>Official Recommendation & Prescription Issued</span>
            </div>
            {consultation.recommendations.createdAt && (
              <span className="text-xs text-slate-500">
                Issued on{" "}
                {new Date(
                  consultation.recommendations.createdAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Expert Diagnosis
              </h5>
              <p className="text-sm font-semibold text-slate-900">
                {consultation.recommendations.diagnosis}
              </p>
            </div>

            {consultation.recommendations.prescriptions &&
              consultation.recommendations.prescriptions.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Prescriptions / Inputs Recommended
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

            {consultation.recommendations.treatmentSteps &&
              consultation.recommendations.treatmentSteps.length > 0 && (
                <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Step-by-Step Action Plan
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

            {consultation.recommendations.followUpDate && (
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Calendar className="h-4 w-4 text-emerald-600" />
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
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
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
