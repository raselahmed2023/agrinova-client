'use client';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Sprout,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import AddFarmDrawer from '@/components/farm/AddFarmDrawer';
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

export default function FarmsPage() {
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] =
    useState(false);

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [selectedFarm, setSelectedFarm] =
    useState<IFarm | null>(null);

  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);

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
        `${BACKEND_URL}/farms`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: 'no-store',
        }
      );

      const data = await res.json();

      if (
        !res.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
            'Failed to load farms'
        );
      }

      setFarms(
        Array.isArray(data.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        'Failed to fetch farms:',
        err
      );

      setFarms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFarms();
  }, [fetchFarms]);

  const handleEditClick = (
    farm: IFarm
  ) => {
    setSelectedFarm(farm);
    setIsEditOpen(true);
  };

  const getFarmLocation = (
    farm: IFarm
  ) => {
    const parts = [
      farm.upazila,
      farm.district,
      farm.division,
    ].filter(Boolean);

    return parts.join(', ');
  };

  const renderFarmInfo = (
    farm: IFarm
  ) => {
    if (
      farm.farmType === 'Crop' ||
      farm.farmType === 'Orchard'
    ) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Land Area
            </span>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {farm.landArea}{' '}
              {farm.unit}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Soil Type
            </span>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {farm.soilType || 'Not set'}
            </p>
          </div>
        </div>
      );
    }

    if (farm.farmType === 'Fishery') {
      return (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Pond / Water Area
            </span>

            <p className="mt-1 text-sm font-bold text-slate-800">
              {farm.landArea}{' '}
              {farm.unit}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Farm Type
            </span>

            <p className="mt-1 text-sm font-bold text-slate-800">
              Fishery
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Farm Type
        </span>

        <p className="mt-1 text-sm font-bold text-slate-800">
          {getFarmTypeLabel(
            farm.farmType
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Farms
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your registered farms and farming activities.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsAddOpen(true)
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f30]"
          >
            <Plus className="h-4 w-4" />
            Add Farm
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : farms.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Sprout className="h-7 w-7 text-emerald-600" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No farms found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first farm to start managing your farming activities.
            </p>

            <button
              type="button"
              onClick={() =>
                setIsAddOpen(true)
              }
              className="mt-5 rounded-xl bg-[#0B513D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f30]"
            >
              Add Farm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {farms.map((farm) => (
              <div
                key={farm._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={
                      farm.coverImage ||
                      'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
                    }
                    alt={farm.name}
                    className="h-full w-full object-cover"
                  />

                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                      farm.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {farm.status}
                  </span>
                </div>

                {/* BODY */}
                <div className="space-y-4 p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-slate-900">
                        {farm.name}
                      </h3>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-[#0B513D]">
                        {getFarmTypeLabel(
                          farm.farmType
                        )}
                      </span>
                    </div>

                    <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />

                      <span>
                        {getFarmLocation(
                          farm
                        )}
                      </span>
                    </p>
                  </div>

                  {renderFarmInfo(farm)}

                  {/* ACTIONS */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleEditClick(
                          farm
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <Link
                      href={`/dashboard/farmer/farms/${farm._id}`}
                      className="rounded-lg bg-[#EAF4ED] px-3 py-2 text-xs font-semibold text-[#0B513D] transition hover:bg-emerald-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddFarmDrawer
          isOpen={isAddOpen}
          onClose={() =>
            setIsAddOpen(false)
          }
          onSuccess={fetchFarms}
        />

        <EditFarmDrawer
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedFarm(null);
          }}
          onSuccess={fetchFarms}
          farmData={selectedFarm}
        />
      </div>
    </div>
  );
}