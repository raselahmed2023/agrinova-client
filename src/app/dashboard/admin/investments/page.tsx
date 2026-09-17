"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  FileCheck2,
  HandCoins,
  ImageIcon,
  Loader2,
  MapPin,
  Percent,
  RefreshCw,
  Search,
  ShieldCheck,
  Sprout,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

import {
  investmentAdminService,
} from "@/services/admin.investment.service";

import type {
  InvestmentApplication,
  InvestmentProject,
} from "@/types/investment";

/* ============================================================
   TYPES
============================================================ */

type ActiveTab =
  | "projects"
  | "applications";

/* ============================================================
   HELPERS
============================================================ */

const money = (
  value: number
) =>
  `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD",
    {
      maximumFractionDigits:
        2,
    }
  )}`;

const humanize = (
  value: string
) =>
  value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");

const categoryLabel = (
  value: string
) =>
  value
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");

const dateText = (
  value?: string
) => {
  if (
    !value
  ) {
    return "N/A";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "N/A";
  }

  return date.toLocaleDateString(
    "en-BD",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  );
};

/* ============================================================
   PAGE
============================================================ */

export default function AdminInvestmentsPage() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<ActiveTab>(
      "projects"
    );

  /* ==========================================================
     PROJECTS
  ========================================================== */

  const [
    projects,
    setProjects,
  ] =
    useState<
      InvestmentProject[]
    >([]);

  const [
    projectSearch,
    setProjectSearch,
  ] =
    useState("");

  const [
    projectStatus,
    setProjectStatus,
  ] =
    useState("");

  const [
    selectedProject,
    setSelectedProject,
  ] =
    useState<
      InvestmentProject | null
    >(null);

  /* ==========================================================
     APPLICATIONS
  ========================================================== */

  const [
    applications,
    setApplications,
  ] =
    useState<
      InvestmentApplication[]
    >([]);

  const [
    applicationSearch,
    setApplicationSearch,
  ] =
    useState("");

  const [
    applicationStatus,
    setApplicationStatus,
  ] =
    useState("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState("");

  const [
    selectedApplication,
    setSelectedApplication,
  ] =
    useState<
      InvestmentApplication | null
    >(null);

  /* ==========================================================
     COMMON
  ========================================================== */

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

  const [
    success,
    setSuccess,
  ] =
    useState("");

  /* ==========================================================
     LOAD PROJECTS
  ========================================================== */

  const loadProjects =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const query =
            new URLSearchParams();

          query.set(
            "limit",
            "50"
          );

          if (
            projectStatus
          ) {
            query.set(
              "status",
              projectStatus
            );
          }

          if (
            projectSearch
              .trim()
          ) {
            query.set(
              "search",
              projectSearch.trim()
            );
          }

          const result =
            await investmentAdminService
              .getProjects(
                query.toString()
              );

          setProjects(
            Array.isArray(
              result.data
            )
              ? result.data
              : []
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load investment projects."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        projectSearch,
        projectStatus,
      ]
    );

  /* ==========================================================
     LOAD APPLICATIONS
  ========================================================== */

  const loadApplications =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const query =
            new URLSearchParams();

          query.set(
            "limit",
            "50"
          );

          if (
            applicationStatus
          ) {
            query.set(
              "status",
              applicationStatus
            );
          }

          if (
            paymentStatus
          ) {
            query.set(
              "paymentStatus",
              paymentStatus
            );
          }

          if (
            applicationSearch
              .trim()
          ) {
            query.set(
              "search",
              applicationSearch.trim()
            );
          }

          const result =
            await investmentAdminService
              .getApplications(
                query.toString()
              );

          setApplications(
            Array.isArray(
              result.data
            )
              ? result.data
              : []
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load investor applications."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        applicationSearch,
        applicationStatus,
        paymentStatus,
      ]
    );

  /* ==========================================================
     INITIAL / FILTER LOAD
  ========================================================== */

  useEffect(() => {
    if (
      activeTab ===
      "projects"
    ) {
      void loadProjects();
    } else {
      void loadApplications();
    }
  }, [
    activeTab,
    projectStatus,
    applicationStatus,
    paymentStatus,
  ]);

  /* ==========================================================
     COUNTS
  ========================================================== */

  const projectStats =
    useMemo(
      () => ({
        total:
          projects.length,

        pending:
          projects.filter(
            (
              project
            ) =>
              project.status ===
              "PENDING_REVIEW"
          ).length,

        approved:
          projects.filter(
            (
              project
            ) =>
              project.status ===
              "APPROVED"
          ).length,

        funded:
          projects.reduce(
            (
              total,
              project
            ) =>
              total +
              Number(
                project.fundedAmount ||
                  0
              ),
            0
          ),
      }),
      [
        projects,
      ]
    );

  /* ==========================================================
     PROJECT APPROVAL
  ========================================================== */

  const approveProject =
    async (
      project:
        InvestmentProject
    ) => {
      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .approveProject(
            project._id
          );

        setSelectedProject(
          null
        );

        setSuccess(
          "Investment project approved and published."
        );

        await loadProjects();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to approve project."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const rejectProject =
    async (
      project:
        InvestmentProject,

      reason:
        string
    ) => {
      if (
        !reason.trim()
      ) {
        setError(
          "A rejection reason is required."
        );

        return;
      }

      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .rejectProject(
            project._id,
            reason
          );

        setSelectedProject(
          null
        );

        setSuccess(
          "Investment project rejected."
        );

        await loadProjects();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to reject project."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /* ==========================================================
     APPLICATION APPROVAL
  ========================================================== */

  const approveApplication =
    async (
      item:
        InvestmentApplication
    ) => {
      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .approveApplication(
            item._id
          );

        setSelectedApplication(
          null
        );

        setSuccess(
          "Investment application approved. The investor can now complete payment."
        );

        await loadApplications();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to approve investment."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const rejectApplication =
    async (
      item:
        InvestmentApplication,

      reason:
        string
    ) => {
      if (
        !reason.trim()
      ) {
        setError(
          "A rejection reason is required."
        );

        return;
      }

      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .rejectApplication(
            item._id,
            reason
          );

        setSelectedApplication(
          null
        );

        setSuccess(
          "Investment application rejected."
        );

        await loadApplications();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to reject investment."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /* ==========================================================
     PAYMENT REVIEW
  ========================================================== */

  const confirmPayment =
    async (
      item:
        InvestmentApplication
    ) => {
      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .confirmBankPayment(
            item._id
          );

        setSelectedApplication(
          null
        );

        setSuccess(
          "Bank payment confirmed. The project's funded amount has been updated."
        );

        await Promise.all([
          loadApplications(),
          loadProjects(),
        ]);
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to confirm bank payment."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  const rejectPayment =
    async (
      item:
        InvestmentApplication,

      reason:
        string
    ) => {
      if (
        !reason.trim()
      ) {
        setError(
          "A payment rejection reason is required."
        );

        return;
      }

      try {
        setActionLoading(
          true
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        await investmentAdminService
          .rejectBankPayment(
            item._id,
            reason
          );

        setSelectedApplication(
          null
        );

        setSuccess(
          "Bank payment rejected."
        );

        await loadApplications();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to reject payment."
        );
      } finally {
        setActionLoading(
          false
        );
      }
    };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-5 lg:p-6">

      <div className="mx-auto w-full max-w-[1500px] space-y-5">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#063d2e] via-[#07543d] to-[#087356] px-5 py-5 text-white shadow-lg sm:px-6">

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-200">
                Admin Investment Control
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Investment Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/85">
                Review farmer projects,
                investor applications and
                verified investment payments.
              </p>
            </div>

            <button
              type="button"
              disabled={
                loading
              }
              onClick={() => {
                if (
                  activeTab ===
                  "projects"
                ) {
                  void loadProjects();
                } else {
                  void loadApplications();
                }
              }}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white hover:bg-white/20 disabled:opacity-50"
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
        </section>

        {/* ===================================================
            STATS
        =================================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <TopStat
            label="Projects"
            value={String(
              projectStats.total
            )}
            icon={
              <Sprout className="h-4 w-4" />
            }
          />

          <TopStat
            label="Pending Review"
            value={String(
              projectStats.pending
            )}
            icon={
              <Clock3 className="h-4 w-4" />
            }
          />

          <TopStat
            label="Approved"
            value={String(
              projectStats.approved
            )}
            icon={
              <CheckCircle2 className="h-4 w-4" />
            }
          />

          <TopStat
            label="Confirmed Funding"
            value={
              money(
                projectStats.funded
              )
            }
            icon={
              <WalletCards className="h-4 w-4" />
            }
            highlight
          />
        </section>

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">

            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            {error}
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">

            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

            {success}
          </div>
        )}

        {/* ===================================================
            TABS
        =================================================== */}

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "projects"
              )
            }
            className={`rounded-lg px-4 py-2.5 text-xs font-black transition ${
              activeTab ===
              "projects"
                ? "bg-[#07583f] text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Farmer Projects
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "applications"
              )
            }
            className={`rounded-lg px-4 py-2.5 text-xs font-black transition ${
              activeTab ===
              "applications"
                ? "bg-[#07583f] text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Investor Applications
          </button>
        </div>

        {/* ===================================================
            PROJECTS
        =================================================== */}

        {activeTab ===
          "projects" ? (
          <>
            <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_210px_auto]">

              <SearchInput
                value={
                  projectSearch
                }
                placeholder="Search project, farmer or location..."
                onChange={
                  setProjectSearch
                }
                onSearch={() =>
                  void loadProjects()
                }
              />

              <select
                value={
                  projectStatus
                }
                onChange={(
                  event
                ) =>
                  setProjectStatus(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
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

              <button
                type="button"
                onClick={() =>
                  void loadProjects()
                }
                className="rounded-xl bg-slate-950 px-5 py-2 text-xs font-black text-white"
              >
                Search
              </button>
            </section>

            <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px] text-left text-sm">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-400">

                      <th className="px-5 py-4">
                        Project
                      </th>

                      <th className="px-5 py-4">
                        Farmer
                      </th>

                      <th className="px-5 py-4">
                        Goal
                      </th>

                      <th className="px-5 py-4">
                        Term
                      </th>

                      <th className="px-5 py-4">
                        Projected ROI
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
                      <LoadingRow
                        columns={
                          7
                        }
                      />
                    ) : projects.length ===
                      0 ? (
                      <EmptyRow
                        columns={
                          7
                        }
                        message="No investment projects found."
                      />
                    ) : (
                      projects.map(
                        (
                          project
                        ) => (
                          <tr
                            key={
                              project._id
                            }
                            className="hover:bg-slate-50/60"
                          >

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-50">

                                  {project.projectImage ? (
                                    <img
                                      src={
                                        project.projectImage
                                      }
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Sprout className="h-5 w-5 text-emerald-500" />
                                  )}
                                </div>

                                <div>

                                  <p className="max-w-[260px] truncate font-black text-slate-900">
                                    {
                                      project.projectName
                                    }
                                  </p>

                                  <p className="mt-1 font-mono text-[9px] text-slate-400">
                                    {
                                      project.projectCode
                                    }
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">

                              <p className="font-bold text-slate-800">
                                {project.farmerName ||
                                  "Farmer"}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {project.district},{" "}
                                {project.division}
                              </p>
                            </td>

                            <td className="px-5 py-4 font-black text-slate-900">
                              {money(
                                project.requiredInvestment
                              )}
                            </td>

                            <td className="px-5 py-4 font-semibold text-slate-600">
                              {
                                project.durationMonths
                              }{" "}
                              months
                            </td>

                            <td className="px-5 py-4">

                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-black text-emerald-700">

                                <Percent className="h-3 w-3" />

                                {
                                  project.expectedReturnPercent
                                }%
                              </span>
                            </td>

                            <td className="px-5 py-4">

                              <StatusBadge
                                status={
                                  project.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedProject(
                                    project
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-200"
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
            </section>
          </>
        ) : (
          /* =================================================
             APPLICATIONS
          ================================================= */

          <>
            <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_190px_210px_auto]">

              <SearchInput
                value={
                  applicationSearch
                }
                placeholder="Search investor, project or application..."
                onChange={
                  setApplicationSearch
                }
                onSearch={() =>
                  void loadApplications()
                }
              />

              <select
                value={
                  applicationStatus
                }
                onChange={(
                  event
                ) =>
                  setApplicationStatus(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="">
                  All Applications
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

              <select
                value={
                  paymentStatus
                }
                onChange={(
                  event
                ) =>
                  setPaymentStatus(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="">
                  All Payments
                </option>

                <option value="NOT_STARTED">
                  Not Started
                </option>

                <option value="AWAITING_PAYMENT">
                  Awaiting Payment
                </option>

                <option value="PENDING_VERIFICATION">
                  Pending Verification
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="PAYMENT_REJECTED">
                  Payment Rejected
                </option>

                <option value="FAILED">
                  Failed
                </option>
              </select>

              <button
                type="button"
                onClick={() =>
                  void loadApplications()
                }
                className="rounded-xl bg-slate-950 px-5 py-2 text-xs font-black text-white"
              >
                Search
              </button>
            </section>

            <section className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1150px] text-left text-sm">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-400">

                      <th className="px-5 py-4">
                        Application
                      </th>

                      <th className="px-5 py-4">
                        Investor
                      </th>

                      <th className="px-5 py-4">
                        Investment
                      </th>

                      <th className="px-5 py-4">
                        ROI / Term
                      </th>

                      <th className="px-5 py-4">
                        Application
                      </th>

                      <th className="px-5 py-4">
                        Payment
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {loading ? (
                      <LoadingRow
                        columns={
                          7
                        }
                      />
                    ) : applications.length ===
                      0 ? (
                      <EmptyRow
                        columns={
                          7
                        }
                        message="No investor applications found."
                      />
                    ) : (
                      applications.map(
                        (
                          item
                        ) => (
                          <tr
                            key={
                              item._id
                            }
                            className="hover:bg-slate-50/60"
                          >

                            <td className="px-5 py-4">

                              <p className="font-mono text-[10px] font-black text-emerald-700">
                                {
                                  item.applicationCode
                                }
                              </p>

                              <p className="mt-1 max-w-[230px] truncate font-bold text-slate-800">
                                {
                                  item.projectName
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">

                              <p className="font-black text-slate-800">
                                {item.investorName ||
                                  "Investor"}
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {
                                  item.investorEmail
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4 font-black text-slate-950">
                              {money(
                                item.amount
                              )}
                            </td>

                            <td className="px-5 py-4">

                              <p className="font-black text-emerald-700">
                                {
                                  item.expectedReturnPercent ||
                                  0
                                }%
                              </p>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {
                                  item.durationMonths ||
                                  0
                                }{" "}
                                months
                              </p>
                            </td>

                            <td className="px-5 py-4">

                              <StatusBadge
                                status={
                                  item.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">

                              <PaymentStatusBadge
                                status={
                                  item.paymentStatus
                                }
                              />
                            </td>

                            <td className="px-5 py-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedApplication(
                                    item
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-200"
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
            </section>
          </>
        )}

        {/* ===================================================
            PROJECT MODAL
        =================================================== */}

        {selectedProject && (
          <ProjectReviewModal
            project={
              selectedProject
            }
            loading={
              actionLoading
            }
            onClose={() =>
              setSelectedProject(
                null
              )
            }
            onApprove={() =>
              void approveProject(
                selectedProject
              )
            }
            onReject={(
              reason
            ) =>
              void rejectProject(
                selectedProject,
                reason
              )
            }
          />
        )}

        {/* ===================================================
            APPLICATION MODAL
        =================================================== */}

        {selectedApplication && (
          <ApplicationReviewModal
            item={
              selectedApplication
            }
            loading={
              actionLoading
            }
            onClose={() =>
              setSelectedApplication(
                null
              )
            }
            onApprove={() =>
              void approveApplication(
                selectedApplication
              )
            }
            onReject={(
              reason
            ) =>
              void rejectApplication(
                selectedApplication,
                reason
              )
            }
            onConfirmPayment={() =>
              void confirmPayment(
                selectedApplication
              )
            }
            onRejectPayment={(
              reason
            ) =>
              void rejectPayment(
                selectedApplication,
                reason
              )
            }
          />
        )}
      </div>
    </main>
  );
}

/* ============================================================
   PROJECT REVIEW MODAL
============================================================ */

function ProjectReviewModal({
  project,
  loading,
  onClose,
  onApprove,
  onReject,
}: {
  project:
    InvestmentProject;

  loading:
    boolean;

  onClose:
    () => void;

  onApprove:
    () => void;

  onReject:
    (
      reason:
        string
    ) => void;
}) {
  const [
    rejectionReason,
    setRejectionReason,
  ] =
    useState("");

  const roi =
    Number(
      project.expectedReturnPercent ||
        0
    );

  const exampleProfit =
    Number(
      (
        project.minimumInvestment *
        (
          roi /
          100
        )
      ).toFixed(
        2
      )
    );

  const exampleTotal =
    project.minimumInvestment +
    exampleProfit;

  return (
    <ModalShell
      title="Project Review"
      subtitle={
        project.projectCode
      }
      onClose={
        onClose
      }
    >

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">

        {/* IMAGE */}

        <div>

          <div className="h-[190px] overflow-hidden rounded-2xl bg-emerald-50">

            {project.projectImage ? (
              <img
                src={
                  project.projectImage
                }
                alt={
                  project.projectName
                }
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">

                <ImageIcon className="h-10 w-10 text-emerald-300" />
              </div>
            )}
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-3">

            <p className="text-[8px] font-black uppercase text-slate-400">
              Farmer
            </p>

            <p className="mt-1 text-sm font-black text-slate-900">
              {project.farmerName ||
                "Farmer"}
            </p>

            <p className="mt-1 break-all text-[10px] text-slate-400">
              {
                project.farmerEmail
              }
            </p>
          </div>
        </div>

        {/* INFO */}

        <div>

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">

                {categoryLabel(
                  project.category
                )}
              </span>

              <h2 className="mt-2 text-xl font-black text-slate-950">
                {
                  project.projectName
                }
              </h2>
            </div>

            <StatusBadge
              status={
                project.status
              }
            />
          </div>

          {/* INVESTMENT TERMS */}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

            <ReviewStat
              label="Funding Goal"
              value={
                money(
                  project.requiredInvestment
                )
              }
            />

            <ReviewStat
              label="Minimum"
              value={
                money(
                  project.minimumInvestment
                )
              }
            />

            <ReviewStat
              label="Term"
              value={`${project.durationMonths} months`}
            />

            <ReviewStat
              label="Projected ROI"
              value={`${roi}%`}
              highlight
            />
          </div>

          {/* RETURN EXAMPLE */}

          <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">

            <div className="flex items-center gap-2">

              <Calculator className="h-4 w-4 text-emerald-700" />

              <p className="text-[9px] font-black uppercase text-emerald-700">
                Minimum Investment Return Example
              </p>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">

              <ReviewStat
                label="Investment"
                value={
                  money(
                    project.minimumInvestment
                  )
                }
                borderless
              />

              <ReviewStat
                label="Projected Profit"
                value={`+${money(
                  exampleProfit
                )}`}
                highlight
                borderless
              />

              <ReviewStat
                label="Projected Total"
                value={
                  money(
                    exampleTotal
                  )
                }
                borderless
              />
            </div>
          </div>

          {/* LOCATION */}

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3">

            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

            <p className="text-xs leading-5 text-slate-600">
              {[
                project.address,
                project.upazila,
                project.district,
                project.division,
              ]
                .filter(
                  Boolean
                )
                .join(
                  ", "
                )}
            </p>
          </div>

          {/* CONTENT */}

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div>

              <p className="text-xs font-black text-slate-800">
                Project Description
              </p>

              <p className="mt-1 whitespace-pre-line text-xs leading-6 text-slate-500">
                {
                  project.description
                }
              </p>
            </div>

            <div>

              <p className="text-xs font-black text-slate-800">
                Use of Investment
              </p>

              <p className="mt-1 whitespace-pre-line text-xs leading-6 text-slate-500">
                {
                  project.useOfFunds
                }
              </p>
            </div>
          </div>

          {project.supportingDocument && (
            <a
              href={
                project.supportingDocument
              }
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
            >
              <FileCheck2 className="h-4 w-4" />

              View Supporting Document
            </a>
          )}

          {/* ACTION */}

          {project.status ===
            "PENDING_REVIEW" && (
            <div className="mt-5 border-t border-slate-100 pt-4">

              <textarea
                rows={
                  2
                }
                value={
                  rejectionReason
                }
                onChange={(
                  event
                ) =>
                  setRejectionReason(
                    event.target.value
                  )
                }
                placeholder="Rejection reason — required only when rejecting"
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-500"
              />

              <div className="mt-3 flex flex-wrap justify-end gap-2">

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={() =>
                    onReject(
                      rejectionReason
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />

                  Reject
                </button>

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={
                    onApprove
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-[#07583f] px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  Approve & Publish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   APPLICATION REVIEW MODAL
============================================================ */

function ApplicationReviewModal({
  item,
  loading,
  onClose,
  onApprove,
  onReject,
  onConfirmPayment,
  onRejectPayment,
}: {
  item:
    InvestmentApplication;

  loading:
    boolean;

  onClose:
    () => void;

  onApprove:
    () => void;

  onReject:
    (
      reason:
        string
    ) => void;

  onConfirmPayment:
    () => void;

  onRejectPayment:
    (
      reason:
        string
    ) => void;
}) {
  const [
    showNid,
    setShowNid,
  ] =
    useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] =
    useState("");

  const [
    paymentReason,
    setPaymentReason,
  ] =
    useState("");

  const roi =
    Number(
      item.expectedReturnPercent ||
        0
    );

  const projectedProfit =
    Number(
      (
        item.amount *
        (
          roi /
          100
        )
      ).toFixed(
        2
      )
    );

  const projectedTotal =
    item.amount +
    projectedProfit;

  const canReviewPayment =
    item.status ===
      "APPROVED" &&
    item.paymentMethod ===
      "BANK_TRANSFER" &&
    item.paymentStatus ===
      "PENDING_VERIFICATION";

  return (
    <ModalShell
      title="Investor Application"
      subtitle={
        item.applicationCode
      }
      onClose={
        onClose
      }
    >

      {/* STATUS */}

      <div className="flex flex-wrap gap-2">

        <StatusBadge
          status={
            item.status
          }
        />

        <PaymentStatusBadge
          status={
            item.paymentStatus
          }
        />

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-600">

          {item.paymentMethod ===
          "STRIPE" ? (
            <CreditCard className="h-3 w-3" />
          ) : (
            <Banknote className="h-3 w-3" />
          )}

          {item.paymentMethod ===
          "STRIPE"
            ? "Stripe"
            : "Bank Transfer"}
        </span>
      </div>

      {/* PEOPLE */}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">

        <PersonCard
          label="Investor"
          name={
            item.investorName ||
            "Investor"
          }
          email={
            item.investorEmail ||
            ""
          }
        />

        <PersonCard
          label="Project Owner"
          name={
            item.projectOwnerName ||
            "Farmer"
          }
          email={
            item.projectOwnerEmail ||
            ""
          }
        />
      </div>

      {/* TERMS */}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

        <ReviewStat
          label="Investment"
          value={
            money(
              item.amount
            )
          }
        />

        <ReviewStat
          label="Projected ROI"
          value={`${roi}%`}
          highlight
        />

        <ReviewStat
          label="Term"
          value={`${item.durationMonths || 0} months`}
        />

        <ReviewStat
          label="Projected Profit"
          value={`+${money(
            projectedProfit
          )}`}
          highlight
        />
      </div>

      <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">

        <div className="flex items-center justify-between gap-4">

          <div>

            <p className="text-[9px] font-black uppercase text-emerald-700">
              Projected Total Return
            </p>

            <p className="mt-1 text-lg font-black text-emerald-950">
              {money(
                projectedTotal
              )}
            </p>
          </div>

          <div className="text-right">

            <p className="text-[9px] font-black uppercase text-slate-400">
              Project
            </p>

            <p className="mt-1 text-xs font-black text-slate-800">
              {
                item.projectName
              }
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ADMIN ONLY NID
      ===================================================== */}

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-start gap-2">

            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

            <div>

              <p className="text-xs font-black text-blue-900">
                Admin-only NID Verification
              </p>

              <p className="mt-1 text-[9px] text-blue-700">
                This value is not shown to
                the project owner or public users.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowNid(
                (
                  value
                ) =>
                  !value
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[9px] font-black text-blue-700 shadow-sm"
          >
            {showNid ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}

            {showNid
              ? "Hide"
              : "Reveal"}
          </button>
        </div>

        <p className="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-sm font-black tracking-wider text-slate-900">

          {showNid
            ? item.nidNumber ||
              "Unavailable"
            : "••••••••••••••"}
        </p>
      </div>

      {/* NOTE */}

      {item.note && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">

          <p className="text-[9px] font-black uppercase text-slate-400">
            Investor Note
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {
              item.note
            }
          </p>
        </div>
      )}

      {/* =====================================================
          BANK PAYMENT PROOF
      ===================================================== */}

      {item.paymentMethod ===
        "BANK_TRANSFER" &&
        (item.senderBankName ||
          item.transactionReference ||
          item.paymentProofUrl) && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">

            <div className="flex items-center gap-2">

              <Banknote className="h-4 w-4 text-emerald-700" />

              <h3 className="text-sm font-black text-slate-900">
                Bank Payment Verification
              </h3>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">

              <ReviewStat
                label="Sender Bank"
                value={
                  item.senderBankName ||
                  "N/A"
                }
              />

              <ReviewStat
                label="Transaction Reference"
                value={
                  item.transactionReference ||
                  "N/A"
                }
              />
            </div>

            {item.paymentProofUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                <img
                  src={
                    item.paymentProofUrl
                  }
                  alt="Bank transfer payment proof"
                  className="max-h-[280px] w-full object-contain"
                />

                <div className="border-t border-slate-100 bg-white px-3 py-2">

                  <a
                    href={
                      item.paymentProofUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[10px] font-black text-blue-700"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />

                    Open Full Payment Proof
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

      {/* =====================================================
          APPLICATION REVIEW ACTION
      ===================================================== */}

      {item.status ===
        "PENDING_REVIEW" && (
        <div className="mt-5 border-t border-slate-100 pt-4">

          <p className="text-xs font-black text-slate-800">
            Review Investment Request
          </p>

          <textarea
            rows={
              2
            }
            value={
              rejectionReason
            }
            onChange={(
              event
            ) =>
              setRejectionReason(
                event.target.value
              )
            }
            placeholder="Rejection reason — required only if rejecting"
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-500"
          />

          <div className="mt-3 flex justify-end gap-2">

            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                onReject(
                  rejectionReason
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />

              Reject
            </button>

            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                onApprove
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#07583f] px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BadgeCheck className="h-4 w-4" />
              )}

              Approve Application
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          PAYMENT REVIEW ACTION
      ===================================================== */}

      {canReviewPayment && (
        <div className="mt-5 border-t border-slate-100 pt-4">

          <div className="flex items-start gap-2">

            <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-700" />

            <div>

              <p className="text-xs font-black text-slate-900">
                Verify Bank Payment
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-500">
                Confirm only after checking
                the bank transaction against
                the uploaded receipt.
              </p>
            </div>
          </div>

          <textarea
            rows={
              2
            }
            value={
              paymentReason
            }
            onChange={(
              event
            ) =>
              setPaymentReason(
                event.target.value
              )
            }
            placeholder="Reason required only when rejecting the payment"
            className="mt-3 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-emerald-500"
          />

          <div className="mt-3 flex justify-end gap-2">

            <button
              type="button"
              disabled={
                loading
              }
              onClick={() =>
                onRejectPayment(
                  paymentReason
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />

              Reject Payment
            </button>

            <button
              type="button"
              disabled={
                loading
              }
              onClick={
                onConfirmPayment
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {item.paymentMethod ===
        "STRIPE" &&
        item.status ===
          "APPROVED" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50 p-3">

            <CreditCard className="mt-0.5 h-4 w-4 text-violet-700" />

            <p className="text-[10px] leading-5 text-violet-700">
              Stripe payments are verified
              through Stripe checkout and do
              not require manual Admin payment
              confirmation.
            </p>
          </div>
        )}

      <p className="mt-4 text-[9px] text-slate-400">
        Submitted{" "}
        {dateText(
          item.createdAt
        )}
      </p>
    </ModalShell>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title:
    string;

  subtitle:
    string;

  onClose:
    () => void;

  children:
    React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm">

      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>

            <h2 className="text-lg font-black text-slate-950">
              {title}
            </h2>

            <p className="mt-0.5 font-mono text-[9px] text-slate-400">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">

          {children}
        </div>
      </div>
    </div>
  );
}

function SearchInput({
  value,
  placeholder,
  onChange,
  onSearch,
}: {
  value:
    string;

  placeholder:
    string;

  onChange:
    (
      value:
        string
    ) => void;

  onSearch:
    () => void;
}) {
  return (
    <div className="relative">

      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <input
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        onKeyDown={(
          event
        ) => {
          if (
            event.key ===
            "Enter"
          ) {
            onSearch();
          }
        }}
        placeholder={
          placeholder
        }
        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function TopStat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label:
    string;

  value:
    string;

  icon:
    React.ReactNode;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        highlight
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >

      <div className="flex items-center justify-between">

        <p className="text-[9px] font-black uppercase text-slate-400">
          {label}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-2 text-xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function ReviewStat({
  label,
  value,
  highlight = false,
  borderless = false,
}: {
  label:
    string;

  value:
    string;

  highlight?:
    boolean;

  borderless?:
    boolean;
}) {
  return (
    <div
      className={
        borderless
          ? ""
          : `rounded-xl border p-3 ${
              highlight
                ? "border-emerald-100 bg-emerald-50"
                : "border-slate-100 bg-slate-50"
            }`
      }
    >

      <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 break-words text-xs font-black ${
          highlight
            ? "text-emerald-700"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PersonCard({
  label,
  name,
  email,
}: {
  label:
    string;

  name:
    string;

  email:
    string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex items-center gap-2">

        <UserRound className="h-3.5 w-3.5 text-emerald-700" />

        <p className="text-[8px] font-black uppercase text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-2 text-xs font-black text-slate-900">
        {name}
      </p>

      <p className="mt-1 break-all text-[9px] text-slate-400">
        {email}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    string;
}) {
  if (
    status ===
    "APPROVED"
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">

        <CheckCircle2 className="h-3 w-3" />

        Approved
      </span>
    );
  }

  if (
    status ===
    "REJECTED"
  ) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black text-red-700">

        <XCircle className="h-3 w-3" />

        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-700">

      <Clock3 className="h-3 w-3" />

      Pending
    </span>
  );
}

function PaymentStatusBadge({
  status,
}: {
  status:
    string;
}) {
  const style =
    status ===
    "PAID"
      ? "bg-emerald-50 text-emerald-700"
      : status ===
          "PENDING_VERIFICATION"
        ? "bg-blue-50 text-blue-700"
        : status ===
              "PAYMENT_REJECTED" ||
            status ===
              "FAILED"
          ? "bg-red-50 text-red-700"
          : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black ${style}`}
    >
      {humanize(
        status
      )}
    </span>
  );
}

function LoadingRow({
  columns,
}: {
  columns:
    number;
}) {
  return (
    <tr>

      <td
        colSpan={
          columns
        }
        className="px-5 py-14 text-center"
      >
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" />

        <p className="mt-2 text-xs font-semibold text-slate-400">
          Loading...
        </p>
      </td>
    </tr>
  );
}

function EmptyRow({
  columns,
  message,
}: {
  columns:
    number;

  message:
    string;
}) {
  return (
    <tr>

      <td
        colSpan={
          columns
        }
        className="px-5 py-14 text-center text-xs font-semibold text-slate-400"
      >
        {message}
      </td>
    </tr>
  );
}