'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import type { IFarm } from '@/types/farm';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1';

export default function SmartFarmingRecommendationPage() {
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [problem, setProblem] = useState('');

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const fetchFarms = useCallback(async () => {
    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${BACKEND_URL}/farms`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const response = await res.json();

      const activeFarms = Array.isArray(response.data)
        ? response.data.filter(
            (farm: IFarm) => farm.status === 'Active'
          )
        : [];

      setFarms(activeFarms);

      if (activeFarms.length) {
        setSelectedFarmId(activeFarms[0]._id);
      }
    } catch {
      setError('Failed to load farms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFarms();
  }, [fetchFarms]);

  const selectedFarm = useMemo(
    () =>
      farms.find(
        (farm) => farm._id === selectedFarmId
      ) || null,
    [farms, selectedFarmId]
  );

  const getFarmType = (farm: IFarm) => {
    switch (farm.farmType) {
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

  const getLocation = (farm: IFarm) =>
    [
      farm.upazila,
      farm.district,
      farm.division,
    ]
      .filter(Boolean)
      .join(', ');

  const handleGenerate = async () => {
    if (!selectedFarm) {
      setError('Please select a farm');
      return;
    }

    if (!problem.trim()) {
      setError('Please describe your problem');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      setResult('');

      const { data } = await authClient.token();

      if (!data?.token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(
        `${BACKEND_URL}/ai/smart-farming-recommendation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            farmId: selectedFarm._id,
            problem: problem.trim(),
          }),
        }
      );

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(
          response.message ||
            'Failed to generate recommendation'
        );
      }

      setResult(
        response.data?.recommendation ||
          response.data?.summary ||
          response.data
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Recommendation failed'
      );
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Smart Farming Recommendation
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Describe your farming problem and get AI guidance.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* SELECT FARM */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Select Farm
            </label>

            <select
              value={selectedFarmId}
              onChange={(e) => {
                setSelectedFarmId(e.target.value);
                setResult('');
                setError('');
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              {farms.map((farm) => (
                <option
                  key={farm._id}
                  value={farm._id}
                >
                  {farm.name}
                </option>
              ))}
            </select>
          </div>

          {/* FARM CARD */}
          {selectedFarm && (
            <div className="mt-5 rounded-xl bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {selectedFarm.name}
                  </h2>

                  <p className="mt-1 text-sm text-emerald-700">
                    {getFarmType(selectedFarm)}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                  {selectedFarm.status}
                </span>
              </div>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                {getLocation(selectedFarm)}
              </p>

              {(selectedFarm.farmType === 'Crop' ||
                selectedFarm.farmType === 'Orchard') && (
                <p className="mt-2 text-sm text-slate-600">
                  {selectedFarm.landArea} {selectedFarm.unit}
                  {' • '}
                  {selectedFarm.soilType}
                </p>
              )}

              {selectedFarm.farmType === 'Fishery' && (
                <p className="mt-2 text-sm text-slate-600">
                  Pond Area: {selectedFarm.landArea}{' '}
                  {selectedFarm.unit}
                </p>
              )}
            </div>
          )}

          {/* PROBLEM */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Describe Your Problem
            </label>

            <textarea
              rows={6}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Example: My mango leaves are turning yellow. What should I do?"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#083f30] disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get Recommendation
              </>
            )}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Recommendation
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}