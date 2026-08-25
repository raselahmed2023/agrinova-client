"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Leaf,
  Lightbulb,
  ShieldAlert,
  Sprout,
} from "lucide-react";

export interface CropRecommendation {
  cropName: string;
  suitability: "High" | "Medium" | "Low";
  reasons: string[];
  growingPeriod: string;
  basicCare: string[];
  risks: string[];
}

interface Props {
  recommendations: CropRecommendation[];
}

const suitabilityStyles = {
  High: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

export default function CropRecommendationResult({
  recommendations,
}: Props) {
  return (
    <div className="space-y-5">
      {recommendations.map((item, index) => (
        <article
          key={`${item.cropName}-${index}`}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
                  <Sprout className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.cropName}
                    </h3>

                    {index === 0 && item.suitability === "High" && (
                      <span className="rounded-full bg-[#0B513D] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Best Match
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Recommendation #{index + 1}
                  </p>
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  suitabilityStyles[item.suitability]
                }`}
              >
                {item.suitability} Suitability
              </span>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-[#FAFBFA] p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-[#477A5B]" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Why it fits
                </h4>
              </div>

              <ul className="mt-3 space-y-2">
                {item.reasons.map((reason, reasonIndex) => (
                  <li
                    key={reasonIndex}
                    className="flex gap-2 text-sm leading-6 text-slate-600"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#FAFBFA] p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#477A5B]" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Growing Period
                </h4>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.growingPeriod}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-[#FAFBFA] p-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-[#477A5B]" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Basic Care
                </h4>
              </div>

              <ul className="mt-3 space-y-2">
                {item.basicCare.map((care, careIndex) => (
                  <li
                    key={careIndex}
                    className="flex gap-2 text-sm leading-6 text-slate-600"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Potential Risks
                </h4>
              </div>

              <ul className="mt-3 space-y-2">
                {item.risks.map((risk, riskIndex) => (
                  <li
                    key={riskIndex}
                    className="flex gap-2 text-sm leading-6 text-slate-600"
                  >
                    <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}