'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertTriangle,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Lightbulb,
  Loader2,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import {
  findDistrictLocation,
} from '@/constants/districts';

import type {
  DistrictLocation,
} from '@/constants/districts';

import type { IFarm } from '@/types/farm';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api/v1';

export interface CurrentWeather {
  code: number;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

export interface RiskAdvisory {
  title: string;
  description: string;
}

export interface ForecastItem {
  day: string;
  code: number;
  temp: string;
  risk: string;
}

export interface WeatherData {
  current: CurrentWeather;
  recommendation: string;
  advisories: RiskAdvisory[];
  forecast: ForecastItem[];
}

export default function WeatherPage() {
  const [farms, setFarms] =
    useState<IFarm[]>([]);

  const [
    selectedFarmId,
    setSelectedFarmId,
  ] = useState('');

  const [
    selectedDistrict,
    setSelectedDistrict,
  ] = useState<DistrictLocation | null>(
    null
  );

  const [
    weatherData,
    setWeatherData,
  ] = useState<WeatherData | null>(
    null
  );

  const [
    farmsLoading,
    setFarmsLoading,
  ] = useState(true);

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const activeFarms = useMemo(
    () =>
      farms.filter(
        (farm) =>
          farm.status === 'Active'
      ),
    [farms]
  );

  const selectedFarm = useMemo(
    () =>
      activeFarms.find(
        (farm) =>
          farm._id === selectedFarmId
      ) || null,
    [
      activeFarms,
      selectedFarmId,
    ]
  );

  const loadFarms =
    useCallback(async () => {
      try {
        setFarmsLoading(true);
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
          `${BACKEND_URL}/farms`,
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
              'Failed to load farms'
          );
        }

        const farmList: IFarm[] =
          Array.isArray(data.data)
            ? data.data
            : [];

        setFarms(farmList);

        const availableFarms =
          farmList.filter(
            (farm) =>
              farm.status === 'Active'
          );

        if (
          availableFarms.length === 0
        ) {
          setSelectedFarmId('');
          setSelectedDistrict(null);
          setWeatherData(null);

          setError(
            farmList.length === 0
              ? 'Add a farm first to view weather for your farm location.'
              : 'You do not have any active farms. Set a farm to Active to view weather.'
          );

          return;
        }

        setSelectedFarmId(
          (current) => {
            const stillExists =
              availableFarms.some(
                (farm) =>
                  farm._id === current
              );

            if (stillExists) {
              return current;
            }

            return availableFarms[0]._id;
          }
        );
      } catch (err) {
        console.error(
          'Farm fetch error:',
          err
        );

        setFarms([]);
        setSelectedFarmId('');
        setSelectedDistrict(null);
        setWeatherData(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load farms.'
        );
      } finally {
        setFarmsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadFarms();
  }, [loadFarms]);

  useEffect(() => {
    if (!selectedFarm) {
      setSelectedDistrict(null);
      setWeatherData(null);
      return;
    }

    const location =
      findDistrictLocation(
        selectedFarm.district
      );

    if (!location) {
      setSelectedDistrict(null);
      setWeatherData(null);

      setError(
        `Could not match ${selectedFarm.district} with a Bangladesh district.`
      );

      return;
    }

    setError('');
    setSelectedDistrict(location);
  }, [selectedFarm]);

  const fetchWeather =
    useCallback(async () => {
      if (
        !selectedFarm ||
        !selectedDistrict
      ) {
        setWeatherData(null);
        return;
      }

      try {
        setWeatherLoading(true);
        setError('');

        const res = await fetch(
          `${BACKEND_URL}/weather?lat=${selectedDistrict.lat}&lon=${selectedDistrict.lon}`,
          {
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
              'Failed to load weather'
          );
        }

        setWeatherData(
          data.data as WeatherData
        );
      } catch (err) {
        console.error(
          'Weather fetch error:',
          err
        );

        setWeatherData(null);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load weather.'
        );
      } finally {
        setWeatherLoading(false);
      }
    }, [
      selectedFarm,
      selectedDistrict,
    ]);

  useEffect(() => {
    if (
      selectedFarm &&
      selectedDistrict
    ) {
      void fetchWeather();
    }
  }, [
    selectedFarm,
    selectedDistrict,
    fetchWeather,
  ]);

  const getWeatherIcon = (
    code: number,
    className = 'w-10 h-10'
  ) => {
    if (code === 0) {
      return (
        <Sun
          className={`${className} text-amber-500`}
        />
      );
    }

    if (
      code >= 1 &&
      code <= 2
    ) {
      return (
        <CloudSun
          className={`${className} text-amber-400`}
        />
      );
    }

    if (code === 3) {
      return (
        <Cloud
          className={`${className} text-slate-400`}
        />
      );
    }

    if (
      code >= 45 &&
      code <= 48
    ) {
      return (
        <CloudFog
          className={`${className} text-slate-400`}
        />
      );
    }

    if (
      code >= 51 &&
      code <= 67
    ) {
      return (
        <CloudRain
          className={`${className} text-blue-500`}
        />
      );
    }

    if (
      code >= 80 &&
      code <= 82
    ) {
      return (
        <CloudRain
          className={`${className} text-indigo-500`}
        />
      );
    }

    if (code >= 95) {
      return (
        <CloudLightning
          className={`${className} text-purple-600`}
        />
      );
    }

    return (
      <CloudSun
        className={`${className} text-slate-500`}
      />
    );
  };

  const farmLocation =
    selectedFarm
      ? [
          selectedFarm.upazila,
          selectedFarm.district,
          selectedFarm.division,
        ]
          .filter(Boolean)
          .join(', ')
      : '';

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Agricultural Weather Advisory
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View weather conditions and farming
              advisories for your active farms.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* FARM SELECTOR */}
            <div className="flex min-w-[260px] items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
              <MapPin className="mr-2 h-4 w-4 shrink-0 text-emerald-600" />

              <select
                value={selectedFarmId}
                onChange={(e) =>
                  setSelectedFarmId(
                    e.target.value
                  )
                }
                disabled={
                  farmsLoading ||
                  activeFarms.length === 0
                }
                className="w-full cursor-pointer bg-transparent text-sm font-semibold text-slate-700 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {activeFarms.length ===
                0 ? (
                  <option value="">
                    No active farm
                  </option>
                ) : (
                  activeFarms.map(
                    (farm) => (
                      <option
                        key={farm._id}
                        value={farm._id}
                      >
                        {farm.name}
                      </option>
                    )
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                void fetchWeather()
              }
              disabled={
                weatherLoading ||
                !selectedFarm ||
                !selectedDistrict
              }
              title="Refresh weather"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  weatherLoading
                    ? 'animate-spin text-emerald-600'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* SELECTED FARM */}
        {selectedFarm && (
          <div className="flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Selected Farm
              </p>

              <p className="mt-0.5 font-semibold text-slate-900">
                {selectedFarm.name}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-emerald-600" />

              {farmLocation}
            </div>
          </div>
        )}

        {/* LOADING FARMS */}
        {farmsLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />

            <span className="text-sm font-medium text-slate-500">
              Loading your farms...
            </span>
          </div>
        ) : !selectedFarm ? (
          /* NO ACTIVE FARM */
          <div className="rounded-2xl border border-amber-200 bg-white p-10 text-center shadow-sm">
            <MapPin className="mx-auto h-8 w-8 text-amber-500" />

            <h3 className="mt-3 font-bold text-slate-900">
              No active farm available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {error ||
                'Add or activate a farm to view weather information.'}
            </p>
          </div>
        ) : !selectedDistrict ? (
          /* LOCATION ERROR */
          <div className="rounded-2xl border border-amber-200 bg-white p-10 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />

            <h3 className="mt-3 font-bold text-slate-900">
              Farm location unavailable
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {error}
            </p>
          </div>
        ) : weatherLoading ? (
          /* WEATHER LOADING */
          <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />

            <span className="text-sm font-medium text-slate-500">
              Fetching live weather for{' '}
              {selectedFarm.name}...
            </span>
          </div>
        ) : !weatherData ? (
          /* WEATHER ERROR */
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <CloudSun className="mx-auto h-8 w-8 text-red-400" />

            <h3 className="mt-3 font-bold text-slate-900">
              Weather unavailable
            </h3>

            <p className="mt-1 text-sm text-red-500">
              {error ||
                'Unable to load weather.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CURRENT WEATHER */}
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                <div className="flex items-center gap-5">
                  <div className="shrink-0 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                    {getWeatherIcon(
                      weatherData.current
                        .code,
                      'w-16 h-16'
                    )}
                  </div>

                  <div>
                    <span className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                      {
                        weatherData.current
                          .temperature
                      }
                      °C
                    </span>

                    <p className="mt-1 text-xl font-semibold text-slate-600">
                      {
                        weatherData.current
                          .condition
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {farmLocation}
                    </p>
                  </div>
                </div>

                {/* METRICS */}
                <div className="grid grid-cols-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <Droplets className="h-4 w-4 text-blue-500" />

                      <span className="text-xs font-medium">
                        Humidity
                      </span>
                    </div>

                    <p className="text-xl font-bold text-slate-800">
                      {
                        weatherData.current
                          .humidity
                      }
                      %
                    </p>
                  </div>

                  <div className="space-y-1 border-x border-slate-200">
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <Wind className="h-4 w-4 text-emerald-500" />

                      <span className="text-xs font-medium">
                        Wind Speed
                      </span>
                    </div>

                    <p className="text-xl font-bold text-slate-800">
                      {
                        weatherData.current
                          .windSpeed
                      }{' '}
                      km/h
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                      <CloudRain className="h-4 w-4 text-indigo-500" />

                      <span className="text-xs font-medium">
                        Rain Risk
                      </span>
                    </div>

                    <p className="text-xl font-bold text-slate-800">
                      {
                        weatherData.current
                          .rainProb
                      }
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* RECOMMENDATION */}
              <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="shrink-0 rounded-full border border-emerald-100 bg-white p-2 text-emerald-600 shadow-sm">
                  <Lightbulb className="h-5 w-5" />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Farming Recommendation
                  </h4>

                  <p className="mt-1 text-sm leading-relaxed text-emerald-800/90">
                    {
                      weatherData.recommendation
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* ADVISORIES */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Active Risk Advisories
                </h3>

                <div className="space-y-3">
                  {weatherData.advisories
                    .length > 0 ? (
                    weatherData.advisories.map(
                      (
                        advisory,
                        index
                      ) => (
                        <div
                          key={`${advisory.title}-${index}`}
                          className="space-y-1 rounded-xl border border-red-100 border-l-4 border-l-red-500 bg-red-50/50 p-4"
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />

                            <h4 className="text-sm font-bold text-slate-900">
                              {
                                advisory.title
                              }
                            </h4>
                          </div>

                          <p className="pl-6 text-xs leading-relaxed text-slate-600">
                            {
                              advisory.description
                            }
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs italic text-slate-400">
                      No active agricultural
                      weather alerts.
                    </p>
                  )}
                </div>
              </div>

              {/* FORECAST */}
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  3-Day Forecast & Crop
                  Risk
                </h3>

                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
                  {weatherData.forecast?.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={`${item.day}-${index}`}
                        className="space-y-3 px-2"
                      >
                        <p className="text-xs font-semibold text-slate-500">
                          {item.day}
                        </p>

                        <div className="flex justify-center">
                          {getWeatherIcon(
                            item.code,
                            'w-8 h-8'
                          )}
                        </div>

                        <p className="text-lg font-bold text-slate-900">
                          {item.temp}
                        </p>

                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.risk ===
                            'High Risk'
                              ? 'bg-red-50 text-red-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {item.risk}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}