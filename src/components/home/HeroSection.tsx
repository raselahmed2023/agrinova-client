"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Moon,
  Snowflake,
  Sun,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type WeatherKind =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "thunder";

type WeatherData = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  condition: string;
  kind: WeatherKind;
  updatedAt: Date;
};

type Coordinates = {
  latitude: number;
  longitude: number;
  source: "device" | "fallback";
};

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
    rain?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    is_day?: number;
  };
};

const metrics = [
  {
    label: "Active Farmers",
    value: "50k+",
  },
  {
    label: "Accuracy Rate",
    value: "98%",
  },
  {
    label: "Crop Types",
    value: "40+",
  },
];

const FALLBACK_LOCATION = {
  latitude: 23.8103,
  longitude: 90.4125,
};

function getWeatherMeta(
  code: number,
): {
  condition: string;
  kind: WeatherKind;
} {
  if (code === 0) {
    return {
      condition: "Clear Sky",
      kind: "clear",
    };
  }

  if (code === 1 || code === 2) {
    return {
      condition: "Partly Cloudy",
      kind: "partly-cloudy",
    };
  }

  if (code === 3) {
    return {
      condition: "Overcast",
      kind: "cloudy",
    };
  }

  if (code === 45 || code === 48) {
    return {
      condition: "Foggy",
      kind: "fog",
    };
  }

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
      code,
    )
  ) {
    return {
      condition:
        code >= 80 ? "Rain Showers" : "Rain",
      kind: "rain",
    };
  }

  if (
    [71, 73, 75, 77, 85, 86].includes(code)
  ) {
    return {
      condition: "Snow",
      kind: "snow",
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      condition: "Thunderstorm",
      kind: "thunder",
    };
  }

  return {
    condition: "Cloudy",
    kind: "cloudy",
  };
}

function WeatherIcon({
  kind,
  isDay,
  className = "h-7 w-7",
}: {
  kind: WeatherKind;
  isDay: boolean;
  className?: string;
}) {
  switch (kind) {
    case "clear":
      return isDay ? (
        <Sun className={className} />
      ) : (
        <Moon className={className} />
      );

    case "partly-cloudy":
      return (
        <CloudSun className={className} />
      );

    case "cloudy":
      return <Cloud className={className} />;

    case "fog":
      return (
        <CloudFog className={className} />
      );

    case "rain":
      return (
        <CloudRain className={className} />
      );

    case "snow":
      return (
        <Snowflake className={className} />
      );

    case "thunder":
      return (
        <CloudLightning
          className={className}
        />
      );

    default:
      return <Cloud className={className} />;
  }
}

function WeatherAnimation({
  kind,
  isDay,
}: {
  kind: WeatherKind;
  isDay: boolean;
}) {
  if (kind === "rain") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/10" />

        {Array.from({ length: 28 }).map(
          (_, index) => (
            <span
              key={index}
              className="weather-rain-drop absolute -top-10 h-7 w-[1.5px] rounded-full bg-white/70"
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${
                  (index % 8) * 0.13
                }s`,
                animationDuration: `${
                  0.72 +
                  (index % 6) * 0.08
                }s`,
              }}
            />
          ),
        )}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/25 to-transparent" />
      </div>
    );
  }

  if (kind === "snow") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {Array.from({ length: 26 }).map(
          (_, index) => (
            <span
              key={index}
              className="weather-snowflake absolute -top-8 block rounded-full bg-white/90"
              style={{
                left: `${(index * 43) % 100}%`,
                width: `${
                  4 + (index % 4) * 2
                }px`,
                height: `${
                  4 + (index % 4) * 2
                }px`,
                animationDelay: `${
                  (index % 9) * 0.18
                }s`,
                animationDuration: `${
                  3 + (index % 5) * 0.55
                }s`,
              }}
            />
          ),
        )}
      </div>
    );
  }

  if (kind === "thunder") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden bg-slate-950/15">
        {Array.from({ length: 20 }).map(
          (_, index) => (
            <span
              key={index}
              className="weather-rain-drop absolute -top-10 h-8 w-[1.5px] bg-white/60"
              style={{
                left: `${(index * 41) % 100}%`,
                animationDelay: `${
                  (index % 7) * 0.12
                }s`,
                animationDuration: "0.68s",
              }}
            />
          ),
        )}

        <div className="weather-lightning absolute inset-0 bg-white/0" />
      </div>
    );
  }

  if (kind === "fog") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="weather-fog absolute left-[-30%] top-[28%] h-14 w-[130%] rounded-full bg-white/15 blur-xl" />

        <div className="weather-fog weather-fog-delay absolute left-[-40%] top-[48%] h-16 w-[140%] rounded-full bg-white/20 blur-2xl" />

        <div className="weather-fog absolute left-[-20%] top-[68%] h-12 w-[120%] rounded-full bg-white/10 blur-xl" />
      </div>
    );
  }

  if (
    kind === "cloudy" ||
    kind === "partly-cloudy"
  ) {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <Cloud className="weather-cloud absolute -left-16 top-12 h-28 w-28 text-white/20" />

        <Cloud className="weather-cloud weather-cloud-second absolute right-8 top-24 h-20 w-20 text-white/20" />

        {kind === "partly-cloudy" &&
          isDay && (
            <div className="weather-sun-glow absolute right-10 top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
          )}
      </div>
    );
  }

  if (kind === "clear") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {isDay ? (
          <>
            <div className="weather-sun-glow absolute -right-12 -top-12 h-52 w-52 rounded-full bg-amber-300/30 blur-3xl" />

            <div className="weather-sun-pulse absolute right-10 top-10 h-16 w-16 rounded-full border border-amber-100/40 bg-amber-200/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-indigo-950/15" />
        )}
      </div>
    );
  }

  return null;
}

export default function HeroSection() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [coordinates, setCoordinates] =
    useState<Coordinates | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [weatherError, setWeatherError] =
    useState(false);

  const fetchWeather = useCallback(
    async (
      latitude: number,
      longitude: number,
    ) => {
      try {
        setWeatherError(false);

        const params =
          new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            current:
              "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m,is_day",
            timezone: "auto",
          });

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Weather request failed",
          );
        }

        const data =
          (await response.json()) as OpenMeteoResponse;

        if (!data.current) {
          throw new Error(
            "Current weather unavailable",
          );
        }

        const code =
          data.current.weather_code ?? 0;

        const meta =
          getWeatherMeta(code);

        setWeather({
          temperature:
            data.current.temperature_2m ??
            0,
          apparentTemperature:
            data.current
              .apparent_temperature ?? 0,
          humidity:
            data.current
              .relative_humidity_2m ?? 0,
          precipitation:
            data.current.precipitation ??
            0,
          rain: data.current.rain ?? 0,
          windSpeed:
            data.current
              .wind_speed_10m ?? 0,
          weatherCode: code,
          isDay:
            data.current.is_day !== 0,
          condition: meta.condition,
          kind: meta.kind,
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error(
          "Weather fetch failed:",
          error,
        );

        setWeatherError(true);
      } finally {
        setWeatherLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let refreshInterval:
      | ReturnType<typeof setInterval>
      | undefined;

    let cancelled = false;

    const initializeWeather = async () => {
      const useCoordinates = (
        coords: Coordinates,
      ) => {
        if (cancelled) return;

        setCoordinates(coords);

        fetchWeather(
          coords.latitude,
          coords.longitude,
        );

        refreshInterval = setInterval(
          () => {
            fetchWeather(
              coords.latitude,
              coords.longitude,
            );
          },
          10 * 60 * 1000,
        );
      };

      if (
        typeof navigator ===
          "undefined" ||
        !navigator.geolocation
      ) {
        useCoordinates({
          ...FALLBACK_LOCATION,
          source: "fallback",
        });

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          useCoordinates({
            latitude:
              position.coords.latitude,
            longitude:
              position.coords.longitude,
            source: "device",
          });
        },
        () => {
          useCoordinates({
            ...FALLBACK_LOCATION,
            source: "fallback",
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 7000,
          maximumAge: 15 * 60 * 1000,
        },
      );
    };

    initializeWeather();

    return () => {
      cancelled = true;

      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [fetchWeather]);

  return (
    <>
      <section
        aria-labelledby="hero-title"
        className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[radial-gradient(circle_at_75%_20%,#f8fffd_0%,#edf8f5_36%,#e3f1ee_68%,#dcebea_100%)] px-5 py-12 sm:px-8 lg:px-12 lg:py-16"
      >
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,.9fr)_minmax(480px,1.1fr)] lg:gap-16">
          {/* LEFT */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="max-w-xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-700/10 bg-white/50 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>

              AI-powered agriculture
            </div>

            <h1
              id="hero-title"
              className="max-w-[590px] text-[clamp(3rem,6vw,5.25rem)] font-black leading-[0.96] tracking-[-0.055em] text-[#063d2d]"
            >
              Smarter Farming
              <span className="block text-emerald-700">
                Starts Here.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-[15px] leading-7 text-[#45615a] sm:text-base">
              Turn real-time weather,
              intelligent crop insights and
              agricultural expertise into
              better decisions for every
              season.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#063d2d] px-6 text-sm font-bold text-white shadow-[0_12px_28px_rgba(6,61,45,.20)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#07533d]"
              >
                Get Started

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#b9cbc6] bg-white/55 px-6 text-sm font-bold text-[#123f33] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                Explore Features
              </a>
            </div>

            <dl className="mt-11 grid grid-cols-3 gap-3">
              {metrics.map(
                (metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.45 +
                        index * 0.1,
                    }}
                    className="rounded-2xl border border-white/80 bg-white/45 px-3 py-4 shadow-sm backdrop-blur sm:px-4"
                  >
                    <dt className="truncate text-[10px] font-medium text-[#58706a] sm:text-xs">
                      {metric.label}
                    </dt>

                    <dd className="mt-1.5 text-xl font-black tracking-tight text-[#063d2d] sm:text-2xl">
                      {metric.value}
                    </dd>
                  </motion.div>
                ),
              )}
            </dl>
          </motion.div>

          {/* RIGHT IMAGE + LIVE WEATHER */}
          <motion.div
            initial={{
              opacity: 0,
              x: 35,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.85,
              delay: 0.12,
              ease: "easeOut",
            }}
            className="relative mx-auto w-full max-w-[720px]"
          >
            <div className="relative aspect-[1.18/1] overflow-hidden rounded-[30px] border-[5px] border-white/80 bg-slate-200 shadow-[0_35px_80px_rgba(29,72,61,.24)]">
              {/* Existing image */}
              <Image
                src="/images/home/banner-image.jpeg"
                alt="Farmer using smart agricultural technology in a crop field"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              {/* cinematic overlays */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#021c16]/70 via-transparent to-black/10" />

              <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#023628]/10 via-transparent to-transparent" />

              {/* Dynamic weather animation */}
              {weather && (
                <WeatherAnimation
                  kind={weather.kind}
                  isDay={weather.isDay}
                />
              )}

              {/* LIVE pill */}
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur-xl sm:left-7 sm:top-7">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />

                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                LIVE WEATHER
              </div>

              {/* Main weather card */}
              <AnimatePresence mode="wait">
                {weatherLoading ? (
                  <motion.div
                    key="loading"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/20 bg-[#032820]/65 p-5 text-white shadow-2xl backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7"
                  >
                    <div className="h-4 w-32 animate-pulse rounded bg-white/20" />

                    <div className="mt-4 h-10 w-48 animate-pulse rounded bg-white/15" />
                  </motion.div>
                ) : weather ? (
                  <motion.div
                    key={`${weather.kind}-${weather.weatherCode}`}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="absolute bottom-5 left-5 right-5 z-20 overflow-hidden rounded-[22px] border border-white/20 bg-[#02271f]/70 p-4 text-white shadow-[0_20px_50px_rgba(0,0,0,.25)] backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7 sm:p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={
                            weather.kind ===
                            "clear"
                              ? {
                                  rotate: [
                                    0,
                                    360,
                                  ],
                                }
                              : {
                                  y: [
                                    0,
                                    -3,
                                    0,
                                  ],
                                }
                          }
                          transition={{
                            duration:
                              weather.kind ===
                              "clear"
                                ? 20
                                : 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-emerald-200"
                        >
                          <WeatherIcon
                            kind={
                              weather.kind
                            }
                            isDay={
                              weather.isDay
                            }
                            className="h-7 w-7"
                          />
                        </motion.div>

                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/65">
                            <MapPin className="h-3.5 w-3.5" />

                            {coordinates?.source ===
                            "device"
                              ? "Your local weather"
                              : "Dhaka weather"}
                          </div>

                          <div className="mt-1 flex items-end gap-3">
                            <span className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                              {Math.round(
                                weather.temperature,
                              )}
                              °
                            </span>

                            <div className="pb-1">
                              <p className="text-sm font-bold text-white">
                                {
                                  weather.condition
                                }
                              </p>

                              <p className="text-[11px] text-white/55">
                                Feels like{" "}
                                {Math.round(
                                  weather.apparentTemperature,
                                )}
                                °C
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:min-w-[260px]">
                        <WeatherStat
                          icon={
                            Droplets
                          }
                          label="Humidity"
                          value={`${Math.round(
                            weather.humidity,
                          )}%`}
                        />

                        <WeatherStat
                          icon={Wind}
                          label="Wind"
                          value={`${Math.round(
                            weather.windSpeed,
                          )} km/h`}
                        />

                        <WeatherStat
                          icon={
                            CloudRain
                          }
                          label="Rain"
                          value={`${weather.precipitation.toFixed(
                            1,
                          )} mm`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/45">
                      <span>
                        Current conditions ·
                        Auto refresh
                      </span>

                      <span>
                        Updated{" "}
                        {weather.updatedAt.toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute:
                              "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </motion.div>
                ) : weatherError ? (
                  <motion.div
                    key="error"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/20 bg-black/40 p-4 text-sm text-white backdrop-blur-xl"
                  >
                    Live weather is temporarily
                    unavailable.
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* floating small card */}
            {weather && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  x: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.8,
                }}
                className="absolute -right-2 top-[23%] z-30 hidden rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-xl sm:block lg:-right-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Farm Condition
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-sm font-black text-emerald-800">
                    LIVE MONITORING
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Weather animation CSS */}
      <style jsx global>{`
        @keyframes weatherRain {
          0% {
            transform: translate3d(0, -35px, 0)
              rotate(10deg);
            opacity: 0;
          }

          15% {
            opacity: 0.8;
          }

          100% {
            transform: translate3d(-18px, 650px, 0)
              rotate(10deg);
            opacity: 0.2;
          }
        }

        .weather-rain-drop {
          animation-name: weatherRain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes weatherSnow {
          0% {
            transform: translate3d(0, -20px, 0)
              rotate(0deg);
            opacity: 0;
          }

          15% {
            opacity: 0.95;
          }

          50% {
            transform: translate3d(
                20px,
                300px,
                0
              )
              rotate(180deg);
          }

          100% {
            transform: translate3d(
                -12px,
                650px,
                0
              )
              rotate(360deg);
            opacity: 0;
          }
        }

        .weather-snowflake {
          animation-name: weatherSnow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes weatherLightning {
          0%,
          89%,
          94%,
          100% {
            background: rgba(
              255,
              255,
              255,
              0
            );
          }

          90% {
            background: rgba(
              255,
              255,
              255,
              0.45
            );
          }

          92% {
            background: rgba(
              255,
              255,
              255,
              0.08
            );
          }

          93% {
            background: rgba(
              255,
              255,
              255,
              0.28
            );
          }
        }

        .weather-lightning {
          animation: weatherLightning 5s
            infinite;
        }

        @keyframes weatherCloud {
          0% {
            transform: translateX(-15px);
          }

          50% {
            transform: translateX(22px);
          }

          100% {
            transform: translateX(-15px);
          }
        }

        .weather-cloud {
          animation: weatherCloud 10s
            ease-in-out infinite;
        }

        .weather-cloud-second {
          animation-duration: 14s;
          animation-delay: -3s;
        }

        @keyframes weatherFog {
          0% {
            transform: translateX(-4%);
            opacity: 0.25;
          }

          50% {
            transform: translateX(8%);
            opacity: 0.65;
          }

          100% {
            transform: translateX(-4%);
            opacity: 0.25;
          }
        }

        .weather-fog {
          animation: weatherFog 9s
            ease-in-out infinite;
        }

        .weather-fog-delay {
          animation-delay: -4s;
          animation-duration: 12s;
        }

        @keyframes weatherSunGlow {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.6;
          }

          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .weather-sun-glow,
        .weather-sun-pulse {
          animation: weatherSunGlow 4s
            ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

function WeatherStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] px-2.5 py-2.5">
      <Icon className="mb-1.5 h-3.5 w-3.5 text-emerald-300" />

      <p className="text-[9px] text-white/45">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-bold text-white">
        {value}
      </p>
    </div>
  );
}