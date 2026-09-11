"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  Send,
  Leaf,
  Zap,
  ShieldCheck,
  RotateCcw,
  Info,
  Clock,
  Check,
  AlertCircle,
} from "lucide-react";
import type {
  Consultation,
  CreateRecommendationPayload,
} from "@/types/consultation";
import {
  getTreatmentRecommendationFromAI,
  CLINICAL_PRESETS,
  type TreatmentRecommendationResponse,
} from "@/services/ai.service";

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
  const farmerName =
    consultation.farmer?.name || consultation.farmerName || "Assigned Farmer";
  const farmLocation =
    consultation.farmName || consultation.farmer?.farmName
      ? `${consultation.farmName || consultation.farmer?.farmName} · ${
          consultation.district || "Bangladesh"
        }`
      : consultation.district || "Bangladesh";

  // Form states
  const [diagnosis, setDiagnosis] = useState(existing?.diagnosis || "");
  const [prescriptions, setPrescriptions] = useState<string[]>(
    existing?.prescriptions?.length ? existing.prescriptions : [""]
  );
  const [treatmentSteps, setTreatmentSteps] = useState<string[]>(
    existing?.treatmentSteps?.length ? existing.treatmentSteps : [""]
  );
  const [followUpDate, setFollowUpDate] = useState(
    existing?.followUpDate ||
      new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    existing?.additionalNotes || ""
  );

  // AI & Preset states
  const [treatmentMode, setTreatmentMode] = useState<
    "integrated" | "organic" | "chemical"
  >("integrated");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [aiGeneratedData, setAiGeneratedData] =
    useState<TreatmentRecommendationResponse | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: "success" | "info";
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  // Handle AI generation
  const handleGenerateAI = async () => {
    setIsAiGenerating(true);
    setFeedbackNotice(null);
    setAiStatusMessage("Analyzing crop issue and symptoms...");

    const ticker1 = setTimeout(() => {
      setAiStatusMessage("Formulating Bangladesh agricultural dosages & active ingredients...");
    }, 900);

    const ticker2 = setTimeout(() => {
      setAiStatusMessage("Synthesizing step-by-step agronomic action plan...");
    }, 1800);

    try {
      const result = await getTreatmentRecommendationFromAI({
        cropType: consultation.cropType || "Crop",
        problemTitle: consultation.problemTitle || "Crop Disease",
        problemDescription:
          consultation.problemDescription ||
          "Symptoms reported on foliage and stems.",
        urgency: consultation.urgency,
        treatmentMode,
        farmDetails: farmLocation,
      });

      setAiGeneratedData(result);
      // Auto-apply to form for immediate review and modification
      applyDataToForm(result);
      setFeedbackNotice({
        type: "success",
        text: `AI Treatment Recommendation formulated with ${treatmentMode.toUpperCase()} strategy. Review and adjust below before sending to ${farmerName}.`,
      });
    } catch (err) {
      console.error("AI Treatment generation error:", err);
      setFeedbackNotice({
        type: "info",
        text: "Could not fetch dynamic AI recommendation, clinical presets are still available.",
      });
    } finally {
      clearTimeout(ticker1);
      clearTimeout(ticker2);
      setIsAiGenerating(false);
      setAiStatusMessage("");
    }
  };

  // Helper to apply recommendation data
  const applyDataToForm = (data: {
    diagnosis: string;
    prescriptions: string[];
    treatmentSteps: string[];
    followUpDate?: string;
    followUpDays?: number;
    additionalNotes?: string;
  }) => {
    if (data.diagnosis) setDiagnosis(data.diagnosis);
    if (data.prescriptions && data.prescriptions.length > 0) {
      setPrescriptions(data.prescriptions);
    }
    if (data.treatmentSteps && data.treatmentSteps.length > 0) {
      setTreatmentSteps(data.treatmentSteps);
    }
    if (data.followUpDate) {
      setFollowUpDate(data.followUpDate);
    } else if (data.followUpDays) {
      const d = new Date(Date.now() + data.followUpDays * 86400000)
        .toISOString()
        .split("T")[0];
      setFollowUpDate(d);
    }
    if (data.additionalNotes) {
      setAdditionalNotes(data.additionalNotes);
    }
  };

  // Preset Selection
  const handleSelectPreset = (preset: (typeof CLINICAL_PRESETS)[0]) => {
    setSelectedPresetId(preset.id);
    applyDataToForm(preset.data);
    setFeedbackNotice({
      type: "success",
      text: `Applied standard protocol: "${preset.title}". You can further edit all fields below.`,
    });
  };

  // Quick follow-up date setters
  const setQuickFollowUp = (days: number) => {
    const d = new Date(Date.now() + days * 86400000).toISOString().split("T")[0];
    setFollowUpDate(d);
  };

  // Prescriptions list handlers
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

  const handleQuickAddInput = (sample: string) => {
    if (prescriptions.length === 1 && prescriptions[0] === "") {
      setPrescriptions([sample]);
    } else {
      setPrescriptions([...prescriptions, sample]);
    }
  };

  // Steps list handlers
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

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDiagnosis = diagnosis.trim();
    if (!cleanDiagnosis) return;

    await onSubmit({
      consultationId: consultation._id || consultation.id || "",
      diagnosis: cleanDiagnosis,
      recommendation: cleanDiagnosis,
      prescriptions: prescriptions
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
      treatmentSteps: treatmentSteps
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      followUpDate,
      additionalNotes: additionalNotes.trim(),
    });
    if (onClose) onClose();
  };

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 shadow-xl space-y-6 relative overflow-hidden transition-all animate-in fade-in duration-300">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      {/* Header Section */}
      <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Expert Diagnosis & Treatment Prescription
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60">
                <Send className="h-3 w-3 text-emerald-600" /> Direct Delivery to Farmer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issue formal agronomic advice, input dosages, and step-by-step treatment plan to{" "}
              <strong className="text-slate-800 font-semibold">{farmerName}</strong> for{" "}
              <span className="text-emerald-700 font-semibold">{consultation.cropType}</span>.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Target Farmer & Issue Badge Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Prescription Recipient
          </span>
          <p className="font-bold text-slate-900 mt-0.5">{farmerName}</p>
          <p className="text-[11px] text-slate-500">{farmLocation}</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Target Crop & Urgency
          </span>
          <p className="font-bold text-slate-900 mt-0.5">
            {consultation.cropType} ·{" "}
            <span className="text-emerald-700 font-semibold">
              {consultation.urgency || "NORMAL"}
            </span>
          </p>
          <p className="text-[11px] text-slate-500">
            Field Stage: Active vegetative / fruiting
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Farmer Reported Issue
          </span>
          <p className="font-bold text-slate-900 mt-0.5 truncate" title={consultation.problemTitle}>
            {consultation.problemTitle}
          </p>
          <p className="text-[11px] text-slate-500 line-clamp-1" title={consultation.problemDescription}>
            {consultation.problemDescription}
          </p>
        </div>
      </div>

      {/* AI RECOMMENDATION ASSISTANT CARD */}
      <div className="rounded-2xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <span>AI Agricultural Treatment Recommendation</span>
                <span className="rounded-full bg-emerald-600 text-[10px] text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                  Gemini 3.7
                </span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Automatically generate diagnosis, chemical/organic inputs, and step-by-step treatment for this specific case.
              </p>
            </div>
          </div>

          {/* Strategy selector pills */}
          <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setTreatmentMode("integrated")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                treatmentMode === "integrated"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Integrated (IPM)
            </button>
            <button
              type="button"
              onClick={() => setTreatmentMode("organic")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                treatmentMode === "organic"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Leaf className="h-3.5 w-3.5" />
              100% Organic
            </button>
            <button
              type="button"
              onClick={() => setTreatmentMode("chemical")}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                treatmentMode === "chemical"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Conventional
            </button>
          </div>
        </div>

        {/* Action Button & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-emerald-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>
              Analyzing: <strong className="text-slate-800">{consultation.cropType}</strong> with issue &ldquo;
              <strong className="text-slate-800">{consultation.problemTitle}</strong>&rdquo;
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isAiGenerating}
              onClick={handleGenerateAI}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isAiGenerating ? "animate-spin" : ""}`} />
              {isAiGenerating ? "Synthesizing Prescription..." : "Generate AI Treatment"}
            </button>
          </div>
        </div>

        {/* Live status during generation */}
        {isAiGenerating && (
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-100/60 p-3 text-xs text-emerald-900 border border-emerald-200">
            <div className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="font-semibold">{aiStatusMessage}</span>
          </div>
        )}
      </div>

      {/* QUICK CLINICAL PRESETS ("and others...") */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span>Quick Clinical Protocols & Templates</span>
            <span className="text-slate-400 font-normal">(&quot;and others...&quot;)</span>
          </label>
          <span className="text-[11px] text-slate-400">One-click to populate pre-configured agronomic templates</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CLINICAL_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-2.5 rounded-xl border text-left transition text-xs flex flex-col justify-between ${
                selectedPresetId === preset.id
                  ? "border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {preset.badge}
                </span>
                {selectedPresetId === preset.id && (
                  <Check className="h-3 w-3 text-emerald-600" />
                )}
              </div>
              <p className="font-bold line-clamp-1">{preset.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {preset.cropMatch.join(", ")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast/Notice */}
      {feedbackNotice && (
        <div
          className={`flex items-start justify-between gap-2 p-3.5 rounded-2xl text-xs font-medium border ${
            feedbackNotice.type === "success"
              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{feedbackNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* FORM INPUTS */}
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* 1. Diagnostic Assessment */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Assessment *
            </label>
            <span className="text-[11px] text-slate-400">
              Pathogen, pest taxonomy, or physiological deficiency
            </span>
          </div>
          <textarea
            required
            rows={3}
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Detailed clinical agronomic diagnosis of the disease or pest identifying causal pathogen, severity stage, and visual indicators..."
            className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* 2. Prescribed Inputs / Treatments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescribed Inputs, Chemical & Organic Treatments
              </label>
              <p className="text-[11px] text-slate-400">
                Specify active ingredients, formulation, and exact dilution per Liter of water.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPrescription}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Input
            </button>
          </div>

          <div className="space-y-2">
            {prescriptions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handlePrescriptionChange(idx, e.target.value)}
                  placeholder="e.g. Mancozeb 75% WP @ 2.5g/L of water or Neem Oil 10000 ppm @ 3ml/L"
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                />
                {prescriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(idx)}
                    aria-label="Remove input"
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Input Suggestions Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Append:
            </span>
            {[
              "Mancozeb 75% WP @ 2.5g/L",
              "Azoxystrobin + Difenoconazole @ 1ml/L",
              "Cartap Hydrochloride 50 SP @ 1g/L",
              "Neem Oil 10,000 ppm @ 3ml/L",
              "Chelated Zinc (Zn-EDTA) @ 1g/L",
              "Spreader/Sticker adjuvant @ 0.5ml/L",
            ].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleQuickAddInput(s)}
                className="text-[11px] rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-0.5 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Step-by-Step Treatment Plan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Step-by-Step Agronomic Execution Plan
              </label>
              <p className="text-[11px] text-slate-400">
                Sequential instructions for the farmer (sanitation, spraying technique, watering).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Step
            </button>
          </div>

          <div className="space-y-2">
            {treatmentSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                  Step {idx + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder="e.g. Remove severely blighted lower leaves from field before foliar spraying"
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                />
                {treatmentSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    aria-label="Remove step"
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Follow-up Date & Precautions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Suggested Follow-up Review Date
              </label>
              <div className="flex items-center gap-1">
                {[
                  { label: "+5d", days: 5 },
                  { label: "+7d", days: 7 },
                  { label: "+14d", days: 14 },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setQuickFollowUp(item.days)}
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-800"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              A reminder will be scheduled for both you and the farmer.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Safety Precautions & Pre-Harvest Advice
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Wear PPE mask & gloves. 10-day pre-harvest interval (PHI). Avoid application before rain."
              className="w-full rounded-2xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100"
            />
            <p className="text-[10px] text-slate-400">
              Crucial instructions for pesticide handling and environmental safety.
            </p>
          </div>
        </div>

        {/* 5. Dispatch & Delivery Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Send className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Prescription will be permanently recorded and sent to{" "}
              <strong className="text-slate-900 font-semibold">{farmerName}</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !diagnosis.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-700/20 hover:from-emerald-700 hover:to-teal-800 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting
                ? "Dispatching to Farmer..."
                : `Send Prescription to ${farmerName.split(" ")[0]}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
