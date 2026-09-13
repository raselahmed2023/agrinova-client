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
  Calendar,
  Layers,
  MapPin,
  Tractor,
  UserRound,
} from "lucide-react";

import {
  adminFarmService,
  type AdminFarmItem,
} from "@/services/admin.farm.service";

export default function AdminFarmDetailsPage() {
  const params =
    useParams<{
      farmId:
        string;
    }>();

  const router =
    useRouter();

  const farmId =
    String(
      params.farmId ||
        ""
    );

  const [
    farm,
    setFarm,
  ] =
    useState<
      AdminFarmItem | null
    >(null);

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

  useEffect(() => {
    if (!farmId) {
      return;
    }

    adminFarmService
      .getAdminFarmById(
        farmId
      )
      .then(
        setFarm
      )
      .catch(
        (
          err:
            unknown
        ) =>
          setError(
            err instanceof
              Error
              ? err.message
              : "Failed to load farm."
          )
      )
      .finally(() =>
        setLoading(
          false
        )
      );
  }, [farmId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-slate-400">
        Loading farm
        details...
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="space-y-4 p-12 text-center">
        <p className="text-slate-500">
          {error ||
            "Farm not found."}
        </p>

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const location =
    [
      farm.location,
      farm.upazila,
      farm.district,
      farm.division,
    ]
      .filter(
        Boolean
      )
      .join(", ");

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <button
        type="button"
        onClick={() =>
          router.back()
        }
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Farms
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {farm.name}
            </h1>

            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />

              {location ||
                "Location not specified"}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Tractor className="h-6 w-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Tile
            icon={
              <Layers className="h-3.5 w-3.5" />
            }
            label="Land Area"
            value={`${farm.landArea ?? "N/A"} ${
              farm.unit || ""
            }`}
          />

          <Tile
            label="Soil Type"
            value={
              farm.soilType ||
              "N/A"
            }
          />

          <Tile
            label="Farm Status"
            value={
              farm.status ||
              "N/A"
            }
          />

          <Tile
            icon={
              <UserRound className="h-3.5 w-3.5" />
            }
            label="Farmer"
            value={
              farm.farmerName ||
              farm.farmerId ||
              "N/A"
            }
          />

          <Tile
            icon={
              <MapPin className="h-3.5 w-3.5" />
            }
            label="District"
            value={
              farm.district ||
              "N/A"
            }
          />

          <Tile
            icon={
              <Calendar className="h-3.5 w-3.5" />
            }
            label="Registered Date"
            value={
              farm.createdAt
                ? new Date(
                    farm.createdAt
                  ).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {icon}

        {label}
      </span>

      <p className="text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}