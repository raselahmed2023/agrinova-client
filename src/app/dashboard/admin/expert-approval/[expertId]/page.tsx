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
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";

import {
  adminExpertService,
  type AdminExpert,
} from "@/services/admin.expert.service";

const specializationText = (
  value?:
    | string
    | string[]
) =>
  Array.isArray(value)
    ? value.join(", ")
    : value ||
      "Not specified";

export default function ExpertDetailsPage() {
  const params =
    useParams<{
      expertId:
        string;
    }>();

  const router =
    useRouter();

  const expertId =
    params.expertId;

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
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {
    if (!expertId) {
      return;
    }

    adminExpertService
      .getExpertById(
        expertId
      )
      .then(
        setExpert
      )
      .catch(
        (
          err
        ) =>
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load Expert."
          )
      )
      .finally(() =>
        setLoading(
          false
        )
      );
  }, [expertId]);

  const approve =
    async () => {
      if (
        !expert ||
        !window.confirm(
          `Approve ${expert.name} as an AgriNova Expert?`
        )
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        await adminExpertService.approveExpert(
          expert._id
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
            : "Approval failed."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const reject =
    async () => {
      if (!expert) {
        return;
      }

      const reason =
        window.prompt(
          "Enter the rejection reason:"
        );

      if (
        reason ===
        null
      ) {
        return;
      }

      if (
        !reason.trim()
      ) {
        window.alert(
          "A rejection reason is required."
        );

        return;
      }

      try {
        setActionLoading(
          true
        );

        await adminExpertService.rejectExpert(
          expert._id,
          reason.trim()
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
            : "Rejection failed."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-sm text-slate-500">
        Loading Expert
        application...
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">
          {error ||
            "Expert not found."}
        </p>

        <button
          onClick={() =>
            router.back()
          }
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <button
        onClick={() =>
          router.back()
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Approvals
      </button>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-blue-700">
              {expert.name
                ?.charAt(0)
                .toUpperCase() ||
                "E"}
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {
                  expert.name
                }
              </h1>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />

                {
                  expert.email
                }
              </p>
            </div>
          </div>

          {expert.status ===
            "PENDING" && (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  void approve()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />

                Approve
              </button>

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  void reject()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />

                Reject
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info
            label="Specialization"
            value={specializationText(
              expert.specialization
            )}
            icon={
              <Award className="h-4 w-4" />
            }
          />

          <Info
            label="Qualification"
            value={
              expert.qualification ||
              "Not specified"
            }
            icon={
              <BookOpen className="h-4 w-4" />
            }
          />

          <Info
            label="Experience"
            value={`${Number(
              expert.experienceYears ||
                0
            )} years`}
          />

          <Info
            label="Application Status"
            value={
              expert.status
            }
          />

          <Info
            label="Phone"
            value={
              expert.phone ||
              "Not provided"
            }
            icon={
              <Phone className="h-4 w-4" />
            }
          />

          <Info
            label="Submitted"
            value={
              expert.createdAt
                ? new Date(
                    expert.createdAt
                  ).toLocaleString()
                : "N/A"
            }
            icon={
              <Calendar className="h-4 w-4" />
            }
          />
        </div>

        {expert.rejectionReason && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
              Rejection Reason
            </p>

            <p className="mt-2 text-sm text-rose-800">
              {
                expert.rejectionReason
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        {icon}

        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}