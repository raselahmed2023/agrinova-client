"use client";

import Link from "next/link";

import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  RefreshCw,
  Sprout,
  Sun,
  Wind,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authClient } from "@/lib/auth-client";

import {
  findDistrictLocation,
} from "@/constants/districts";

import type { IFarm } from "@/types/farm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

interface CurrentWeather {
  code: number;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

interface WeatherData {
  current: CurrentWeather;
  recommendation?: string;
}

export default function FarmerDashboardPage() {
  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  /* =========================
     FARM STATE
  ========================= */

  const [farms, setFarms] =
    useState<IFarm[]>([]);

  const [
    farmsLoading,
    setFarmsLoading,
  ] = useState(true);

  const [
    farmsError,
    setFarmsError,
  ] = useState("");

  const [
    selectedFarmId,
    setSelectedFarmId,
  ] = useState("");

  /* =========================
     WEATHER STATE
  ========================= */

  const [
    weatherData,
    setWeatherData,
  ] = useState<WeatherData | null>(
    null
  );

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(false);

  const [
    weatherError,
    setWeatherError,
  ] = useState("");

  /* =========================
     SELECTED FARM
  ========================= */

  const selectedFarm =
    useMemo(() => {
      if (!farms.length) {
        return null;
      }

      return (
        farms.find(
          (farm) =>
            farm._id ===
            selectedFarmId
        ) || farms[0]
      );
    }, [farms, selectedFarmId]);

  const selectedFarmLocation =
    useMemo(() => {
      if (!selectedFarm) {
        return null;
      }

      return findDistrictLocation(
        selectedFarm.district
      );
    }, [selectedFarm]);

  /* =========================
     FETCH FARMS
  ========================= */

  const fetchFarms =
    useCallback(async () => {
      if (!session?.user?.id) {
        setFarms([]);
        setSelectedFarmId("");
        setFarmsLoading(false);
        return;
      }

      try {
        setFarmsLoading(true);
        setFarmsError("");

        const {
          data: tokenData,
          error: tokenError,
        } = await authClient.token();

        if (
          tokenError ||
          !tokenData?.token
        ) {
          throw new Error(
            "Authentication required"
          );
        }

        const response =
          await fetch(
            `${API_URL}/farms`,
            {
              method: "GET",

              headers: {
                Accept:
                  "application/json",

                Authorization:
                  `Bearer ${tokenData.token}`,
              },

              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Failed to load farms."
          );
        }

        const farmData: IFarm[] =
          Array.isArray(data.data)
            ? data.data
            : [];

        setFarms(farmData);

        setSelectedFarmId(
          (currentFarmId) => {
            if (
              currentFarmId &&
              farmData.some(
                (farm) =>
                  farm._id ===
                  currentFarmId
              )
            ) {
              return currentFarmId;
            }

            return (
              farmData[0]?._id || ""
            );
          }
        );
      } catch (error) {
        console.error(
          "Dashboard farms error:",
          error
        );

        setFarms([]);
        setSelectedFarmId("");

        setFarmsError(
          error instanceof Error
            ? error.message
            : "Unable to load farms."
        );
      } finally {
        setFarmsLoading(false);
      }
    }, [session?.user?.id]);

  /* =========================
     FETCH WEATHER
  ========================= */

  const fetchWeather =
    useCallback(async () => {
      if (
        !selectedFarm ||
        !selectedFarmLocation
      ) {
        setWeatherData(null);
        setWeatherLoading(false);

        if (selectedFarm) {
          setWeatherError(
            `Weather location not found for ${selectedFarm.district}.`
          );
        } else {
          setWeatherError("");
        }

        return;
      }

      try {
        setWeatherLoading(true);
        setWeatherError("");

        const response =
          await fetch(
            `${API_URL}/weather?lat=${selectedFarmLocation.lat}&lon=${selectedFarmLocation.lon}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Failed to load weather."
          );
        }

        setWeatherData(
          data.data as WeatherData
        );
      } catch (error) {
        console.error(
          "Dashboard weather error:",
          error
        );

        setWeatherData(null);

        setWeatherError(
          error instanceof Error
            ? error.message
            : "Unable to load weather."
        );
      } finally {
        setWeatherLoading(false);
      }
    }, [
      selectedFarm,
      selectedFarmLocation,
    ]);

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session?.user?.id) {
      setFarms([]);
      setSelectedFarmId("");
      setWeatherData(null);
      setFarmsLoading(false);
      return;
    }

    void fetchFarms();
  }, [
    sessionLoading,
    session?.user?.id,
    fetchFarms,
  ]);

  useEffect(() => {
    if (
      farmsLoading ||
      !selectedFarm
    ) {
      return;
    }

    void fetchWeather();
  }, [
    farmsLoading,
    selectedFarm,
    fetchWeather,
  ]);

  /* =========================
     WEATHER ICON
  ========================= */

  const getWeatherIcon = (
    code: number
  ) => {
    if (code === 0) {
      return (
        <Sun className="h-10 w-10 text-amber-500" />
      );
    }

    if (code >= 1 && code <= 2) {
      return (
        <CloudSun className="h-10 w-10 text-amber-500" />
      );
    }

    if (code === 3) {
      return (
        <Cloud className="h-10 w-10 text-slate-400" />
      );
    }

    if (
      code >= 45 &&
      code <= 48
    ) {
      return (
        <CloudFog className="h-10 w-10 text-slate-400" />
      );
    }

    if (
      (code >= 51 &&
        code <= 67) ||
      (code >= 80 &&
        code <= 82)
    ) {
      return (
        <CloudRain className="h-10 w-10 text-blue-500" />
      );
    }

    if (code >= 95) {
      return (
        <CloudLightning className="h-10 w-10 text-violet-600" />
      );
    }

    return (
      <CloudSun className="h-10 w-10 text-slate-500" />
    );
  };

  /* =========================
     LOADING
  ========================= */

  if (sessionLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B6B4A]" />
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* =====================
          HEADER
      ===================== */}

      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#477A5B]">
            Farmer Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome
            {session?.user?.name
              ? `, ${session.user.name}`
              : " to AgriNova"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your farm and get
            useful farming insights from
            one place.
          </p>
        </div>

        {!farmsLoading &&
          farms.length > 0 && (
            <div className="w-full lg:w-72">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected Farm
              </label>

              <select
                value={
                  selectedFarm?._id ||
                  ""
                }
                onChange={(event) =>
                  setSelectedFarmId(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0B6B4A] focus:ring-2 focus:ring-[#0B6B4A]/10"
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
          )}
      </section>

      {/* =====================
          FARM ERROR
      ===================== */}

      {farmsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {farmsError}
        </div>
      )}

      {/* =====================
          FARM LOADING
      ===================== */}

      {farmsLoading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-7 w-7 animate-spin text-[#0B6B4A]" />
        </div>
      )}

      {/* =====================
          NO FARM
      ===================== */}

      {!farmsLoading &&
        farms.length === 0 && (
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4ED] text-[#0B513D]">
              <Sprout className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Add your first farm
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add a farm to view
              location-based weather and
              farming insights.
            </p>

            <Link
              href="/dashboard/farmer/farms"
              className="mt-5 rounded-xl bg-[#0B6B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#09583d]"
            >
              Go to My Farms
            </Link>
          </section>
        )}

      {!farmsLoading &&
        selectedFarm && (
          <>
            {/* =====================
                FARM SUMMARY
            ===================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
                    <Sprout className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedFarm.name}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          selectedFarm.status ===
                          "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {
                          selectedFarm.status
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />

                      <span>
                        {
                          selectedFarm.district
                        }
                        ,{" "}
                        {
                          selectedFarm.division
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/farmer/farms/${selectedFarm._id}`}
                  className="text-sm font-semibold text-[#0B6B4A] hover:underline"
                >
                  View Farm Details
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Land Area
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {
                      selectedFarm.landArea
                    }{" "}
                    {selectedFarm.unit}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Soil Type
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {
                      selectedFarm.soilType
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    District
                  </p>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {
                      selectedFarm.district
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* =====================
                WEATHER
            ===================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Weather Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Weather for{" "}
                    {selectedFarm.name},{" "}
                    {
                      selectedFarm.district
                    }
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      void fetchWeather()
                    }
                    disabled={
                      weatherLoading ||
                      !selectedFarmLocation
                    }
                    aria-label="Refresh weather"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-[#0B6B4A] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        weatherLoading
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </button>

                  <Link
                    href="/dashboard/farmer/weather"
                    className="text-sm font-semibold text-[#0B6B4A] hover:underline"
                  >
                    View Weather
                  </Link>
                </div>
              </div>

              {weatherLoading ? (
                <div className="mt-6 flex min-h-48 items-center justify-center rounded-xl bg-slate-50">
                  <Loader2 className="h-7 w-7 animate-spin text-[#0B6B4A]" />
                </div>
              ) : weatherData ? (
                <div className="mt-6">
                  <div className="flex flex-col gap-6 rounded-xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                        {getWeatherIcon(
                          weatherData
                            .current.code
                        )}
                      </div>

                      <div>
                        <p className="text-4xl font-extrabold text-slate-900">
                          {
                            weatherData
                              .current
                              .temperature
                          }
                          °C
                        </p>

                        <p className="mt-1 font-semibold text-slate-600">
                          {
                            weatherData
                              .current
                              .condition
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            selectedFarm.district
                          }
                          ,{" "}
                          {
                            selectedFarm.division
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-white px-4 py-3 text-center">
                        <Droplets className="mx-auto h-4 w-4 text-blue-500" />

                        <p className="mt-2 text-xs text-slate-400">
                          Humidity
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                          {
                            weatherData
                              .current
                              .humidity
                          }
                          %
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-3 text-center">
                        <Wind className="mx-auto h-4 w-4 text-emerald-500" />

                        <p className="mt-2 text-xs text-slate-400">
                          Wind
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                          {
                            weatherData
                              .current
                              .windSpeed
                          }
                        </p>

                        <p className="text-[10px] text-slate-400">
                          km/h
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-3 text-center">
                        <CloudRain className="mx-auto h-4 w-4 text-indigo-500" />

                        <p className="mt-2 text-xs text-slate-400">
                          Rain
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                          {
                            weatherData
                              .current
                              .rainProb
                          }
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                  <CloudSun className="h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Weather unavailable
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {weatherError ||
                      "Unable to load weather for this farm."}
                  </p>
                </div>
              )}
            </section>

            {/* =====================
                SMART INSIGHT
            ===================== */}

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0B513D] shadow-sm">
                  <Sprout className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#477A5B]">
                    Smart Farming Insight
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Recommendation for{" "}
                    {selectedFarm.name}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {weatherLoading
                      ? "Analyzing current weather conditions..."
                      : weatherData
                            ?.recommendation
                        ? weatherData.recommendation
                        : "Weather-based farming advice is not available right now."}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
    </div>
  );
}