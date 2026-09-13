"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  Loader2,
  MapPin,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  Truck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  getAccessToken,
} from "@/services/api.client";

import {
  getAdminSupplyRequests,
  getAdminSupplyRequestStats,
  type SupplyRequest,
  type SupplyRequestMeta,
  type SupplyRequestStats,
  type SupplyRequestStatus,
  updateSupplyRequestStatus,
} from "@/services/supply-chain.service";

/* =========================================================
   CONFIG
========================================================= */

const PAGE_SIZE = 20;

type StatusFilter =
  | "ALL"
  | SupplyRequestStatus;

const EMPTY_STATS: SupplyRequestStats = {
  SUBMITTED: 0,
  ACCEPTED: 0,
  REJECTED: 0,
  RECEIVED: 0,
  COMPLETED: 0,
};

const branchNames: Record<string, string> = {
  rajshahi: "Rajshahi",
  bogura: "Bogura",
  kushtia: "Kushtia",
  chattogram: "Chattogram",
  dhaka: "Dhaka",
};

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(
  /\/api\/v1\/?$/,
  ""
);

function resolveImageUrl(
  url?: string
) {
  if (!url) {
    return "";
  }

  if (
    url.startsWith(
      "http://"
    ) ||
    url.startsWith(
      "https://"
    ) ||
    url.startsWith(
      "data:"
    )
  ) {
    return url;
  }

  if (
    url.startsWith("/")
  ) {
    return `${API_ORIGIN}${url}`;
  }

  return url;
}

function formatMoney(
  value: number
) {
  return `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD",
    {
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(
  value?: string
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-BD",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* =========================================================
   STATUS UI
========================================================= */

const statusConfig: Record<
  SupplyRequestStatus,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    badge: string;
    iconBox: string;
    activeCard: string;
  }
> = {
  SUBMITTED: {
    label: "Submitted",
    description: "Waiting for review",
    icon: Clock3,

    badge:
      "border-amber-200 bg-amber-50 text-amber-700",

    iconBox:
      "bg-amber-100 text-amber-700",

    activeCard:
      "border-amber-300 bg-amber-50/60 ring-2 ring-amber-100",
  },

  ACCEPTED: {
    label: "Accepted",
    description: "Approved for intake",
    icon: CheckCircle2,

    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",

    iconBox:
      "bg-emerald-100 text-emerald-700",

    activeCard:
      "border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-100",
  },

  REJECTED: {
    label: "Rejected",
    description: "Not approved",
    icon: XCircle,

    badge:
      "border-rose-200 bg-rose-50 text-rose-700",

    iconBox:
      "bg-rose-100 text-rose-700",

    activeCard:
      "border-rose-300 bg-rose-50/60 ring-2 ring-rose-100",
  },

  RECEIVED: {
    label: "Received",
    description: "Product received",
    icon: PackageCheck,

    badge:
      "border-blue-200 bg-blue-50 text-blue-700",

    iconBox:
      "bg-blue-100 text-blue-700",

    activeCard:
      "border-blue-300 bg-blue-50/60 ring-2 ring-blue-100",
  },

  COMPLETED: {
    label: "Completed",
    description: "Supply finalized",
    icon: Check,

    badge:
      "border-slate-200 bg-slate-100 text-slate-700",

    iconBox:
      "bg-slate-200 text-slate-700",

    activeCard:
      "border-slate-400 bg-slate-100 ring-2 ring-slate-200",
  },
};

const statusOrder:
  SupplyRequestStatus[] = [
    "SUBMITTED",
    "ACCEPTED",
    "REJECTED",
    "RECEIVED",
    "COMPLETED",
  ];

/* =========================================================
   PAGE
========================================================= */

export default function AdminSupplyChainPage() {
  const [
    requests,
    setRequests,
  ] =
    useState<
      SupplyRequest[]
    >([]);

  const [
    stats,
    setStats,
  ] =
    useState<SupplyRequestStats>(
      EMPTY_STATS
    );

  const [
    meta,
    setMeta,
  ] =
    useState<SupplyRequestMeta>({
      page: 1,
      limit: PAGE_SIZE,
      total: 0,
      totalPages: 1,
    });

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "ALL"
    );

  const [
    branchFilter,
    setBranchFilter,
  ] =
    useState("");

  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

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

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    useState<
      SupplyRequest | null
    >(null);

  const [
    rejectTarget,
    setRejectTarget,
  ] =
    useState<
      SupplyRequest | null
    >(null);

  const [
    rejectReason,
    setRejectReason,
  ] =
    useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  const fetchRequests =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const token =
            await getAccessToken();

          const [
            listResponse,
            statsResponse,
          ] =
            await Promise.all([
              getAdminSupplyRequests(
                token,
                {
                  page,
                  limit:
                    PAGE_SIZE,

                  status:
                    statusFilter ===
                    "ALL"
                      ? undefined
                      : statusFilter,

                  branch:
                    branchFilter ||
                    undefined,

                  search:
                    search ||
                    undefined,
                }
              ),

              getAdminSupplyRequestStats(
                token
              ),
            ]);

          setRequests(
            listResponse.data ||
              []
          );

          setStats(
            statsResponse.data ||
              EMPTY_STATS
          );

          setMeta(
            listResponse.meta || {
              page,
              limit:
                PAGE_SIZE,
              total:
                listResponse.data
                  ?.length ||
                0,
              totalPages:
                1,
            }
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load supply requests."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        page,
        statusFilter,
        branchFilter,
        search,
      ]
    );

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const updateStatus =
    async (
      request:
        SupplyRequest,
      nextStatus:
        SupplyRequestStatus,
      adminNote?: string
    ) => {
      try {
        setActionId(
          request._id
        );

        setError("");

        const token =
          await getAccessToken();

        await updateSupplyRequestStatus(
          request._id,
          nextStatus,
          token,
          adminNote
        );

        setSelectedRequest(
          null
        );

        setRejectTarget(
          null
        );

        setRejectReason(
          ""
        );

        await fetchRequests();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to update request."
        );
      } finally {
        setActionId(
          null
        );
      }
    };

  const submitReject =
    async () => {
      if (!rejectTarget) {
        return;
      }

      if (
        !rejectReason.trim()
      ) {
        setError(
          "Please provide a rejection reason."
        );

        return;
      }

      await updateStatus(
        rejectTarget,
        "REJECTED",
        rejectReason.trim()
      );
    };

  /* =======================================================
     HELPERS
  ======================================================= */

  const totalActive =
    useMemo(
      () =>
        stats.SUBMITTED +
        stats.ACCEPTED +
        stats.RECEIVED,
      [stats]
    );

  const clearFilters =
    () => {
      setSearchInput("");
      setSearch("");
      setBranchFilter("");
      setStatusFilter(
        "ALL"
      );
      setPage(1);
    };

  const hasFilters =
    Boolean(
      search ||
        branchFilter ||
        statusFilter !==
          "ALL"
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-full bg-[#F7F9F8]">
      <div className="w-full space-y-6 p-5 sm:p-6 lg:p-8">
        {/* =================================================
            HERO / HEADER
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#073B2D] shadow-sm">
          <div className="relative p-6 sm:p-7">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
                  <Truck className="h-3.5 w-3.5" />

                  B2B Supply Operations
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Supply Chain
                  Control Center
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/70">
                  Review farmer
                  submissions,
                  coordinate branch
                  intake and track
                  each request from
                  submission to
                  completion.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/60">
                    Active Queue
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {totalActive}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/60">
                    Total Requests
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    {Object.values(
                      stats
                    ).reduce(
                      (
                        total,
                        value
                      ) =>
                        total +
                        value,
                      0
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void fetchRequests()
                  }
                  disabled={
                    loading
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#073B2D] transition hover:bg-emerald-50 disabled:opacity-60"
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
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =================================================
            STATUS CARDS
        ================================================= */}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {statusOrder.map(
            (
              status
            ) => {
              const config =
                statusConfig[
                  status
                ];

              const Icon =
                config.icon;

              const active =
                statusFilter ===
                status;

              return (
                <button
                  key={
                    status
                  }
                  type="button"
                  onClick={() => {
                    setPage(1);

                    setStatusFilter(
                      active
                        ? "ALL"
                        : status
                    );
                  }}
                  className={`group rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    active
                      ? config.activeCard
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.iconBox}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {
                        stats[
                          status
                        ]
                      }
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-800">
                    {
                      config.label
                    }
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {
                      config.description
                    }
                  </p>
                </button>
              );
            }
          )}
        </section>

        {/* =================================================
            FILTER + TABLE CARD
        ================================================= */}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* FILTER BAR */}

          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Supply Requests
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search and
                  manage farmer
                  product
                  submissions.
                </p>
              </div>

              <form
                onSubmit={(
                  event
                ) => {
                  event.preventDefault();

                  setPage(1);

                  setSearch(
                    searchInput.trim()
                  );
                }}
                className="grid w-full gap-2 sm:grid-cols-[1fr_170px_auto] xl:max-w-3xl"
              >
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={
                      searchInput
                    }
                    onChange={(
                      event
                    ) =>
                      setSearchInput(
                        event.target
                          .value
                      )
                    }
                    placeholder="Tracking code, farmer, phone, product or district..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
                  />
                </div>

                <select
                  value={
                    branchFilter
                  }
                  onChange={(
                    event
                  ) => {
                    setBranchFilter(
                      event.target
                        .value
                    );

                    setPage(1);
                  }}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                >
                  <option value="">
                    All Branches
                  </option>

                  {Object.entries(
                    branchNames
                  ).map(
                    ([
                      value,
                      label,
                    ]) => (
                      <option
                        key={
                          value
                        }
                        value={
                          value
                        }
                      >
                        {
                          label
                        }
                      </option>
                    )
                  )}
                </select>

                <button
                  type="submit"
                  className="h-11 rounded-xl bg-[#0B7A57] px-5 text-sm font-bold text-white transition hover:bg-[#086849]"
                >
                  Search
                </button>
              </form>
            </div>

            {/* ACTIVE FILTERS */}

            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  Filters:
                </span>

                {statusFilter !==
                  "ALL" && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {
                      statusConfig[
                        statusFilter
                      ].label
                    }
                  </span>
                )}

                {branchFilter && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {branchNames[
                      branchFilter
                    ] ||
                      branchFilter}
                  </span>
                )}

                {search && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    “{search}”
                  </span>
                )}

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="ml-1 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* CONTENT */}

          {loading ? (
            <LoadingState />
          ) : requests.length ===
            0 ? (
            <EmptyState
              hasFilters={
                hasFilters
              }
              onClear={
                clearFilters
              }
            />
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1180px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Request
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Farmer
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Quantity
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Branch
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Expected
                      </th>

                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {requests.map(
                      (
                        request
                      ) => (
                        <SupplyRow
                          key={
                            request._id
                          }
                          request={
                            request
                          }
                          actionId={
                            actionId
                          }
                          onView={() =>
                            setSelectedRequest(
                              request
                            )
                          }
                          onAccept={() =>
                            void updateStatus(
                              request,
                              "ACCEPTED"
                            )
                          }
                          onReject={() => {
                            setRejectReason(
                              ""
                            );

                            setRejectTarget(
                              request
                            );
                          }}
                          onReceive={() =>
                            void updateStatus(
                              request,
                              "RECEIVED"
                            )
                          }
                          onComplete={() =>
                            void updateStatus(
                              request,
                              "COMPLETED"
                            )
                          }
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE / TABLET */}

              <div className="divide-y divide-slate-100 lg:hidden">
                {requests.map(
                  (
                    request
                  ) => (
                    <MobileRequestCard
                      key={
                        request._id
                      }
                      request={
                        request
                      }
                      onView={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                    />
                  )
                )}
              </div>

              {/* PAGINATION */}

              <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing page{" "}
                  <span className="font-semibold text-slate-700">
                    {meta.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.max(
                      meta.totalPages,
                      1
                    )}
                  </span>

                  <span className="mx-2 text-slate-300">
                    •
                  </span>

                  {meta.total} total
                  requests
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={
                      loading ||
                      page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          Math.max(
                            1,
                            current -
                              1
                          )
                      )
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />

                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      loading ||
                      page >=
                        meta.totalPages
                    }
                    onClick={() =>
                      setPage(
                        (
                          current
                        ) =>
                          Math.min(
                            current +
                              1,
                            Math.max(
                              meta.totalPages,
                              1
                            )
                          )
                      )
                    }
                    className="inline-flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next

                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ===================================================
          DETAILS MODAL
      =================================================== */}

      {selectedRequest && (
        <RequestDetailsModal
          request={
            selectedRequest
          }
          busy={
            actionId ===
            selectedRequest._id
          }
          onClose={() =>
            setSelectedRequest(
              null
            )
          }
          onAccept={() =>
            void updateStatus(
              selectedRequest,
              "ACCEPTED"
            )
          }
          onReject={() => {
            setSelectedRequest(
              null
            );

            setRejectReason(
              ""
            );

            setRejectTarget(
              selectedRequest
            );
          }}
          onReceive={() =>
            void updateStatus(
              selectedRequest,
              "RECEIVED"
            )
          }
          onComplete={() =>
            void updateStatus(
              selectedRequest,
              "COMPLETED"
            )
          }
        />
      )}

      {/* ===================================================
          REJECT MODAL
      =================================================== */}

      {rejectTarget && (
        <RejectModal
          request={
            rejectTarget
          }
          reason={
            rejectReason
          }
          setReason={
            setRejectReason
          }
          loading={
            actionId ===
            rejectTarget._id
          }
          onClose={() => {
            if (!actionId) {
              setRejectTarget(
                null
              );

              setRejectReason(
                ""
              );
            }
          }}
          onSubmit={() =>
            void submitReject()
          }
        />
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status:
    SupplyRequestStatus;
}) {
  const config =
    statusConfig[
      status
    ];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${config.badge}`}
    >
      {config.label}
    </span>
  );
}

/* =========================================================
   DESKTOP ROW
========================================================= */

function SupplyRow({
  request,
  actionId,
  onView,
  onAccept,
  onReject,
  onReceive,
  onComplete,
}: {
  request:
    SupplyRequest;

  actionId:
    string | null;

  onView:
    () => void;

  onAccept:
    () => void;

  onReject:
    () => void;

  onReceive:
    () => void;

  onComplete:
    () => void;
}) {
  const busy =
    actionId ===
    request._id;

  return (
    <tr className="group transition hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          {request.images?.[0] ? (
            <img
              src={resolveImageUrl(
                request.images[0]
              )}
              alt={
                request.productName
              }
              className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <PackageCheck className="h-5 w-5" />
            </div>
          )}

          <div className="min-w-0">
            <p className="max-w-[190px] truncate text-sm font-bold text-slate-900">
              {
                request.productName
              }
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-[10px] font-semibold text-slate-400">
                {request.trackingCode}
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-300" />

              <span className="text-[11px] text-slate-400">
                {
                  request.category
                }
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-700">
          {
            request.farmerName
          }
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {request.phone}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-slate-800">
          {
            request.quantity
          }{" "}
          {request.unit}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-start gap-1.5 text-xs text-slate-600">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />

          <span>
            {request.upazila}
            ,{" "}
            {request.district}
          </span>
        </div>
      </td>

      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
        {branchNames[
          request.branch
        ] ||
          request.branch}
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-slate-800">
          {formatMoney(
            request.expectedPrice
          )}
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          per{" "}
          {request.unit}
        </p>
      </td>

      <td className="px-5 py-4">
        <StatusBadge
          status={
            request.status
          }
        />

        {request.adminNote && (
          <p
            title={
              request.adminNote
            }
            className="mt-1 max-w-[150px] truncate text-[10px] text-slate-400"
          >
            {
              request.adminNote
            }
          </p>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={
              onView
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Eye className="h-3.5 w-3.5" />

            View
          </button>

          {request.status ===
            "SUBMITTED" && (
            <>
              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onAccept
                }
                title="Accept request"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onReject
                }
                title="Reject request"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}

          {request.status ===
            "ACCEPTED" && (
            <button
              type="button"
              disabled={
                busy
              }
              onClick={
                onReceive
              }
              className="h-9 rounded-xl bg-blue-50 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              {busy
                ? "Updating..."
                : "Receive"}
            </button>
          )}

          {request.status ===
            "RECEIVED" && (
            <button
              type="button"
              disabled={
                busy
              }
              onClick={
                onComplete
              }
              className="h-9 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              {busy
                ? "Updating..."
                : "Complete"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   MOBILE CARD
========================================================= */

function MobileRequestCard({
  request,
  onView,
}: {
  request:
    SupplyRequest;

  onView:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onView
      }
      className="w-full p-4 text-left transition hover:bg-slate-50"
    >
      <div className="flex items-start gap-3">
        {request.images?.[0] ? (
          <img
            src={resolveImageUrl(
              request.images[0]
            )}
            alt={
              request.productName
            }
            className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <PackageCheck className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">
                {
                  request.productName
                }
              </p>

              <p className="mt-1 font-mono text-[10px] text-slate-400">
                {
                  request.trackingCode
                }
              </p>
            </div>

            <StatusBadge
              status={
                request.status
              }
            />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400">
                Farmer
              </p>

              <p className="mt-0.5 font-semibold text-slate-700">
                {
                  request.farmerName
                }
              </p>
            </div>

            <div>
              <p className="text-slate-400">
                Quantity
              </p>

              <p className="mt-0.5 font-semibold text-slate-700">
                {
                  request.quantity
                }{" "}
                {
                  request.unit
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="p-5">
      <div className="space-y-3">
        {Array.from({
          length: 6,
        }).map(
          (
            _,
            index
          ) => (
            <div
              key={
                index
              }
              className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-100 p-4"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-100" />

              <div className="flex-1">
                <div className="h-3.5 w-1/3 rounded bg-slate-100" />

                <div className="mt-2 h-3 w-1/5 rounded bg-slate-100" />
              </div>

              <div className="h-8 w-20 rounded-full bg-slate-100" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters:
    boolean;

  onClear:
    () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
          <PackageCheck className="h-9 w-9" />
        </div>

        <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
          <Check className="h-3.5 w-3.5 text-white" />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">
        {hasFilters
          ? "No matching requests"
          : "Supply queue is clear"}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No supply requests match your current search or filters. Try adjusting the filters."
          : "New farmer product submissions will appear here automatically when they are received."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={
            onClear
          }
          className="mt-5 rounded-xl bg-[#0B513D] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#084330]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function RequestDetailsModal({
  request,
  busy,
  onClose,
  onAccept,
  onReject,
  onReceive,
  onComplete,
}: {
  request:
    SupplyRequest;

  busy:
    boolean;

  onClose:
    () => void;

  onAccept:
    () => void;

  onReject:
    () => void;

  onReceive:
    () => void;

  onComplete:
    () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* TOP */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="font-mono text-xs font-semibold text-slate-400">
              {
                request.trackingCode
              }
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Supply Request
              Details
            </h2>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* PRODUCT */}

          <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:flex-row">
            {request.images?.[0] ? (
              <img
                src={resolveImageUrl(
                  request.images[0]
                )}
                alt={
                  request.productName
                }
                className="h-36 w-full rounded-2xl object-cover sm:w-36"
              />
            ) : (
              <div className="flex h-36 w-full items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 sm:w-36">
                <PackageCheck className="h-10 w-10" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={
                    request.status
                  }
                />

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {
                    request.category
                  }
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
                {
                  request.productName
                }
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <InfoBlock
                  label="Quantity"
                  value={`${request.quantity} ${request.unit}`}
                />

                <InfoBlock
                  label="Expected Price"
                  value={`${formatMoney(
                    request.expectedPrice
                  )}/${request.unit}`}
                />

                <InfoBlock
                  label="Branch"
                  value={
                    branchNames[
                      request.branch
                    ] ||
                    request.branch
                  }
                />
              </div>
            </div>
          </div>

          {/* FARMER / LOCATION */}

          <div className="grid gap-4 md:grid-cols-2">
            <DetailCard
              title="Farmer Information"
              icon={
                UserRound
              }
            >
              <DetailRow
                icon={
                  UserRound
                }
                label="Farmer"
                value={
                  request.farmerName
                }
              />

              <DetailRow
                icon={
                  Phone
                }
                label="Phone"
                value={
                  request.phone
                }
              />

              {request.farmerEmail && (
                <DetailRow
                  icon={
                    FileText
                  }
                  label="Email"
                  value={
                    request.farmerEmail
                  }
                />
              )}
            </DetailCard>

            <DetailCard
              title="Pickup Location"
              icon={
                MapPin
              }
            >
              <DetailRow
                icon={
                  MapPin
                }
                label="Area"
                value={`${request.upazila}, ${request.district}`}
              />

              <DetailRow
                icon={
                  Building2
                }
                label="Division"
                value={
                  request.division
                }
              />

              <DetailRow
                icon={
                  Truck
                }
                label="Address"
                value={
                  request.location
                }
              />
            </DetailCard>
          </div>

          {/* NOTES */}

          {(request.notes ||
            request.adminNote) && (
            <div className="grid gap-4 md:grid-cols-2">
              {request.notes && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <FileText className="h-4 w-4" />

                    Farmer Note
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {
                      request.notes
                    }
                  </p>
                </div>
              )}

              {request.adminNote && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-500">
                    Admin Note
                  </p>

                  <p className="mt-3 text-sm leading-6 text-rose-700">
                    {
                      request.adminNote
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE */}

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Request Timeline
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TimelineItem
                label="Submitted"
                date={
                  request.createdAt
                }
                active
              />

              <TimelineItem
                label={
                  request.status ===
                  "REJECTED"
                    ? "Rejected"
                    : "Accepted"
                }
                date={
                  request.status ===
                  "REJECTED"
                    ? request.rejectedAt
                    : request.acceptedAt
                }
                active={
                  Boolean(
                    request.rejectedAt ||
                      request.acceptedAt
                  )
                }
              />

              <TimelineItem
                label="Received"
                date={
                  request.receivedAt
                }
                active={
                  Boolean(
                    request.receivedAt
                  )
                }
              />

              <TimelineItem
                label="Completed"
                date={
                  request.completedAt
                }
                active={
                  Boolean(
                    request.completedAt
                  )
                }
              />
            </div>
          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600"
            >
              Close
            </button>

            {request.status ===
              "SUBMITTED" && (
              <>
                <button
                  type="button"
                  disabled={
                    busy
                  }
                  onClick={
                    onReject
                  }
                  className="h-11 rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-bold text-rose-700 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  type="button"
                  disabled={
                    busy
                  }
                  onClick={
                    onAccept
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {busy && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  Accept Request
                </button>
              </>
            )}

            {request.status ===
              "ACCEPTED" && (
              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onReceive
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                <PackageCheck className="h-4 w-4" />

                Mark Received
              </button>
            )}

            {request.status ===
              "RECEIVED" && (
              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onComplete
                }
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />

                Complete Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REJECT MODAL
========================================================= */

function RejectModal({
  request,
  reason,
  setReason,
  loading,
  onClose,
  onSubmit,
}: {
  request:
    SupplyRequest;

  reason:
    string;

  setReason:
    (
      value:
        string
    ) => void;

  loading:
    boolean;

  onClose:
    () => void;

  onSubmit:
    () => void;
}) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
          <XCircle className="h-6 w-6" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Reject Supply
          Request
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You are rejecting{" "}
          <span className="font-semibold text-slate-800">
            {
              request.productName
            }
          </span>{" "}
          from{" "}
          <span className="font-semibold text-slate-800">
            {
              request.farmerName
            }
          </span>
          . The farmer will see
          this reason when
          tracking the request.
        </p>

        <label className="mt-5 block text-sm font-semibold text-slate-700">
          Rejection Reason
        </label>

        <textarea
          autoFocus
          rows={4}
          maxLength={
            500
          }
          value={
            reason
          }
          onChange={(
            event
          ) =>
            setReason(
              event.target
                .value
            )
          }
          placeholder="Explain why this submission cannot be accepted..."
          className="mt-2 w-full resize-none rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5"
        />

        <p className="mt-1 text-right text-[11px] text-slate-400">
          {reason.length}
          /500
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={
              loading
            }
            onClick={
              onClose
            }
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              loading ||
              !reason.trim()
            }
            onClick={
              onSubmit
            }
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoBlock({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title:
    string;

  icon:
    LucideIcon;

  children:
    React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Icon className="h-4 w-4 text-emerald-700" />

        {title}
      </h3>

      <div className="mt-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon:
    LucideIcon;

  label:
    string;

  value?:
    string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[11px] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700">
          {value ||
            "—"}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  date,
  active,
}: {
  label:
    string;

  date?:
    string;

  active:
    boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        active
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${
            active
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
        />

        <p
          className={`text-xs font-bold ${
            active
              ? "text-emerald-800"
              : "text-slate-400"
          }`}
        >
          {label}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
        <CalendarDays className="h-3.5 w-3.5" />

        {date
          ? formatDate(
              date
            )
          : "Pending"}
      </div>
    </div>
  );
}