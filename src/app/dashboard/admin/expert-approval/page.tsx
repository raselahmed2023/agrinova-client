"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  RefreshCw,
  UserCheck,
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
) => {
  if (
    Array.isArray(value)
  ) {
    return (
      value.join(", ") ||
      "N/A"
    );
  }

  return (
    value ||
    "N/A"
  );
};

export default function ExpertApprovalPage() {
  const [
    experts,
    setExperts,
  ] =
    useState<
      AdminExpert[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    actionId,
    setActionId,
  ] =
    useState<
      string | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState("");

  const fetchPendingExperts =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const result =
            await adminExpertService.getPendingExperts();

          setExperts(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load pending experts."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void fetchPendingExperts();
  }, [fetchPendingExperts]);

  const handleApprove =
    async (
      expert:
        AdminExpert
    ) => {
      if (
        !window.confirm(
          `Approve ${expert.name} as a verified AgriNova Expert?`
        )
      ) {
        return;
      }

      try {
        setActionId(
          expert._id
        );

        setError("");

        await adminExpertService.approveExpert(
          expert._id
        );

        await fetchPendingExperts();
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
        setActionId(
          null
        );
      }
    };

  const handleReject =
    async (
      expert:
        AdminExpert
    ) => {
      const reason =
        window.prompt(
          `Why are you rejecting ${expert.name}'s Expert application?`
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
        setActionId(
          expert._id
        );

        setError("");

        await adminExpertService.rejectExpert(
          expert._id,
          reason.trim()
        );

        await fetchPendingExperts();
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
        setActionId(
          null
        );
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Expert Approval
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review pending
            applications before
            Experts can access Expert
            features.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void fetchPendingExperts()
          }
          disabled={
            loading
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">
                  Applicant
                </th>

                <th className="px-6 py-3">
                  Specialization
                </th>

                <th className="px-6 py-3">
                  Experience
                </th>

                <th className="px-6 py-3">
                  Status
                </th>

                <th className="px-6 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading pending
                    requests...
                  </td>
                </tr>
              ) : experts.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No pending Expert
                    applications.
                  </td>
                </tr>
              ) : (
                experts.map(
                  (
                    expert
                  ) => (
                    <tr
                      key={
                        expert._id
                      }
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {
                            expert.name
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {
                            expert.email
                          }
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {specializationText(
                          expert.specialization
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {Number(
                          expert.experienceYears ||
                            0
                        )}{" "}
                        year
                        {Number(
                          expert.experienceYears ||
                            0
                        ) ===
                        1
                          ? ""
                          : "s"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          {
                            expert.status
                          }
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link
                            href={`/dashboard/admin/expert-approval/${expert._id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            <Eye className="h-3.5 w-3.5" />

                            View
                          </Link>

                          <button
                            type="button"
                            disabled={
                              actionId ===
                              expert._id
                            }
                            onClick={() =>
                              void handleApprove(
                                expert
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                          >
                            <UserCheck className="h-3.5 w-3.5" />

                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={
                              actionId ===
                              expert._id
                            }
                            onClick={() =>
                              void handleReject(
                                expert
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />

                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}