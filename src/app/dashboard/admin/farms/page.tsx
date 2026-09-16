"use client";

import Link from "next/link";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Search,
} from "lucide-react";

import {
  adminFarmService,
  type AdminFarmItem,
} from "@/services/admin.farm.service";

import type {
  AdminUserMeta,
} from "@/services/admin.user.service";

const PAGE_SIZE = 10;

export default function AdminFarmsPage() {
  const [
    farms,
    setFarms,
  ] =
    useState<
      AdminFarmItem[]
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
    district,
    setDistrict,
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

          if (search) {
            query.set(
              "search",
              search
            );
          }

          if (
            district.trim()
          ) {
            query.set(
              "district",
              district.trim()
            );
          }

          const result =
            await adminFarmService.getAdminFarms(
              query.toString()
            );

          setFarms(
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
              : "Failed to load farms."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        page,
        search,
        district,
      ]
    );

  useEffect(() => {
    void load();
  }, [load]);

  const submitSearch =
    (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setPage(1);

      setSearch(
        searchInput.trim()
      );
    };

  const clearFilters =
    () => {
      setSearchInput(
        ""
      );

      setSearch(
        ""
      );

      setDistrict(
        ""
      );

      setPage(
        1
      );
    };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
          Farm Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Farms Monitoring
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and monitor
          registered farms across
          the AgriNova platform.
        </p>
      </div>

      <form
        onSubmit={
          submitSearch
        }
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_220px_auto_auto]"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={
              searchInput
            }
            onChange={(
              event
            ) =>
              setSearchInput(
                event.target.value
              )
            }
            placeholder="Search farm name or soil type..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <input
          value={
            district
          }
          onChange={(
            event
          ) => {
            setDistrict(
              event.target.value
            );

            setPage(
              1
            );
          }}
          placeholder="District filter"
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500"
        />

        <button
          type="submit"
          className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800"
        >
          Search
        </button>

        {(search ||
          district) && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">
                  Farm Name
                </th>

                <th className="px-6 py-3">
                  District
                </th>

                <th className="px-6 py-3">
                  Land Area
                </th>

                <th className="px-6 py-3">
                  Soil Type
                </th>

                <th className="px-6 py-3">
                  Status
                </th>

                <th className="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading farms...
                  </td>
                </tr>
              ) : farms.length >
                0 ? (
                farms.map(
                  (
                    farm
                  ) => (
                    <tr
                      key={
                        farm._id
                      }
                      className="transition hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {
                            farm.name
                          }
                        </p>

                        {farm.farmerName && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            Farmer:{" "}
                            {
                              farm.farmerName
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />

                          {farm.district ||
                            "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {farm.landArea ??
                          "N/A"}{" "}
                        {farm.unit ||
                          ""}
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {farm.soilType ||
                          "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            farm.status ===
                            "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {farm.status ||
                            "Unknown"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/admin/farms/${farm._id}`}
                          className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />

                          View
                        </Link>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No farms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {meta.total} farm
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