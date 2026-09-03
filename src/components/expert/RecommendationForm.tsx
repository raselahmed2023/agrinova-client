"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  FileCheck,
  X,
} from "lucide-react";
import type {
  Consultation,
  CreateRecommendationPayload,
} from "@/types/consultation";

interface RecommendationFormProps {
  consultation: Consultation;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit: (payload: CreateRecommendationPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export default function RecommendationForm({
  consultation,
  isOpen = true,
  onClose,
  onSubmit,
  isSubmitting = false,
}: RecommendationFormProps) {
  const existing = consultation.recommendations;

  const [diagnosis, setDiagnosis] = useState(
    existing?.diagnosis || ""
  );
  const [prescriptions, setPrescriptions] = useState<string[]>(
    existing?.prescriptions?.length
      ? existing.prescriptions
      : [""]
  );
  const [treatmentSteps, setTreatmentSteps] = useState<string[]>(
    existing?.treatmentSteps?.length
      ? existing.treatmentSteps
      : [""]
  );
  const [followUpDate, setFollowUpDate] = useState(
    existing?.followUpDate || ""
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    existing?.additionalNotes || ""
  );

  if (!isOpen) return null;

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, ""]);
  };

  const handleRemovePrescription = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handlePrescriptionChange = (idx: number, val: string) => {
    const updated = [...prescriptions];
    updated[idx] = val;
    setPrescriptions(updated);
  };

  const handleAddStep = () => {
    setTreatmentSteps([...treatmentSteps, ""]);
  };

  const handleRemoveStep = (idx: number) => {
    setTreatmentSteps(treatmentSteps.filter((_, i) => i !== idx));
  };

  const handleStepChange = (idx: number, val: string) => {
    const updated = [...treatmentSteps];
    updated[idx] = val;
    setTreatmentSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      consultationId: consultation._id || consultation.id || "",
      diagnosis,
      prescriptions: prescriptions.filter((p) => p.trim().length > 0),
      treatmentSteps: treatmentSteps.filter((s) => s.trim().length > 0),
      followUpDate,
      additionalNotes,
    });
    if (onClose) onClose();
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Expert Diagnosis & Treatment Prescription
            </h3>
            <p className="text-xs text-slate-500">
              Provide formal recommendations to {consultation.farmer.name} for {consultation.cropType}.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diagnosis */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Diagnostic Assessment *
          </label>
          <textarea
            required
            rows={3}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Detailed description of the plant disease, pathogen, nutrient deficiency or pest identified..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Prescriptions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Prescribed Inputs / Treatments
            </label>
            <button
              type="button"
              onClick={handleAddPrescription}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Input
            </button>
          </div>

          <div className="space-y-2">
            {prescriptions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handlePrescriptionChange(idx, e.target.value)}
                  placeholder="e.g., Mancozeb 75% WP @ 2g/liter of water spray"
                  className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
                {prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Steps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Step-by-Step Execution Plan
            </label>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Step
            </button>
          </div>

          <div className="space-y-2">
            {treatmentSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder="e.g., Clear infected leaf litter from ground before applying foliar spray"
                  className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
                />
                {treatmentSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Follow up & notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Suggested Follow-up Review Date
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Precautions / Extra Advice
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g., Wear protective mask during spray and avoid direct rain."
              className="w-full rounded-2xl border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submission */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Issue Official Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
}
