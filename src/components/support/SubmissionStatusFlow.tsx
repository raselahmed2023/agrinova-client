"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";

import {
  SupplyRequest,
  trackSupplyRequest,
} from "@/services/supply-chain.service";

interface SubmissionStatusFlowProps {
  onSubmitClick?: () => void;
}

const statusCopy: Record<
  SupplyRequest["status"],
  string
> = {
  SUBMITTED:
    "Submitted — AgriNova is reviewing your product details.",

  ACCEPTED:
    "Accepted — AgriNova approved the submission. Follow the branch instructions before delivery.",

  REJECTED:
    "Rejected — the submission was not accepted. Check the note below for the reason.",

  RECEIVED:
    "Received — AgriNova has received the product at the selected branch.",

  COMPLETED:
    "Completed — this supply request has been completed.",
};

export default function SubmissionStatusFlow({
  onSubmitClick,
}: SubmissionStatusFlowProps) {
  const [
    trackingCode,
    setTrackingCode,
  ] = useState("");

  const [
    request,
    setRequest,
  ] =
    useState<SupplyRequest | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const saved =
      localStorage.getItem(
        "agrinova:lastSupplyTrackingCode"
      );

    if (saved) {
      setTrackingCode(
        saved
      );
    }
  }, []);

  const handleTrack =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      const code =
        trackingCode
          .trim()
          .toUpperCase();

      if (!code) {
        setError(
          "Enter your tracking code."
        );

        return;
      }

      try {
        setLoading(true);

        setError("");

        setRequest(
          null
        );

        const response =
          await trackSupplyRequest(
            code
          );

        setRequest(
          response.data
        );

        if (
          typeof window !==
          "undefined"
        ) {
          localStorage.setItem(
            "agrinova:lastSupplyTrackingCode",
            response.data
              .trackingCode
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to track this request."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="w-full bg-[#f8f9fa] px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-[#053225] px-6 py-12 text-center shadow-lg md:px-10 md:py-14">
          <h2 className="text-2xl font-bold text-white md:text-4xl">
            Ready to Sell Your Product?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm font-normal leading-relaxed text-gray-300 md:text-base">
            Submit your product details
            and let AgriNova help connect
            you with suitable buyers.
          </p>

          <button
            type="button"
            onClick={
              onSubmitClick
            }
            className="mt-8 cursor-pointer rounded-md bg-[#b2f2bb] px-6 py-3 text-sm font-semibold text-[#053225] shadow-sm transition-colors duration-200 hover:bg-[#9eeaa8] md:text-base"
          >
            Submit Your Product
          </button>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Search className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Track Your Submission
              </h3>

              <p className="text-sm text-slate-500">
                Use the AGN tracking
                code received after
                submission.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handleTrack
            }
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={
                trackingCode
              }
              onChange={(
                event
              ) =>
                setTrackingCode(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="AGN-XXXXXXXX"
              maxLength={12}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#053225] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#032018] disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              Track
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {request && (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    {
                      request.trackingCode
                    }
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {
                      request.productName
                    }
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      statusCopy[
                        request.status
                      ]
                    }
                  </p>

                  <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      {
                        request.status
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Branch:
                      </span>{" "}
                      {
                        request.branch
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Quantity:
                      </span>{" "}
                      {
                        request.quantity
                      }{" "}
                      {
                        request.unit
                      }
                    </p>

                    <p>
                      <span className="font-semibold">
                        Location:
                      </span>{" "}
                      {
                        request.upazila
                      }
                      ,{" "}
                      {
                        request.district
                      }
                    </p>
                  </div>

                  {request.adminNote && (
                    <div className="mt-4 rounded-xl bg-white p-3 text-sm text-slate-700">
                      <span className="font-semibold">
                        AgriNova note:
                      </span>{" "}
                      {
                        request.adminNote
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}