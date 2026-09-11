"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Clock3,
  Eye,
  HandCoins,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";

import {
  investmentAdminService,
} from "@/services/admin.investment.service";

import type {
  InvestmentProject,
} from "@/types/investment";

const formatMoney =
  (value: number) =>
    `৳${Number(value || 0).toLocaleString(
      "en-BD"
    )}`;

const categoryLabel =
  (value: string) =>
    value
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

export default function AdminInvestmentsPage() {
  const [
    projects,
    setProjects,
  ] =
    useState<InvestmentProject[]>(
      []
    );

  const [
    selected,
    setSelected,
  ] =
    useState<InvestmentProject | null>(
      null
    );

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
    status,
    setStatus,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const loadProjects =
    async () => {
      try {
        setLoading(true);

        const query =
          new URLSearchParams();

        query.set(
          "limit",
          "50"
        );

        if (status) {
          query.set(
            "status",
            status
          );
        }

        if (search) {
          query.set(
            "search",
            search
          );
        }

        const result =
          await investmentAdminService.getProjects(
            query.toString()
          );

        setProjects(
          result.data
        );

        if (
          selected
        ) {
          const refreshed =
            result.data.find(
              (item) =>
                item._id ===
                selected._id
            );

          setSelected(
            refreshed ||
              null
          );
        }
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProjects();
  }, [status]);

  const handleApprove =
    async (
      projectId: string
    ) => {
      if (
        !confirm(
          "Approve this investment project?"
        )
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        await investmentAdminService.approveProject(
          projectId
        );

        setSelected(
          null
        );

        await loadProjects();
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Approval failed"
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const handleReject =
    async (
      projectId: string
    ) => {
      const reason =
        prompt(
          "Enter rejection reason:"
        );

      if (
        !reason?.trim()
      ) {
        return;
      }

      try {
        setActionLoading(
          true
        );

        await investmentAdminService.rejectProject(
          projectId,
          reason
        );

        setSelected(
          null
        );

        await loadProjects();
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Rejection failed"
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <HandCoins className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-950">
                Investment Projects
              </h1>

              <p className="text-sm text-slate-500">
                Review farmer investment project submissions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4">
            <Search className="h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  loadProjects();
                }
              }}
              placeholder="Search project, farmer or district..."
              className="w-full py-2.5 text-sm outline-none"
            />

            <button
              type="button"
              onClick={
                loadProjects
              }
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Search
            </button>
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
          >
            <option value="">
              All Status
            </option>

            <option value="PENDING_REVIEW">
              Pending Review
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">
                    Project
                  </th>

                  <th className="px-5 py-4">
                    Farmer
                  </th>

                  <th className="px-5 py-4">
                    Investment
                  </th>

                  <th className="px-5 py-4">
                    Location
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      Loading projects...
                    </td>
                  </tr>
                ) : projects.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No investment projects found.
                    </td>
                  </tr>
                ) : (
                  projects.map(
                    (project) => (
                      <tr
                        key={
                          project._id
                        }
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {project.projectImage ? (
                              <img
                                src={
                                  project.projectImage
                                }
                                alt=""
                                className="h-12 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <HandCoins className="h-5 w-5" />
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-900">
                                {
                                  project.projectName
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                {
                                  project.projectCode
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {
                              project.farmerName ||
                              "N/A"
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            {
                              project.farmerEmail
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {formatMoney(
                            project.requiredInvestment
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {
                            project.district
                          }
                          ,{" "}
                          {
                            project.division
                          }
                        </td>

                        <td className="px-5 py-4">
                          {project.status ===
                          "APPROVED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approved
                            </span>
                          ) : project.status ===
                            "REJECTED" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <XCircle className="h-3.5 w-3.5" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              <Clock3 className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelected(
                                project
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-950">
                  Project Review
                </h2>

                <p className="text-xs text-slate-400">
                  {
                    selected.projectCode
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelected(
                    null
                  )
                }
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[320px_1fr]">
              <div>
                {selected.projectImage ? (
                  <img
                    src={
                      selected.projectImage
                    }
                    alt={
                      selected.projectName
                    }
                    className="h-64 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <HandCoins className="h-16 w-16" />
                  </div>
                )}

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Farmer
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {
                      selected.farmerName ||
                      "N/A"
                    }
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      selected.farmerEmail
                    }
                  </p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {categoryLabel(
                        selected.category
                      )}
                    </span>

                    <h3 className="mt-3 text-2xl font-bold text-slate-950">
                      {
                        selected.projectName
                      }
                    </h3>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    {
                      selected.status
                    }
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Info
                    label="Required Investment"
                    value={formatMoney(
                      selected.requiredInvestment
                    )}
                  />

                  <Info
                    label="Own Contribution"
                    value={formatMoney(
                      selected.ownContribution
                    )}
                  />

                  <Info
                    label="Duration"
                    value={
                      selected.duration
                    }
                  />

                  <Info
                    label="Expected Return"
                    value={
                      selected.expectedReturn
                    }
                  />

                  <Info
                    label="Estimated Revenue"
                    value={formatMoney(
                      selected.estimatedRevenue
                    )}
                  />

                  <Info
                    label="Estimated Cost"
                    value={formatMoney(
                      selected.estimatedCost
                    )}
                  />

                  <Info
                    label="Estimated Profit"
                    value={formatMoney(
                      selected.estimatedProfit
                    )}
                  />

                  <Info
                    label="Profit Sharing"
                    value={
                      selected.profitSharing
                    }
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" />
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {
                      selected.address
                    }
                    ,{" "}
                    {
                      selected.upazila
                    }
                    ,{" "}
                    {
                      selected.district
                    }
                    ,{" "}
                    {
                      selected.division
                    }
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-slate-800">
                    Description
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-500">
                    {
                      selected.description
                    }
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Info
                    label="NID Number"
                    value={
                      selected.nidNumber ||
                      "Not provided"
                    }
                  />

                  <Info
                    label="Submitted"
                    value={new Date(
                      selected.createdAt
                    ).toLocaleDateString(
                      "en-BD"
                    )}
                  />
                </div>

                {selected.adminNote && (
                  <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                    <strong>
                      Admin Note:
                    </strong>{" "}
                    {
                      selected.adminNote
                    }
                  </div>
                )}

                {selected.status ===
                  "PENDING_REVIEW" && (
                  <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        handleApprove(
                          selected._id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Project
                    </button>

                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        handleReject(
                          selected._id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}