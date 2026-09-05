"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Leaf,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface Farm {
  _id: string;
  name: string;
  farmType?: string;
  division?: string;
  district?: string;
  upazila?: string;
  status?: "Active" | "Inactive";
}

interface RecommendationResponse {
  success: boolean;
  message?: string;
  data?: {
    recommendation?: string;
    provider?: string;
  };
}

export default function SmartFarmingRecommendationPage() {
  const [farms, setFarms] = useState<Farm[]>([]);

  const [selectedFarmId, setSelectedFarmId] =
    useState("");

  const [problem, setProblem] = useState("");

  const [recommendation, setRecommendation] =
    useState("");

  const [provider, setProvider] = useState("");

  const [loadingFarms, setLoadingFarms] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const selectedFarm = useMemo(
    () =>
      farms.find(
        (farm) =>
          farm._id === selectedFarmId
      ) || null,
    [farms, selectedFarmId]
  );

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoadingFarms(true);
        setError("");

        const {
          data: tokenData,
          error: tokenError,
        } = await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            "Authentication required."
          );
        }

        const response = await fetch(
          `${API_URL}/farms`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result?.message ||
            "Unable to load farms."
          );
        }

        const farmData =
          result?.data?.farms ||
          result?.data ||
          [];

        const activeFarms =
          Array.isArray(farmData)
            ? farmData.filter(
              (farm: Farm) =>
                farm.status === "Active"
            )
            : [];

        setFarms(activeFarms);

        if (activeFarms.length > 0) {
          setSelectedFarmId(
            activeFarms[0]._id
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load farms."
        );
      } finally {
        setLoadingFarms(false);
      }
    };

    void fetchFarms();
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFarmId) {
      setError(
        "Please select a farm."
      );
      return;
    }

    if (!problem.trim()) {
      setError(
        "Please describe your farming problem."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setRecommendation("");
      setProvider("");

      const {
        data: tokenData,
      } = await authClient.token();

      const response = await fetch(
        `${API_URL}/ai/smart-farming-recommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            ...(tokenData?.token
              ? {
                Authorization: `Bearer ${tokenData.token}`,
              }
              : {}),
          },
          body: JSON.stringify({
            farmId: selectedFarmId,
            problem: problem.trim(),
          }),
        }
      );

      const result: RecommendationResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          "Unable to generate recommendation."
        );
      }

      const recommendationText =
        result.data?.recommendation;

      if (!recommendationText) {
        throw new Error(
          "No recommendation was returned."
        );
      }

      setRecommendation(
        recommendationText
      );

      setProvider(
        result.data?.provider || ""
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const location = selectedFarm
    ? [
      selectedFarm.upazila,
      selectedFarm.district,
      selectedFarm.division,
    ]
      .filter(Boolean)
      .join(", ")
    : "";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-[#477A5B]">
          AI Tools
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Smart Farming Recommendation
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Get practical AI-powered
          recommendations based on your
          farm and farming problem.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Select Farm
          </label>

          {loadingFarms ? (
            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading farms...
            </div>
          ) : (
            <select
              value={selectedFarmId}
              onChange={(event) => {
                setSelectedFarmId(
                  event.target.value
                );
                setRecommendation("");
                setProvider("");
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
            >
              {farms.length === 0 && (
                <option value="">
                  No active farm found
                </option>
              )}

              {farms.map((farm) => (
                <option
                  key={farm._id}
                  value={farm._id}
                >
                  {farm.name}
                  {farm.farmType
                    ? ` (${farm.farmType})`
                    : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedFarm && (
          <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-[#0B6B4A]" />

                  <h2 className="font-bold text-slate-900">
                    {selectedFarm.name}
                  </h2>
                </div>

                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {selectedFarm.farmType ||
                    "Farm"}
                </p>

                {location && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{location}</span>
                  </div>
                )}
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                Active
              </span>
            </div>
          </div>
        )}

        <div className="mt-5">
          <label
            htmlFor="problem"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Describe Your Problem
          </label>

          <textarea
            id="problem"
            value={problem}
            onChange={(event) =>
              setProblem(
                event.target.value
              )
            }
            rows={5}
            placeholder="Example: My mango tree leaves are turning yellow. What could be the problem?"
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#8CB89A] focus:ring-4 focus:ring-[#0B513D]/5"
          />
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            height: "48px",
            marginTop: "20px",
            border: "none",
            borderRadius: "12px",
            backgroundColor: submitting
              ? "#94A3B8"
              : "#075D46",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: 600,
            cursor: submitting
              ? "not-allowed"
              : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating Recommendation...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Get Recommendation
            </>
          )}
        </button>
      </form>

      {recommendation && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0B6B4A]">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recommendation
                  </h2>

                  <p className="text-xs text-slate-500">
                    AI-generated guidance
                    for{" "}
                    {selectedFarm?.name ||
                      "your farm"}
                  </p>
                </div>
              </div>

              {provider && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">
                  Powered by {provider}
                </span>
              )}
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="max-w-none text-sm leading-7 text-slate-700">
              <ReactMarkdown
                components={{
                  h1: ({
                    children,
                  }) => (
                    <h1 className="mb-3 mt-6 text-xl font-bold text-slate-900 first:mt-0">
                      {children}
                    </h1>
                  ),

                  h2: ({
                    children,
                  }) => (
                    <h2 className="mb-3 mt-6 text-lg font-bold text-slate-900 first:mt-0">
                      {children}
                    </h2>
                  ),

                  h3: ({
                    children,
                  }) => (
                    <h3 className="mb-2 mt-5 text-base font-bold text-slate-900 first:mt-0">
                      {children}
                    </h3>
                  ),

                  p: ({
                    children,
                  }) => (
                    <p className="mb-4 leading-7 last:mb-0">
                      {children}
                    </p>
                  ),

                  ul: ({
                    children,
                  }) => (
                    <ul className="mb-5 ml-5 list-disc space-y-2 marker:text-[#0B6B4A]">
                      {children}
                    </ul>
                  ),

                  ol: ({
                    children,
                  }) => (
                    <ol className="mb-5 ml-5 list-decimal space-y-2 marker:font-semibold marker:text-[#0B6B4A]">
                      {children}
                    </ol>
                  ),

                  li: ({
                    children,
                  }) => (
                    <li className="pl-1 leading-7">
                      {children}
                    </li>
                  ),

                  strong: ({
                    children,
                  }) => (
                    <strong className="font-semibold text-slate-900">
                      {children}
                    </strong>
                  ),
                }}
              >
                {recommendation}
              </ReactMarkdown>
            </div>

            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs leading-5 text-amber-800">
                AI recommendations are
                general farming guidance.
                For serious crop disease,
                pesticide, chemical or
                veterinary issues, consult
                a qualified agricultural
                expert.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}