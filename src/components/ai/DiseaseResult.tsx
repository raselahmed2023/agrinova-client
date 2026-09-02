"use client";

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Leaf,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export interface DiseaseResultType {
  cropName?: string;
  diseaseDetected: boolean;
  diseaseName: string;
  confidence: "Low" | "Medium" | "High";
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  warning?: string;
}

interface Props {
  result: DiseaseResultType;
}

const confidenceStyle = {
  High: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function DiseaseResult({
  result,
}: Props) {
  return (
    <div className="space-y-5">
      <div
        className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
          result.diseaseDetected
            ? "border-amber-200 bg-amber-50/40"
            : "border-emerald-200 bg-emerald-50/40"
        }`}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                result.diseaseDetected
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {result.diseaseDetected ? (
                <HeartPulse className="h-6 w-6" />
              ) : (
                <CheckCircle2 className="h-6 w-6" />
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Analysis Result
              </p>

              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {result.diseaseDetected
                  ? result.diseaseName
                  : "No Clear Disease Detected"}
              </h2>

              {result.cropName && (
                <p className="mt-1 text-sm text-slate-500">
                  Crop: {result.cropName}
                </p>
              )}
            </div>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
              confidenceStyle[result.confidence]
            }`}
          >
            {result.confidence} Confidence
          </span>
        </div>
      </div>

      <ResultSection
        icon={<Stethoscope className="h-4 w-4" />}
        title="Observed Symptoms"
        items={result.symptoms}
      />

      <ResultSection
        icon={<Leaf className="h-4 w-4" />}
        title="Recommended Actions"
        items={result.treatment}
      />

      <ResultSection
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Prevention"
        items={result.prevention}
      />

      {result.warning && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

          <div>
            <h3 className="text-sm font-semibold text-amber-900">
              Important Note
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              {result.warning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultSection({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2 text-[#0B513D]">
        {icon}

        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex gap-2.5 text-sm leading-6 text-slate-600"
            >
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          No information provided.
        </p>
      )}
    </div>
  );
}