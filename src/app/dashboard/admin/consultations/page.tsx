"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  consultationService,
  type AdminConsultationItem,
} from "@/services/admin.consultation.service";

import type {
  AdminUserMeta,
} from "@/services/admin.user.service";

const PAGE_SIZE = 10;

const statusStyle =
  (
    status:
      string
  ) => {
    switch (
      status.toUpperCase()
    ) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";

      case "ACCEPTED":
      case "SCHEDULED":
        return "bg-blue-50 text-blue-700";

      case "ONGOING":
        return "bg-violet-50 text-violet-700";

      case "REJECTED":
      case "CANCELLED":
        return "bg-rose-50 text-rose-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

function displayWhen(
  item:
    AdminConsultationItem
) {
  /*
   * Newer records may use scheduledAt.
   */
  if (
    item.scheduledAt
  ) {
    const date =
      new Date(
        item.scheduledAt
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toLocaleString();
    }
  }

  /*
   * Some records store date/time separately.
   * Show both instead of silently dropping time.
   */
  if (
    item.scheduledDate
  ) {
    const date =
      new Date(
        item.scheduledDate
      );

    const dateText =
      Number.isNaN(
        date.getTime()
      )
        ? String(
            item.scheduledDate
          )
        : date.toLocaleDateString();

    return item.scheduledTime
      ? `${dateText} · ${item.scheduledTime}`
      : dateText;
  }

  if (item.date) {
    const date =
      new Date(
        item.date
      );

    return Number.isNaN(
      date.getTime()
    )
      ? String(
          item.date
        )
      : date.toLocaleString();
  }

  if (
    item.createdAt
  ) {
    const date =
      new Date(
        item.createdAt
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toLocaleString();
    }
  }

  return "N/A";
}

export default function AdminConsultationsPage() {
  const [
    items,
    setItems,
  ] =
    useState<
      AdminConsultationItem[]
    >([]);

  const [
    meta,
    setMeta,
  ] =
    useState<AdminUserMeta>({
      page: 1,
      limit:
        PAGE_SIZE,
      total: 0,
      totalPages: 1,
    });

  const [
    page,
    setPage,
  ] =
    useState(1);

  const [
    status,
    setStatus,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError("");

          const query =
            new URLSearchParams({
              page:
                String(
                  page
                ),

              limit:
                String(
                  PAGE_SIZE
                ),
            });

          if (status) {
            query.set(
              "status",
              status
            );
          }

          const result =
            await consultationService.getAdminConsultations(
              query.toString()
            );

          setItems(
            result.data
          );

          setMeta(
            result.meta
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Failed to load consultations."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        status,
      ]
    );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
            Expert Services
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Consultations
            Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor Expert and
            farmer consultation
            sessions across the
            platform.
          </p>
        </div>

        <select
          value={
            status
          }
          onChange={(
            event
          ) => {
            setStatus(
              event.target.value
            );

            setPage(
              1
            );
          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
        >
          <option value="">
            All statuses
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="ACCEPTED">
            Accepted
          </option>

          <option value="SCHEDULED">
            Scheduled
          </option>

          <option value="ONGOING">
            Ongoing
          </option>

          <option value="COMPLETED">
            Completed
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">
                  Farmer / User
                </th>

                <th className="px-6 py-3">
                  Expert
                </th>

                <th className="px-6 py-3">
                  Topic
                </th>

                <th className="px-6 py-3">
                  Status
                </th>

                <th className="px-6 py-3 text-right">
                  Scheduled
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
                    Loading
                    consultations...
                  </td>
                </tr>
              ) : items.length >
                0 ? (
                items.map(
                  (
                    item
                  ) => (
                    <tr
                      key={
                        item._id
                      }
                      className="transition hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {item.farmerName ||
                            item.userId ||
                            "N/A"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {item.expertName ||
                          item.expertId ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {item.topic ||
                          item.consultationType ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(
                            item.status ||
                              "PENDING"
                          )}`}
                        >
                          {item.status ||
                            "PENDING"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5" />

                          {displayWhen(
                            item
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No consultations
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {meta.total} consultation
          {meta.total === 1
            ? ""
            : "s"}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={
              page <= 1 ||
              loading
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
            className="rounded-lg border border-slate-200 bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span>
            Page {meta.page} of{" "}
            {meta.totalPages}
          </span>

          <button
            type="button"
            disabled={
              page >=
                meta.totalPages ||
              loading
            }
            onClick={() =>
              setPage(
                (
                  current
                ) =>
                  Math.min(
                    current +
                      1,
                    meta.totalPages
                  )
              )
            }
            className="rounded-lg border border-slate-200 bg-white p-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}