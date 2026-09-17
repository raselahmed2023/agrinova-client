"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  AlertCircle,
  Eye,
  Loader2,
  RefreshCw,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";

import {
  adminService,
} from "@/services/admin.service";

import type {
  AdminExpert,
} from "@/services/admin.expert.service";

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

          setError(
            ""
          );

          /**
           * IMPORTANT:
           *
           * adminService.getPendingExperts()
           * already returns the array itself.
           */
          const result =
            await adminService
              .getPendingExperts();

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
          console.error(
            "Failed to load pending experts:",
            err
          );

          setExperts(
            []
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load expert applications."
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
  }, [
    fetchPendingExperts,
  ]);

  const handleApprove =
    async (
      expertId:
        string
    ) => {
      if (
        actionId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Approve this expert application?"
        );

      if (
        !confirmed
      ) {
        return;
      }

      try {
        setActionId(
          expertId
        );

        setError(
          ""
        );

        /**
         * No res.success check here.
         *
         * apiRequest throws automatically if request fails.
         */
        await adminService
          .approveExpert(
            expertId
          );

        setExperts(
          (
            current
          ) =>
            current.filter(
              (
                expert
              ) =>
                expert._id !==
                expertId
            )
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Expert approval failed."
        );
      } finally {
        setActionId(
          null
        );
      }
    };

  const handleReject =
    async (
      expertId:
        string
    ) => {
      if (
        actionId
      ) {
        return;
      }

      const reason =
        window.prompt(
          "Enter rejection reason:"
        );

      /**
       * Cancel button pressed.
       */
      if (
        reason ===
        null
      ) {
        return;
      }

      try {
        setActionId(
          expertId
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

        setExperts(
          (
            current
          ) =>
            current.filter(
              (
                expert
              ) =>
                expert._id !==
                expertId
            )
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Expert rejection failed."
        );
      } finally {
        setActionId(
          null
        );
      }
    };

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-5 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Expert Approval
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and verify pending expert applications.
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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
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

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">

          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

          <span>
            {
              error
            }
          </span>
        </div>
      )}

      {/* STATS */}

      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <p className="text-2xl font-black text-slate-950">
              {
                experts.length
              }
            </p>

            <p className="text-xs font-bold text-slate-500">
              Pending Expert Applications
            </p>
          </div>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left text-sm">

            <thead className="border-b border-slate-100 bg-slate-50/80">

              <tr className="text-xs font-black uppercase tracking-wide text-slate-500">

                <th className="px-6 py-4">
                  Expert
                </th>

                <th className="px-6 py-4">
                  Specialization
                </th>

                <th className="px-6 py-4">
                  Experience
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={
                      5
                    }
                    className="px-6 py-16"
                  >
                    <div className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-500">

                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />

                      Loading pending experts...
                    </div>
                  </td>
                </tr>
              ) : experts.length >
                0 ? (
                experts.map(
                  (
                    expert
                  ) => {
                    const busy =
                      actionId ===
                      expert._id;

                    const avatar =
                      expert.avatar ||
                      expert.image;

                    return (
                      <tr
                        key={
                          expert._id
                        }
                        className="transition hover:bg-slate-50/70"
                      >

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 font-black text-emerald-800">

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

                            <div className="min-w-0">

                              <p className="truncate font-black text-slate-900">
                                {
                                  expert.name
                                }
                              </p>

                              <p className="mt-0.5 truncate text-xs text-slate-500">
                                {
                                  expert.email
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {expert.specialization ||
                            "Not specified"}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {expert.experienceYears !=
                          null
                            ? `${expert.experienceYears} year${
                                expert.experienceYears ===
                                1
                                  ? ""
                                  : "s"
                              }`
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-200">
                            {
                              expert.status
                            }
                          </span>
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            <Link
                              href={`/dashboard/admin/expert-approval/${expert._id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                            >
                              <Eye className="h-3.5 w-3.5" />

                              View
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                void handleApprove(
                                  expert._id
                                )
                              }
                              disabled={
                                Boolean(
                                  actionId
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <UserCheck className="h-3.5 w-3.5" />
                              )}

                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleReject(
                                  expert._id
                                )
                              }
                              disabled={
                                Boolean(
                                  actionId
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle className="h-3.5 w-3.5" />

                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      5
                    }
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                      <UserCheck className="h-6 w-6 text-emerald-600" />
                    </div>

                    <p className="mt-3 font-black text-slate-800">
                      No pending applications
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      New expert applications will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}