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
  CalendarDays,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Sprout,
  Tractor,
} from "lucide-react";

import {
  adminService,
} from "@/services/admin.service";

import type {
  AdminFarm,
} from "@/services/admin.farm.service";

export default function AdminFarmDetailsPage() {
  const params =
    useParams();

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
      AdminFarm | null
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
    if (
      !farmId
    ) {
      return;
    }

    let active =
      true;

    const load =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          /**
           * apiRequest already returns the Farm object.
           */
          const result =
            await adminService
              .getAdminFarmById(
                farmId
              );

          if (
            active
          ) {
            setFarm(
              result
            );
          }
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err instanceof
                Error
                ? err.message
                : "Unable to load farm."
            );

            setFarm(
              null
            );
          }
        } finally {
          if (
            active
          ) {
            setLoading(
              false
            );
          }
        }
      };

    void load();

    return () => {
      active =
        false;
    };
  }, [
    farmId,
  ]);

  if (
    loading
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (
    !farm
  ) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <p className="font-bold text-red-700">
            {error ||
              "Farm not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl space-y-5 p-5 sm:p-6 lg:p-8">

      <button
        type="button"
        onClick={() =>
          router.push(
            "/dashboard/admin/farms"
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to Farms
      </button>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="relative h-56 bg-emerald-950">

          {farm.coverImage ? (
            <>
              <img
                src={
                  farm.coverImage
                }
                alt={
                  farm.name
                }
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">

              <Tractor className="h-14 w-14 text-white/30" />
            </div>
          )}

          <div className="absolute bottom-5 left-6">

            <h1 className="text-2xl font-black text-white">
              {
                farm.name
              }
            </h1>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">

              <MapPin className="h-4 w-4" />

              {[
                farm.upazila,
                farm.district,
                farm.division,
              ]
                .filter(
                  Boolean
                )
                .join(
                  ", "
                ) ||
                "Location not specified"}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <InfoCard
              icon={
                <Tractor className="h-4 w-4" />
              }
              label="Farm Type"
              value={
                farm.farmType ||
                "N/A"
              }
            />

            <InfoCard
              icon={
                <Layers className="h-4 w-4" />
              }
              label="Land / Water Area"
              value={
                farm.landArea !=
                null
                  ? `${farm.landArea} ${farm.unit || ""}`
                  : "N/A"
              }
            />

            <InfoCard
              icon={
                <Sprout className="h-4 w-4" />
              }
              label="Soil Type"
              value={
                farm.soilType ||
                "N/A"
              }
            />

            <InfoCard
              icon={
                <Mail className="h-4 w-4" />
              }
              label="Farmer"
              value={
                farm.farmerEmail ||
                "N/A"
              }
            />

            <InfoCard
              icon={
                <CalendarDays className="h-4 w-4" />
              }
              label="Registered"
              value={
                farm.createdAt
                  ? new Date(
                      farm.createdAt
                    ).toLocaleString()
                  : "N/A"
              }
            />

            <InfoCard
              icon={
                <Tractor className="h-4 w-4" />
              }
              label="Status"
              value={
                farm.status ||
                "Active"
              }
            />
          </div>

          {farm.description && (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-700">
                {
                  farm.description
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">

        <span className="text-emerald-700">
          {
            icon
          }
        </span>

        {
          label
        }
      </div>

      <p className="mt-2 break-words font-bold text-slate-800">
        {
          value
        }
      </p>
    </div>
  );
}