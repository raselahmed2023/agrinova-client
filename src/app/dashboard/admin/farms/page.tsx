"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Tractor,
} from "lucide-react";

import {
  adminService,
} from "@/services/admin.service";

import type {
  AdminFarm,
} from "@/services/admin.farm.service";

export default function AdminFarmsPage() {
  const [
    farms,
    setFarms,
  ] =
    useState<
      AdminFarm[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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
    error,
    setError,
  ] =
    useState("");

  const loadFarms =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const params =
            new URLSearchParams();

          if (
            search.trim()
          ) {
            params.set(
              "search",
              search.trim()
            );
          }

          if (
            district.trim()
          ) {
            params.set(
              "district",
              district.trim()
            );
          }

          /**
           * Load up to 100 for Admin monitoring.
           */
          params.set(
            "limit",
            "100"
          );

          /**
           * apiRequest() already unwraps data.
           *
           * result itself is AdminFarm[].
           */
          const result =
            await adminService
              .getAdminFarms(
                params.toString()
              );

          setFarms(
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
            "Failed to load farms:",
            err
          );

          setFarms(
            []
          );

          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load farms."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        district,
        search,
      ]
    );

  useEffect(() => {
    void loadFarms();
  }, [
    loadFarms,
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-5 p-5 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Farms Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View all registered farms across AgriNova.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            void loadFarms()
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

      {/* TOTAL */}

      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Tractor className="h-5 w-5" />
          </div>

          <div>
            <p className="text-2xl font-black text-slate-950">
              {
                farms.length
              }
            </p>

            <p className="text-xs font-bold text-slate-500">
              Farms Loaded
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_240px_auto]">

        <div className="relative">

          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Search farm, farmer email, soil, location..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <input
          value={
            district
          }
          onChange={(
            event
          ) =>
            setDistrict(
              event.target
                .value
            )
          }
          placeholder="Filter district"
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <button
          type="button"
          onClick={() =>
            void loadFarms()
          }
          className="rounded-xl bg-[#0b5d42] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#084b35]"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {
            error
          }
        </div>
      )}

      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="border-b border-slate-100 bg-slate-50">

              <tr className="text-xs font-black uppercase tracking-wide text-slate-500">

                <th className="px-5 py-4">
                  Farm
                </th>

                <th className="px-5 py-4">
                  Farmer
                </th>

                <th className="px-5 py-4">
                  Location
                </th>

                <th className="px-5 py-4">
                  Type
                </th>

                <th className="px-5 py-4">
                  Area
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
                    colSpan={
                      7
                    }
                    className="py-16 text-center"
                  >
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-700" />

                    <p className="mt-2 text-sm text-slate-500">
                      Loading farms...
                    </p>
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
                      className="transition hover:bg-slate-50/60"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="h-10 w-12 overflow-hidden rounded-lg bg-emerald-50">

                            {farm.coverImage ? (
                              <img
                                src={
                                  farm.coverImage
                                }
                                alt={
                                  farm.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Tractor className="h-4 w-4 text-emerald-600" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-black text-slate-900">
                              {
                                farm.name
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {
                                farm.soilType ||
                                "No soil type"
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {
                          farm.farmerEmail ||
                          "N/A"
                        }
                      </td>

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1.5 text-slate-600">

                          <MapPin className="h-3.5 w-3.5 text-slate-400" />

                          {[
                            farm.upazila,
                            farm.district,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            ) ||
                            "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {
                          farm.farmType ||
                          "N/A"
                        }
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {farm.landArea ??
                          "N/A"}
                        {" "}
                        {farm.landArea !=
                        null
                          ? farm.unit ||
                            ""
                          : ""}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                            farm.status ===
                            "Inactive"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {farm.status ||
                            "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">

                        <Link
                          href={`/dashboard/admin/farms/${farm._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" />

                          View
                        </Link>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      7
                    }
                    className="py-16 text-center text-slate-400"
                  >
                    <Tractor className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 font-bold text-slate-600">
                      No farms found
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