"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Loader2,
  LogIn,
  PackageCheck,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useSession,
} from "@/lib/auth-client";

import {
  type SupplyRequest,
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
    "Accepted — AgriNova approved the submission. Follow the instructions provided before product handover.",

  REJECTED:
    "Rejected — this submission was not accepted. Check the AgriNova note below for the reason.",

  RECEIVED:
    "Received — AgriNova has received the approved produce at the selected branch.",

  COMPLETED:
    "Completed — the approved supply transaction has been completed.",
};

const statusLabel: Record<
  SupplyRequest["status"],
  string
> = {
  SUBMITTED: "Submitted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  RECEIVED: "Received",
  COMPLETED: "Completed",
};

const ACTIVE_FLOW: Array<{
  status:
    | "SUBMITTED"
    | "ACCEPTED"
    | "RECEIVED"
    | "COMPLETED";
  label: string;
}> = [
  {
    status: "SUBMITTED",
    label: "Submitted",
  },
  {
    status: "ACCEPTED",
    label: "Accepted",
  },
  {
    status: "RECEIVED",
    label: "Received",
  },
  {
    status: "COMPLETED",
    label: "Completed",
  },
];

function formatBranch(
  value?: string
) {
  if (!value) {
    return "Not available";
  }

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        character
      ) =>
        character.toUpperCase()
    );
}

export default function SubmissionStatusFlow({
  onSubmitClick,
}: SubmissionStatusFlowProps) {
  const {
    data:
      session,
    isPending,
  } =
    useSession();

  const [
    trackingCode,
    setTrackingCode,
  ] =
    useState("");

  const [
    request,
    setRequest,
  ] =
    useState<
      SupplyRequest | null
    >(
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

  const role =
    String(
      session?.user?.role ||
        ""
    ).toUpperCase();

  const isFarmer =
    role ===
    "FARMER";

  const normalizedTrackingCode =
    useMemo(
      () =>
        trackingCode
          .trim()
          .toUpperCase(),
      [
        trackingCode,
      ]
    );

  const handleTrack =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !session?.user
      ) {
        setError(
          "Please sign in to your Farmer account to track a supply submission."
        );

        return;
      }

      if (
        !isFarmer
      ) {
        setError(
          "Supply tracking is available to Farmer accounts only."
        );

        return;
      }

      if (
        !normalizedTrackingCode
      ) {
        setError(
          "Enter your tracking ID."
        );

        return;
      }

      if (
        !/^AGN-[A-F0-9]{8}$/.test(
          normalizedTrackingCode
        )
      ) {
        setError(
          "Enter a valid tracking ID in the format AGN-XXXXXXXX."
        );

        return;
      }

      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        setRequest(
          null
        );

        const response =
          await trackSupplyRequest(
            normalizedTrackingCode
          );

        setRequest(
          response.data
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to track this submission."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  const currentFlowIndex =
    request &&
    request.status !==
      "REJECTED"
      ? ACTIVE_FLOW.findIndex(
          (
            item
          ) =>
            item.status ===
            request.status
        )
      : -1;

  return (
    <section className="w-full bg-[#f6f8f7] px-4 py-16 sm:px-6 md:px-8 lg:py-20">
      <div className="mx-auto max-w-[1400px]">

        {/* =====================================================
            SECTION HEADING
        ====================================================== */}

        <div className="mx-auto mb-9 max-w-3xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
            Farmer Supply Support
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-[-0.035em] text-slate-950 md:text-4xl">
            Submit Product or Track a Submission
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =====================================================
              SUBMISSION CTA
          ====================================================== */}

          <div className="relative overflow-hidden rounded-[28px] bg-[#053225] p-6 text-white shadow-[0_22px_60px_-38px_rgba(5,50,37,0.7)] sm:p-8 lg:p-9">

            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-200 ring-1 ring-white/10">
                <ClipboardList className="h-5 w-5" />
              </div>

              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-200">
                Farmer Submission
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Have product ready for the supply network?
              </h3>


              <div className="mt-6 space-y-3">
                <FeatureLine
                  icon={
                    <ShieldCheck className="h-4 w-4" />
                  }
                  text="Farmer account required"
                />

                <FeatureLine
                  icon={
                    <PackageCheck className="h-4 w-4" />
                  }
                  text="Submission reviewed before acceptance"
                />

                <FeatureLine
                  icon={
                    <Truck className="h-4 w-4" />
                  }
                  text="Track progress with your AgriNova tracking ID"
                />
              </div>

              <button
                type="button"
                onClick={
                  onSubmitClick
                }
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#b2f2bb] px-5 text-sm font-black text-[#053225] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#9eeaa8]"
              >
                Submit Produce

                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* =====================================================
              TRACKING
          ====================================================== */}

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_-42px_rgba(15,23,42,0.4)] sm:p-7 lg:p-8">

            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Search className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  Submission Tracking
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-950">
                  Track Your Submission
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Use the tracking ID shown after your successful product
                  submission.
                </p>
              </div>
            </div>

            {/* SESSION STATE */}

            {isPending ? (
              <div className="mt-6 flex min-h-[150px] items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                <div className="text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" />

                  <p className="mt-2 text-xs font-bold text-slate-500">
                    Checking your account...
                  </p>
                </div>
              </div>
            ) : !session?.user ? (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">

                <div className="flex items-start gap-3">
                  <LogIn className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Sign in to track your submission
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Supply requests are linked to Farmer accounts for secure
                      tracking.
                    </p>
                  </div>
                </div>

                <Link
                  href="/login?redirect=%2Fsupport"
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#053225] px-4 text-xs font-black text-white transition hover:bg-[#032018]"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login to Track
                </Link>
              </div>
            ) : !isFarmer ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-black text-amber-900">
                  Farmer account required
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Supply submissions and tracking are available to Farmer
                  accounts only.
                </p>
              </div>
            ) : (
              <>
                <form
                  onSubmit={
                    handleTrack
                  }
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="supply-tracking-code"
                      className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-slate-500"
                    >
                      Tracking ID
                    </label>

                    <input
                      id="supply-tracking-code"
                      value={
                        trackingCode
                      }
                      onChange={(
                        event
                      ) => {
                        setTrackingCode(
                          event.target.value
                            .toUpperCase()
                            .replace(
                              /\s/g,
                              ""
                            )
                        );

                        if (
                          error
                        ) {
                          setError(
                            ""
                          );
                        }

                        if (
                          request
                        ) {
                          setRequest(
                            null
                          );
                        }
                      }}
                      placeholder="AGN-XXXXXXXX"
                      maxLength={
                        12
                      }
                      autoComplete="off"
                      spellCheck={
                        false
                      }
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-mono text-sm font-bold uppercase tracking-wide text-slate-900 outline-none transition placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      loading
                    }
                    className="mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#053225] px-5 text-sm font-black text-white transition hover:bg-[#032018] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}

                    {loading
                      ? "Checking..."
                      : "Track"}
                  </button>
                </form>

                <p className="mt-2 text-[10px] leading-5 text-slate-400">
                  Example: AGN-1A2B3C4D. Tracking IDs are issued after a
                  successful submission.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold leading-5 text-rose-700">
                    {error}
                  </div>
                )}

                {request && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">

                    {/* RESULT HEADER */}

                    <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                          {request.trackingCode}
                        </p>

                        <h4 className="mt-1 truncate text-base font-black text-slate-950">
                          {request.productName}
                        </h4>
                      </div>

                      <StatusBadge
                        status={
                          request.status
                        }
                      />
                    </div>

                    <div className="p-4 sm:p-5">

                      <p className="text-sm leading-6 text-slate-600">
                        {
                          statusCopy[
                            request.status
                          ] ||
                          "AgriNova is processing this submission."
                        }
                      </p>

                      {/* PROGRESS */}

                      {request.status !==
                        "REJECTED" && (
                        <div className="mt-5">
                          <p className="mb-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Supply Progress
                          </p>

                          <div className="grid grid-cols-4 gap-1.5">
                            {ACTIVE_FLOW.map(
                              (
                                item,
                                index
                              ) => {
                                const done =
                                  index <=
                                  currentFlowIndex;

                                return (
                                  <div
                                    key={
                                      item.status
                                    }
                                    className="min-w-0"
                                  >
                                    <div
                                      className={`h-1.5 rounded-full ${
                                        done
                                          ? "bg-emerald-600"
                                          : "bg-slate-200"
                                      }`}
                                    />

                                    <p
                                      className={`mt-1 truncate text-[8px] font-bold ${
                                        done
                                          ? "text-emerald-700"
                                          : "text-slate-400"
                                      }`}
                                    >
                                      {item.label}
                                    </p>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {/* DETAILS */}

                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        <DetailItem
                          label="Status"
                          value={
                            statusLabel[
                              request.status
                            ]
                          }
                        />

                        <DetailItem
                          label="AgriNova Branch"
                          value={
                            formatBranch(
                              request.branch
                            )
                          }
                        />

                        <DetailItem
                          label="Quantity"
                          value={`${request.quantity} ${request.unit}`}
                        />

                        <DetailItem
                          label="Product Location"
                          value={[
                            request.upazila,
                            request.district,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            )}
                        />
                      </div>

                      {request.adminNote && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                            AgriNova Note
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-700">
                            {
                              request.adminNote
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function FeatureLine({
  icon,
  text,
}: {
  icon:
    React.ReactNode;

  text:
    string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-semibold text-white/80">
      <span className="text-emerald-200">
        {icon}
      </span>

      {text}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-slate-800">
        {value ||
          "Not available"}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    SupplyRequest["status"];
}) {
  if (
    status ===
    "REJECTED"
  ) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-rose-700">
        <ShieldCheck className="h-3 w-3" />
        Rejected
      </span>
    );
  }

  if (
    status ===
    "COMPLETED"
  ) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-emerald-800">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }

  if (
    status ===
    "RECEIVED"
  ) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-blue-700">
        <PackageCheck className="h-3 w-3" />
        Received
      </span>
    );
  }

  if (
    status ===
    "ACCEPTED"
  ) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Accepted
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-amber-700">
      <Clock3 className="h-3 w-3" />
      Submitted
    </span>
  );
}
