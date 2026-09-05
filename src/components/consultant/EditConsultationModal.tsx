"use client";

import React, { useState } from "react";
import {
  X,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sprout,
  MapPin,
  Building,
} from "lucide-react";
import type { Consultation, ConsultationUrgency } from "@/types/consultation";
import { updateConsultationDetails } from "@/services/consultation.service";

interface EditConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation;
  onSuccess: (updated: Consultation) => void;
}

const COMMON_CROPS = [
  "Rice (Aman/Boro)",
  "Potato",
  "Tomato",
  "Maize / Corn",
  "Mango",
  "Eggplant (Brinjal)",
  "Chili & Pepper",
  "Mustard",
  "Jute",
  "Guava",
  "Wheat",
  "Onion & Garlic",
];

const BANGLADESH_DISTRICTS = [
  "Bogra",
  "Dinajpur",
  "Rajshahi",
  "Jessore",
  "Mymensingh",
  "Rangpur",
  "Comilla",
  "Dhaka",
  "Gazipur",
  "Tangail",
  "Pabna",
  "Khulna",
  "Barisal",
  "Sylhet",
];

export default function EditConsultationModal({
  isOpen,
  onClose,
  consultation,
  onSuccess,
}: EditConsultationModalProps) {
  const [cropType, setCropType] = useState(consultation.cropType || "Rice");
  const [problemTitle, setProblemTitle] = useState(
    consultation.problemTitle || ""
  );
  const [problemDescription, setProblemDescription] = useState(
    consultation.problemDescription || ""
  );
  const [urgency, setUrgency] = useState<ConsultationUrgency>(
    consultation.urgency || "MEDIUM"
  );
  const [farmName, setFarmName] = useState(
    consultation.farmName || consultation.farmer?.farmName || ""
  );
  const [district, setDistrict] = useState(
    consultation.district || consultation.farmer?.district || "Bogra"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemTitle.trim()) {
      setErrorMsg("Please enter problem title or symptoms summary.");
      return;
    }
    if (!problemDescription.trim()) {
      setErrorMsg("Please describe the problem symptoms and history.");
      return;
    }

    const targetId = consultation._id || consultation.id;
    if (!targetId) {
      setErrorMsg("Consultation ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const updated = await updateConsultationDetails(
        targetId,
        {
          cropType,
          cropName: cropType,
          problemTitle: problemTitle.trim(),
          problemDescription: problemDescription.trim(),
          urgency,
          farmName: farmName.trim(),
          district,
        }
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error("Failed to update consultation details:", err);
      setErrorMsg(err?.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl transition-all my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-3.5 sm:py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-bold shrink-0">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Edit Consultation Details
              </h3>
              <p className="text-[11px] text-slate-500">
                Update crop symptoms, urgency, or farm location
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 shrink-0">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Crop Affected */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Crop Affected <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_CROPS.slice(0, 6).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCropType(c)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-medium transition border ${
                    cropType === c
                      ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Problem Title */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Problem Title / Symptoms Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {/* Problem Description */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Detailed Symptoms & History <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none resize-none"
              required
            />
          </div>

          {/* Urgency & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as ConsultationUrgency)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none bg-white font-medium"
              >
                <option value="LOW">Routine Advisory (Low)</option>
                <option value="MEDIUM">Standard Diagnostic (Moderate)</option>
                <option value="HIGH">Urgent - Spreading (High)</option>
                <option value="EMERGENCY">Emergency - Immediate Loss</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                District / Region
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none bg-white font-medium"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Farm Name */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Farm Name
            </label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="e.g. Green Valley Farm"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#063B2B] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0B513D] disabled:opacity-50 transition"
            >
              {isSubmitting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
