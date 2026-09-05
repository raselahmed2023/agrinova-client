'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useParams } from 'next/navigation';

import {
  CalendarDays,
  Edit3,
  LandPlot,
  Loader2,
  MapPin,
  Sprout,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import EditFarmDrawer from '@/components/farm/EditFarmDrawer';

import type { IFarm } from '@/types/farm';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1';

const getFarmTypeLabel = (
  farmType?: IFarm['farmType']
) => {
  switch (farmType) {
    case 'Crop':
      return 'Crop Farm';

    case 'Orchard':
      return 'Orchard / Horticulture';

    case 'Poultry':
      return 'Poultry Farm';

    case 'Livestock':
      return 'Livestock Farm';

    case 'Fishery':
      return 'Fish Farm';

    default:
      return 'Farm';
  }
};

export default function FarmDetailsPage() {
  const params = useParams();

  const farmId = params.id as string;

  const [farm, setFarm] =
    useState<IFarm | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [error, setError] =
    useState('');

  const fetchFarm =
    useCallback(async () => {
      try {
        setLoading(true);
        setError('');

        const {
          data: tokenData,
          error: tokenError,
        } = await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            'Authentication required'
          );
        }

        const res = await fetch(
          `${BACKEND_URL}/farms/${farmId}`,
          {
            method: 'GET',

            headers: {
              Accept:
                'application/json',

              Authorization: `Bearer ${tokenData.token}`,
            },

            cache: 'no-store',
          }
        );

        const data =
          await res.json();

        if (
          !res.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              'Failed to load farm'
          );
        }

        setFarm(data.data);
      } catch (err) {
        console.error(
          'Failed to fetch farm:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load farm'
        );
      } finally {
        setLoading(false);
      }
    }, [farmId]);

  useEffect(() => {
    void fetchFarm();
  }, [fetchFarm]);

  const getFarmLocation = (
    farmData: IFarm
  ) => {
    return [
      farmData.upazila,
      farmData.district,
      farmData.division,
    ]
      .filter(Boolean)
      .join(', ');
  };

  const formatDate = (
    date: string
  ) => {
    if (!date) return 'Not available';

    return new Intl.DateTimeFormat(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    ).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px] rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Unable to load farm
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error ||
              'Farm information is not available.'}
          </p>
        </div>
      </div>
    );
  }

  const isCropBased =
    farm.farmType === 'Crop' ||
    farm.farmType === 'Orchard';

  const isFishery =
    farm.farmType === 'Fishery';

  const hasArea =
    isCropBased ||
    isFishery;

  return (
    <>
      <div className="min-h-screen bg-slate-50/50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px] space-y-6">
          {/* HERO */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-[260px] bg-slate-100 sm:h-[320px]">
              <img
                src={
                  farm.coverImage ||
                  'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
                }
                alt={farm.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0B513D] backdrop-blur">
                        {getFarmTypeLabel(
                          farm.farmType
                        )}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          farm.status ===
                          'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {farm.status}
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {farm.name}
                    </h1>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin className="h-4 w-4" />

                      {getFarmLocation(
                        farm
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setIsEditOpen(true)
                    }
                    className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Farm
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div
            className={`grid gap-4 ${
              hasArea
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'sm:grid-cols-2'
            }`}
          >
            {/* TYPE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Sprout className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Farm Type
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {getFarmTypeLabel(
                  farm.farmType
                )}
              </p>
            </div>

            {/* AREA */}
            {hasArea && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <LandPlot className="h-5 w-5 text-emerald-600" />
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {isFishery
                    ? 'Pond / Water Area'
                    : 'Land Area'}
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {farm.landArea}{' '}
                  {farm.unit}
                </p>
              </div>
            )}

            {/* ADDED ON */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Added On
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formatDate(
                  farm.createdAt
                )}
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* OVERVIEW */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Farm Overview
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {farm.description ||
                  'No description has been added for this farm yet.'}
              </p>
            </div>

            {/* FARM INFORMATION */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Farm Information
              </h2>

              <div className="mt-5 divide-y divide-slate-100">
                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-slate-500">
                    Type
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {getFarmTypeLabel(
                      farm.farmType
                    )}
                  </span>
                </div>

                {isCropBased && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-slate-500">
                      Soil Type
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {farm.soilType ||
                        'Not set'}
                    </span>
                  </div>
                )}

                {hasArea && (
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-slate-500">
                      {isFishery
                        ? 'Water Area'
                        : 'Land Area'}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {farm.landArea}{' '}
                      {farm.unit}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      farm.status ===
                      'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {farm.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#0B513D]" />

              <h2 className="text-lg font-bold text-slate-900">
                Location Details
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Division
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {farm.division}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  District
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {farm.district}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Upazila
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {farm.upazila ||
                    'Not set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditFarmDrawer
        isOpen={isEditOpen}
        onClose={() =>
          setIsEditOpen(false)
        }
        onSuccess={() => {
          setIsEditOpen(false);
          void fetchFarm();
        }}
        farmData={farm}
      />
    </>
  );
}