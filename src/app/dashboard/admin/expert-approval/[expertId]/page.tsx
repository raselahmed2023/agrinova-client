"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  adminService,
} from "@/services/admin.service";

import type {
  AdminExpert,
} from "@/services/admin.expert.service";

export default function ExpertDetailsPage() {
  const params =
    useParams();

  const router =
    useRouter();

  const expertId =
    String(
      params.expertId ||
      ""
    );

  const [
    expert,
    setExpert,
  ] =
    useState<
      AdminExpert | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] =
    useState<
      "approve" |
      "reject" |
      null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (
      !expertId
    ) {
      return;
    }

    let active =
      true;

    const load =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          /**
           * getExpertById returns Expert directly,
           * NOT { success, data }.
           */
          const result =
            await adminService
              .getExpertById(
                expertId
              );

          if (
            active
          ) {
            setExpert(
              result
            );
          }
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err instanceof
                Error
                ? err.message
                : "Unable to load expert."
            );
          }
        } finally {
          if (
            active
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void load();

    return () => {
      active =
        false;
    };
  }, [
    expertId,
  ]);

  const handleApprove =
    async () => {
      if (
        actionLoading
      ) {
        return;
      }

      if (
        !window.confirm(
          "Approve this expert application?"
        )
      ) {
        return;
      }

      try {
        setActionLoading(
          "approve"
        );

        setError(
          ""
        );

        await adminService
          .approveExpert(
            expertId
          );

        router.push(
          "/dashboard/admin/expert-approval"
        );

        router.refresh();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Failed to approve expert."
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };

  const handleReject =
    async () => {
      if (
        actionLoading
      ) {
        return;
      }

      const reason =
        window.prompt(
          "Enter rejection reason:"
        );

      if (
        reason ===
        null
      ) {
        return;
      }

      try {
        setActionLoading(
          "reject"
        );

        setError(
          ""
        );

        await adminService
          .rejectExpert(
            expertId,
            reason.trim() ||
              undefined
          );

        router.push(
          "/dashboard/admin/expert-approval"
        );

        router.refresh();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Failed to reject expert."
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center">

        <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />

          Loading expert profile...
        </div>
      </div>
    );
  }

  if (
    !expert
  ) {
    return (
      <div className="mx-auto max-w-3xl p-8">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-bold text-red-700">
            {error ||
              "Expert not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const avatar =
    expert.avatar ||
    expert.image;

  const isPending =
    String(
      expert.status
    ).toUpperCase() ===
    "PENDING";

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-5 sm:p-6 lg:p-8">

      <button
        type="button"
        onClick={() =>
          router.push(
            "/dashboard/admin/expert-approval"
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Approvals
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {
            error
          }
        </div>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="h-28 bg-gradient-to-r from-[#063d2e] to-[#0b644b]" />

        <div className="px-6 pb-7 sm:px-8">

          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex items-end gap-4">

              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[5px] border-white bg-emerald-100 text-3xl font-black text-emerald-800 shadow-md">

                {avatar ? (
                  <img
                    src={
                      avatar
                    }
                    alt={
                      expert.name
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  expert.name
                    ?.charAt(
                      0
                    )
                    ?.toUpperCase() ||
                  "E"
                )}
              </div>

              <div className="pb-1">

                <h1 className="text-2xl font-black text-slate-950">
                  {
                    expert.name
                  }
                </h1>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />

                  {
                    expert.email
                  }
                </p>
              </div>
            </div>

            {isPending && (
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    void handleApprove()
                  }
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {actionLoading ===
                  "approve" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}

                  Approve
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleReject()
                  }
                  disabled={
                    Boolean(
                      actionLoading
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {actionLoading ===
                  "reject" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}

                  Reject
                </button>
              </div>
            )}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">

            <InfoCard
              icon={
                <Award className="h-4 w-4" />
              }
              label="Specialization"
              value={
                expert.specialization ||
                "Not specified"
              }
            />

            <InfoCard
              icon={
                <BookOpen className="h-4 w-4" />
              }
              label="Qualification"
              value={
                expert.qualification ||
                "Not specified"
              }
            />

            <InfoCard
              icon={
                <UserRound className="h-4 w-4" />
              }
              label="Experience"
              value={
                expert.experienceYears !=
                null
                  ? `${expert.experienceYears} year${
                      expert.experienceYears ===
                      1
                        ? ""
                        : "s"
                    }`
                  : "Not specified"
              }
            />

            <InfoCard
              icon={
                <Phone className="h-4 w-4" />
              }
              label="Phone"
              value={
                expert.phone ||
                "Not provided"
              }
            />

            <InfoCard
              icon={
                <CheckCircle className="h-4 w-4" />
              }
              label="Application Status"
              value={
                expert.status
              }
            />

            <InfoCard
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Applied"
              value={
                expert.createdAt
                  ? new Date(
                      expert.createdAt
                    ).toLocaleDateString()
                  : "Unknown"
              }
            />
          </div>

          {expert.rejectionReason && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">

              <p className="text-xs font-black uppercase tracking-wide text-rose-600">
                Rejection Reason
              </p>

              <p className="mt-1 text-sm text-rose-800">
                {
                  expert.rejectionReason
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">

        <span className="text-emerald-700">
          {
            icon
          }
        </span>

        {
          label
        }
      </div>

      <p className="mt-2 font-bold text-slate-800">
        {
          value
        }
      </p>
    </div>
  );
}