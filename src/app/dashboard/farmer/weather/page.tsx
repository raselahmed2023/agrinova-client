'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudFog,
  Cloud,
  Droplets,
  Wind,
  AlertTriangle,
  Lightbulb,
  Loader2,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { BD_DISTRICTS, findDistrictLocation } from '@/constants/districts';
import type { DistrictLocation } from '@/constants/districts';
import type { IFarm } from '@/types/farm';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictLocation | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [farmsLoading, setFarmsLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFarmerLocation = useCallback(async () => {
    try {
      setFarmsLoading(true);
      setError('');

      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${BACKEND_URL}/farms`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load farms');
      }

      const farmList: IFarm[] = Array.isArray(data.data) ? data.data : [];
      setFarms(farmList);

      if (farmList.length === 0) {
        setSelectedDistrict(null);
        setWeatherData(null);
        setError('Add a farm first to automatically load weather for your farm location.');
        return;
      }

      const primaryFarm = farmList[0];
      const location = findDistrictLocation(primaryFarm.district);

      if (!location) {
        setSelectedDistrict(null);
        setWeatherData(null);
        setError(
          `Could not match ${primaryFarm.district} with a Bangladesh district. Select a district manually.`
        );
        return;
      }

      setSelectedDistrict(location);
    } catch (err) {
      console.error('Farm location fetch error:', err);
      setFarms([]);
      setSelectedDistrict(null);
      setWeatherData(null);
      setError(err instanceof Error ? err.message : 'Failed to load farm location.');
    } finally {
      setFarmsLoading(false);
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    if (!selectedDistrict) {
      setWeatherData(null);
      return;
    }

    try {
      setWeatherLoading(true);
      setError('');

      const res = await fetch(
        `${BACKEND_URL}/weather?lat=${selectedDistrict.lat}&lon=${selectedDistrict.lon}`,
        { cache: 'no-store' }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || 'Failed to load weather');
      }

      setWeatherData(data.data as WeatherData);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeatherData(null);
      setError(err instanceof Error ? err.message : 'Failed to load weather.');
    } finally {
      setWeatherLoading(false);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    void loadFarmerLocation();
  }, [loadFarmerLocation]);

  useEffect(() => {
    if (selectedDistrict) {
      void fetchWeather();
    }
  }, [selectedDistrict, fetchWeather]);

  const getWeatherIcon = (code: number, className: string = 'w-10 h-10') => {
    if (code === 0) return <Sun className={`${className} text-amber-500`} />;
    if (code >= 1 && code <= 2)
      return <CloudSun className={`${className} text-amber-400`} />;
    if (code === 3) return <Cloud className={`${className} text-slate-400`} />;
    if (code >= 45 && code <= 48)
      return <CloudFog className={`${className} text-slate-400`} />;
    if (code >= 51 && code <= 67)
      return <CloudRain className={`${className} text-blue-500`} />;
    if (code >= 80 && code <= 82)
      return <CloudRain className={`${className} text-indigo-500`} />;
    if (code >= 95)
      return <CloudLightning className={`${className} text-purple-600`} />;
    return <CloudSun className={`${className} text-slate-500`} />;
  };

  const primaryFarm = farms[0] || null;
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 bg-slate-50/50 min-h-screen text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Agricultural Weather Advisory
          </h1>
          <p className="text-slate-500 mt-1">
            Weather defaults to your first farm location. You can also select another district.
          </p>
          {primaryFarm && (
            <p className="text-xs text-emerald-700 mt-1">
              Primary farm: {primaryFarm.name} • {primaryFarm.district}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
            <MapPin className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <select
              value={selectedDistrict?.name || ''}
              onChange={(e) => {
                const target = BD_DISTRICTS.find((d) => d.name === e.target.value);
                setSelectedDistrict(target || null);
              }}
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">Select district</option>
              {BD_DISTRICTS.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => void fetchWeather()}
            disabled={weatherLoading || !selectedDistrict}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition text-slate-600 disabled:opacity-50"
            title="Refresh Weather"
          >
            <RefreshCw
              className={`w-4 h-4 ${weatherLoading ? 'animate-spin text-emerald-600' : ''}`}
            />
          </button>
        </div>
      </div>

      {farmsLoading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">
            Loading your farm location...
          </span>
        </div>
      ) : !selectedDistrict ? (
        <div className="p-10 bg-white rounded-2xl border border-amber-200 shadow-sm text-center">
          <MapPin className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="mt-3 font-bold text-slate-900">Choose a weather location</h3>
          <p className="mt-1 text-sm text-slate-500">
            {error || 'Select a district above to view agricultural weather information.'}
          </p>
        </div>
      ) : weatherLoading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500">
            Fetching live weather metrics for {selectedDistrict.name}...
          </span>
        </div>
      ) : !weatherData ? (
        <div className="p-10 bg-white rounded-2xl border border-red-200 shadow-sm text-center">
          <CloudSun className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="mt-3 font-bold text-slate-900">Weather unavailable</h3>
          <p className="mt-1 text-sm text-red-500">{error || 'Unable to load weather.'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl shrink-0">
                  {getWeatherIcon(weatherData.current.code, 'w-16 h-16')}
                </div>
                <div>
                  <span className="text-6xl font-extrabold text-slate-900 tracking-tight">
                    {weatherData.current.temperature}°C
                  </span>
                  <p className="text-xl font-semibold text-slate-600 mt-1">
                    {weatherData.current.condition}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{selectedDistrict.name}</p>
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-xl p-4 grid grid-cols-3 gap-2 text-center border border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center justify-center text-slate-500 gap-1">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium">Humidity</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {weatherData.current.humidity}%
                  </p>
                </div>

                <div className="space-y-1 border-x border-slate-200/60">
                  <div className="flex items-center justify-center text-slate-500 gap-1">
                    <Wind className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium">Wind Speed</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {weatherData.current.windSpeed} km/h
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center text-slate-500 gap-1">
                    <CloudRain className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium">Rain Risk</span>
                  </div>
                  <p className="text-xl font-bold text-slate-800">
                    {weatherData.current.rainProb}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 flex gap-3 items-start">
              <div className="bg-white p-2 rounded-full border border-emerald-100 shadow-sm text-emerald-600 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-emerald-900 uppercase">
                  Agronomic Recommendation for {selectedDistrict.name}
                </h4>
                <p className="text-sm text-emerald-800/90 mt-1 leading-relaxed">
                  {weatherData.recommendation}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Active Risk Advisories</h3>
              <div className="space-y-3">
                {weatherData.advisories.length > 0 ? (
                  weatherData.advisories.map((adv, index) => (
                    <div
                      key={`${adv.title}-${index}`}
                      className="bg-red-50/50 rounded-xl p-4 border-l-4 border-l-red-500 border border-red-100 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <h4 className="font-bold text-slate-900 text-sm">{adv.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-6">
                        {adv.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    Optimal weather parameters. No active agricultural alerts.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">3-Day Forecast & Crop Risk</h3>
              <div className="grid grid-cols-3 gap-3 text-center divide-x divide-slate-100">
                {weatherData.forecast?.map((item, idx) => (
                  <div key={`${item.day}-${idx}`} className="space-y-3 px-2">
                    <p className="text-xs font-semibold text-slate-500">{item.day}</p>
                    <div className="flex justify-center">
                      {getWeatherIcon(item.code, 'w-8 h-8')}
                    </div>
                    <p className="text-lg font-bold text-slate-900">{item.temp}</p>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.risk === 'High Risk'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {item.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
