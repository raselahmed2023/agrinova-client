"use client";

import Link from "next/link";

import {
  Bell,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  RefreshCw,
  ShoppingBag,
  Sprout,
  Store,
  Sun,
  TrendingDown,
  TrendingUp,
  WalletCards,
  Wind,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { authClient } from "@/lib/auth-client";

import {
  getMyListings,
  getReceivedPurchaseRequests,
  getSentPurchaseRequests,
} from "@/services/marketplace.service";

import type {
  MarketplaceProduct,
  PurchaseRequest,
} from "@/types/marketplace";

import type { IFarm } from "@/types/farm";

import type { FinanceTransaction } from "@/components/dashboard/finance/FinanceSummary";

import { BD_DISTRICTS } from "@/constants/districts";

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

  const userId =
    session?.user?.id || "";

  const userEmail =
    session?.user?.email || "";

  const dashboardDistrict =
    BD_DISTRICTS[0];

  /* 
     FARM STATE
   */

  const [farms, setFarms] =
    useState<IFarm[]>([]);

  const [
    farmsLoading,
    setFarmsLoading,
  ] = useState(true);

  /* 
     MARKETPLACE STATE
   */

  const [listings, setListings] =
    useState<MarketplaceProduct[]>([]);

  const [
    sentRequests,
    setSentRequests,
  ] = useState<PurchaseRequest[]>([]);

  const [
    receivedRequests,
    setReceivedRequests,
  ] = useState<PurchaseRequest[]>([]);

  const [
    marketplaceLoading,
    setMarketplaceLoading,
  ] = useState(true);

  const [
    marketplaceError,
    setMarketplaceError,
  ] = useState("");

  /* 
     FINANCE STATE
   */

  const [
    transactions,
    setTransactions,
  ] = useState<FinanceTransaction[]>([]);

  const [
    financeLoading,
    setFinanceLoading,
  ] = useState(true);

  /* 
     WEATHER STATE
  */

  const [
    weatherData,
    setWeatherData,
  ] = useState<WeatherData | null>(
    null
  );

  const [
    weatherLoading,
    setWeatherLoading,
  ] = useState(true);

  const [
    weatherError,
    setWeatherError,
  ] = useState("");

  /* 
     FARM FETCH
   */

  const fetchFarms =
    useCallback(async () => {
      try {
        setFarmsLoading(true);

        const response =
          await fetch(
            `${API_URL}/farms`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
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

        setFarms(
          Array.isArray(data.data)
            ? data.data
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard farms error:",
          error
        );

        setFarms([]);
      } finally {
        setFarmsLoading(false);
      }
    }, []);

  /* 
     MARKETPLACE FETCH
   */

  const fetchMarketplaceData =
    useCallback(async () => {
      if (!userEmail) {
        setListings([]);
        setSentRequests([]);
        setReceivedRequests([]);
        setMarketplaceLoading(false);
        return;
      }

      try {
        setMarketplaceLoading(true);
        setMarketplaceError("");

        const [
          listingsResponse,
          sentResponse,
          receivedResponse,
        ] = await Promise.all([
          getMyListings(userEmail),

          getSentPurchaseRequests(
            userEmail
          ),

          getReceivedPurchaseRequests(
            userEmail
          ),
        ]);

        setListings(
          Array.isArray(
            listingsResponse
          )
            ? listingsResponse
            : []
        );

        setSentRequests(
          Array.isArray(
            sentResponse.data
          )
            ? sentResponse.data
            : []
        );

        setReceivedRequests(
          Array.isArray(
            receivedResponse.data
          )
            ? receivedResponse.data
            : []
        );
      } catch (error) {
        setMarketplaceError(
          error instanceof Error
            ? error.message
            : "Failed to load marketplace data."
        );
      } finally {
        setMarketplaceLoading(false);
      }
    }, [userEmail]);

  /* 
     FINANCE FETCH
   */

  const fetchFinanceData =
    useCallback(async () => {
      if (!userId) {
        setTransactions([]);
        setFinanceLoading(false);
        return;
      }

      try {
        setFinanceLoading(true);

        const response =
          await fetch(
            `${API_URL}/finance/transactions/${userId}`,
            {
              method: "GET",
              headers: {
                Accept:
                  "application/json",
              },
              cache: "no-store",
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          );

        const data =
          contentType?.includes(
            "application/json"
          )
            ? await response.json()
            : null;

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch finance data."
          );
        }

        const transactionData =
          data?.data ?? data ?? [];

        setTransactions(
          Array.isArray(
            transactionData
          )
            ? transactionData
            : []
        );
      } catch (error) {
        console.error(
          "Dashboard finance error:",
          error
        );

        setTransactions([]);
      } finally {
        setFinanceLoading(false);
      }
    }, [userId]);

  /* 
     WEATHER FETCH
  */

  const fetchWeather =
    useCallback(async () => {
      try {
        setWeatherLoading(true);
        setWeatherError("");

        const response =
          await fetch(
            `${API_URL}/weather?lat=${dashboardDistrict.lat}&lon=${dashboardDistrict.lon}`,
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
      dashboardDistrict.lat,
      dashboardDistrict.lon,
    ]);

  /* 
     INITIAL FETCH
 */

  useEffect(() => {
    if (!sessionLoading) {
      void fetchFarms();
      void fetchMarketplaceData();
      void fetchFinanceData();
      void fetchWeather();
    }
  }, [
    sessionLoading,
    fetchFarms,
    fetchMarketplaceData,
    fetchFinanceData,
    fetchWeather,
  ]);

  /* 
     MARKETPLACE CALCULATION
   */

  const activeListingsCount =
    listings.filter(
      (product) =>
        !product.status ||
        product.status ===
          "available"
    ).length;

  const pendingRequestsCount =
    [
      ...sentRequests,
      ...receivedRequests,
    ].filter(
      (request) =>
        request.status ===
        "PENDING"
    ).length;

  /* 
     FINANCE CALCULATION
   */

  const totalIncome =
    transactions
      .filter(
        (transaction) =>
          String(
            transaction.type
          ).toLowerCase() ===
          "income"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const totalExpense =
    transactions
      .filter(
        (transaction) =>
          String(
            transaction.type
          ).toLowerCase() ===
          "expense"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const netProfit =
    totalIncome -
    totalExpense;

  /* 
     WEATHER ICON
  */

  const getWeatherIcon = (
    code: number
  ) => {
    if (code === 0) {
      return (
        <Sun className="h-10 w-10 text-amber-500" />
      );
    }

    if (
      code >= 1 &&
      code <= 2
    ) {
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

  /* 
     TOP STATS
   */

  const stats = [
    {
      title: "My Farms",

      value: farmsLoading
        ? "..."
        : String(farms.length),

      description:
        "Registered farms",

      icon: Sprout,

      href:
        "/dashboard/farmer/farms",
    },

    {
      title:
        "Active Listings",

      value:
        marketplaceLoading
          ? "..."
          : String(
              activeListingsCount
            ),

      description:
        "Marketplace products",

      icon: ShoppingBag,

      href:
        "/dashboard/farmer/marketplace/listings",
    },

    {
      title:
        "Purchase Requests",

      value:
        marketplaceLoading
          ? "..."
          : String(
              pendingRequestsCount
            ),

      description:
        "Pending requests",

      icon: Store,

      href:
        "/dashboard/farmer/marketplace/requests",
    },

    {
      title:
        "Notifications",

      value: "0",

      description:
        "Unread notifications",

      icon: Bell,

      href:
        "/dashboard/farmer/notifications",
    },
  ];

  if (sessionLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B6B4A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome */}

      <section>
        <p className="text-sm font-medium text-[#477A5B]">
          Farmer Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome
          {session?.user?.name
            ? `, ${session.user.name}`
            : " to AgriNova"}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your farms, access
          smart agricultural tools,
          monitor weather, sell
          products and keep track of
          your farming activities from
          one place.
        </p>
      </section>

      {marketplaceError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {marketplaceError}
        </div>
      )}

      {/* Stats */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon =
            item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {item.description}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Weather + Finance */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Weather */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Weather Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {dashboardDistrict.name}{" "}
                weather information
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  void fetchWeather()
                }
                disabled={
                  weatherLoading
                }
                className="text-slate-400 transition hover:text-[#0B6B4A]"
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
            <div className="mt-6 flex min-h-44 items-center justify-center rounded-xl bg-slate-50">
              <Loader2 className="h-7 w-7 animate-spin text-[#0B6B4A]" />
            </div>
          ) : weatherData ? (
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
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
                        dashboardDistrict.name
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

              {weatherData.recommendation && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-800">
                    Farming
                    Recommendation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    {
                      weatherData.recommendation
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 px-4 text-center">
              <CloudSun className="h-8 w-8 text-red-300" />

              <p className="mt-3 text-sm font-semibold text-red-700">
                Weather unavailable
              </p>

              <p className="mt-1 text-xs text-red-500">
                {weatherError}
              </p>
            </div>
          )}
        </div>

        {/* Finance */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Finance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Financial summary
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4ED] text-[#0B513D]">
              <WalletCards className="h-5 w-5" />
            </div>
          </div>

          {financeLoading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#0B6B4A]" />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Total Income
                  </span>

                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ৳
                  {totalIncome.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Total Expense
                  </span>

                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>

                <p className="mt-2 text-xl font-bold text-slate-900">
                  ৳
                  {totalExpense.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-600">
                  Net Profit
                </span>

                <span className="text-lg font-bold text-[#0B513D]">
                  ৳
                  {netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/dashboard/farmer/finance"
            className="mt-5 block text-center text-sm font-semibold text-[#0B6B4A] hover:underline"
          >
            View Finance
          </Link>
        </div>
      </section>
    </div>
  );
}