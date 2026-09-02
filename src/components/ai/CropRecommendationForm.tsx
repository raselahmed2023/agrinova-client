"use client";

import {
  AlertCircle,
  Droplets,
  Leaf,
  LoaderCircle,
  MapPin,
  RotateCcw,
  Sparkles,
  Sprout,
} from "lucide-react";
import { FormEvent, useState } from "react";

import CropRecommendationResult, {
  type CropRecommendation,
} from "./CropRecommendationResult";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface FormState {
  location: string;
  soilType: string;
  season: string;
  waterAvailability: "LOW" | "MEDIUM" | "HIGH";
  farmSize: string;
  notes: string;
}

const initialForm: FormState = {
  location: "",
  soilType: "",
  season: "",
  waterAvailability: "MEDIUM",
  farmSize: "",
  notes: "",
};

export default function CropRecommendationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [recommendations, setRecommendations] = useState<
    CropRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setRecommendations([]);
    setIsLoading(true);

    try {
      const payload = {
        location: form.location.trim(),
        soilType: form.soilType.trim(),
        season: form.season.trim(),
        waterAvailability: form.waterAvailability,
        ...(form.farmSize
          ? { farmSize: Number(form.farmSize) }
          : {}),
        ...(form.notes.trim()
          ? { notes: form.notes.trim() }
          : {}),
      };

      const response = await fetch(
        `${API_URL}/ai/crop-recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to generate crop recommendations."
        );
      }

      setRecommendations(
        result.data?.recommendations || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setRecommendations([]);
    setError("");
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F3EC] text-[#0B513D]">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="text-sm font-semibold text-[#477A5B]">
              AI Tools
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Crop Recommendation
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Enter your farm conditions and get suitable
            crop suggestions based on your location,
            soil and available resources.
          </p>
        </div>

        {(recommendations.length > 0 || error) && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Start Again
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
              <Sprout className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Farm Conditions
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Provide accurate details for better results.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <Field label="Location" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    handleChange("location", e.target.value)
                  }
                  placeholder="e.g. Kushtia, Bangladesh"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />
              </div>
            </Field>

            <Field label="Soil Type" required>
              <select
                required
                value={form.soilType}
                onChange={(e) =>
                  handleChange("soilType", e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              >
                <option value="">Select soil type</option>
                <option value="Loamy">Loamy</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Silt">Silt</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </Field>

            <Field label="Season" required>
              <select
                required
                value={form.season}
                onChange={(e) =>
                  handleChange("season", e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              >
                <option value="">Select season</option>
                <option value="Rabi">Rabi</option>
                <option value="Kharif-1">Kharif-1</option>
                <option value="Kharif-2">Kharif-2</option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
              </select>
            </Field>

            <Field label="Water Availability" required>
              <div className="grid grid-cols-3 gap-2">
                {(["LOW", "MEDIUM", "HIGH"] as const).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          waterAvailability: level,
                        }))
                      }
                      className={`rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                        form.waterAvailability === level
                          ? "border-[#0B513D] bg-[#EEF6F1] text-[#0B513D]"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}
              </div>
            </Field>

            <Field label="Farm Size">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.farmSize}
                  onChange={(e) =>
                    handleChange("farmSize", e.target.value)
                  }
                  placeholder="e.g. 2"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-16 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
                />

                <span className="absolute right-3 top-3.5 text-xs font-medium text-slate-400">
                  acres
                </span>
              </div>
            </Field>

            <Field label="Additional Notes">
              <textarea
                rows={4}
                maxLength={1000}
                value={form.notes}
                onChange={(e) =>
                  handleChange("notes", e.target.value)
                }
                placeholder="Any special farm conditions, goals or concerns..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
              />
            </Field>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B513D] text-sm font-semibold text-white shadow-sm transition hover:bg-[#084330] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analyzing Farm...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
        </form>

        <section>
          {isLoading ? (
            <RecommendationSkeleton />
          ) : recommendations.length > 0 ? (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recommended Crops
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Based on the conditions you provided.
                </p>
              </div>

              <CropRecommendationResult
                recommendations={recommendations}
              />
            </>
          ) : (
            <div className="flex min-h-[580px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4ED] text-[#0B513D]">
                  <Leaf className="h-7 w-7" />
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-900">
                  Find the right crops for your farm
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in your farm information and AgriNova
                  will analyze the conditions to recommend
                  suitable crops.
                </p>

                <div className="mt-5 flex justify-center gap-2 text-xs text-slate-400">
                  <Droplets className="h-4 w-4" />
                  Soil · Season · Water · Location
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="flex justify-between gap-4">
            <div>
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-20 rounded bg-slate-100" />
            </div>

            <div className="h-7 w-24 rounded-full bg-slate-100" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((box) => (
              <div
                key={box}
                className="h-32 rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}