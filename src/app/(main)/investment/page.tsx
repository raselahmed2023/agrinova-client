"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  HandCoins,
  MapPin,
  Percent,
  SearchCheck,
  Sprout,
  WalletCards,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import {
  getApprovedInvestmentProjects,
} from "@/services/investment.service";

import type {
  InvestmentProject,
} from "@/types/investment";



const money = (
  value: number
) =>
  `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD"
  )}`;

const categoryLabel = (
  value: string
) =>
  String(value || "Agriculture")
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");



export default function InvestmentPage() {
  const [
    projects,
    setProjects,
  ] =
    useState<
      InvestmentProject[]
    >([]);

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

  const loadProjects =
    async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getApprovedInvestmentProjects();

        setProjects(
          Array.isArray(
            result.data
          )
            ? result.data
            : []
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load investment projects."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadProjects();
  }, []);

  return (
    <MarketplaceBackground overlayClassName="bg-white/75">
      <main className="mx-auto w-full max-w-[1760px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 xl:px-8 2xl:px-10">


        <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/92 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-[28%] h-64 w-64 rounded-full bg-amber-100/45 blur-3xl" />

          <div className="relative grid gap-6 px-5 py-7 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-10 lg:px-9 xl:px-12 xl:py-10">

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800">
                <HandCoins className="h-3.5 w-3.5" />
                AgriNova Investment
              </div>

              <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[44px] lg:leading-[1.05]">
                Invest in agriculture with
                <span className="text-emerald-700">
                  {" "}clear project terms.
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                Review approved farming opportunities, compare funding goals,
                minimum investment, duration and projected return before you
                decide to invest.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <HeroPill
                  icon={
                    <BadgeCheck className="h-3.5 w-3.5" />
                  }
                  text="Approved projects"
                />

                <HeroPill
                  icon={
                    <SearchCheck className="h-3.5 w-3.5" />
                  }
                  text="Transparent terms"
                />

                <HeroPill
                  icon={
                    <Percent className="h-3.5 w-3.5" />
                  }
                  text="Projected return"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-1">
              <HeroMetric
                label="Available Projects"
                value={
                  loading
                    ? "..."
                    : String(
                        projects.length
                      )
                }
                icon={
                  <Sprout className="h-5 w-5" />
                }
              />

              <HeroMetric
                label="Project Status"
                value="Approved"
                icon={
                  <BadgeCheck className="h-5 w-5" />
                }
              />

              <HeroMetric
                label="Investment Flow"
                value="Review → Invest"
                icon={
                  <HandCoins className="h-5 w-5" />
                }
              />
            </div>
          </div>
        </section>



        <section className="mt-7 sm:mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Investment Opportunities
              </p>

              <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Approved Projects
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Explore projects in a compact card view and compare the most
                important investment information at a glance.
              </p>
            </div>

            {!loading &&
              projects.length >
                0 && (
                <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
                  {projects.length}{" "}
                  {projects.length ===
                  1
                    ? "project"
                    : "projects"}
                </div>
              )}
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
        </section>



        <section className="mt-5">
          {loading ? (
            <ProjectSkeletonGrid />
          ) : projects.length ===
            0 ? (
            <div className="rounded-[24px] border border-white/80 bg-white/92 px-6 py-14 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Sprout className="h-6 w-6" />
              </div>

              <p className="mt-4 font-black text-slate-900">
                No investment projects available.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Approved opportunities will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
              {projects.map(
                (
                  project
                ) => (
                  <ProjectCard
                    key={
                      project._id
                    }
                    project={
                      project
                    }
                  />
                )
              )}
            </div>
          )}
        </section>



        <section className="mt-8 overflow-hidden rounded-[28px] border border-white/80 bg-white/92 p-5 shadow-[0_20px_65px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-6 lg:p-7">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Simple Process
              </p>

              <h2 className="mt-1.5 text-xl font-black text-slate-950 sm:text-2xl">
                How Investment Works
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-500">
              Review the opportunity, choose your amount and submit your
              investment for confirmation.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">

            <HowStep
              number="01"
              icon={
                <SearchCheck className="h-4 w-4" />
              }
              title="Review"
              text="Compare funding goal, minimum amount, duration and projected ROI."
            />

            <HowStep
              number="02"
              icon={
                <HandCoins className="h-4 w-4" />
              }
              title="Invest"
              text="Choose your investment amount and review the projected return."
            />

            <HowStep
              number="03"
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              title="Confirm"
              text="After Admin approval and payment confirmation, the investment is recorded."
            />
          </div>
        </section>
      </main>
    </MarketplaceBackground>
  );
}



function ProjectCard({
  project,
}: {
  project:
    InvestmentProject;
}) {
  const funded =
    Number(
      project.fundedAmount ||
        0
    );

  const goal =
    Number(
      project.requiredInvestment ||
        0
    );

  const roi =
    Number(
      project.expectedReturnPercent ||
        0
    );

  const progress =
    goal >
    0
      ? Math.min(
          Math.round(
            (
              funded /
              goal
            ) *
              100
          ),
          100
        )
      : 0;

  const minimumProfit =
    Number(
      (
        Number(
          project.minimumInvestment ||
            0
        ) *
        (
          roi /
          100
        )
      ).toFixed(
        2
      )
    );

  const location =
    [
      project.upazila,
      project.district,
      project.division,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-slate-200/90 bg-white/95 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.42)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_55px_-30px_rgba(4,120,87,0.35)]">

      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
        {project.projectImage ? (
          <img
            src={
              project.projectImage
            }
            alt={
              project.projectName
            }
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sprout className="h-9 w-9 text-emerald-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

        <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-20px)] truncate rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-emerald-800 shadow-sm">
          {categoryLabel(
            project.category
          )}
        </span>

        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-700/95 px-2 py-1 text-[8px] font-black uppercase text-white">
          <BadgeCheck className="h-2.5 w-2.5" />
          Approved
        </span>
      </div>

      {/* BODY */}

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">

        <div>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-black leading-5 text-slate-950 sm:text-[15px]">
            {project.projectName}
          </h3>

          <div className="mt-1.5 flex min-w-0 items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="h-3 w-3 shrink-0 text-emerald-700" />

            <span className="truncate">
              {location ||
                "Location unavailable"}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 min-h-[36px] text-[11px] leading-[18px] text-slate-500">
            {project.description ||
              "Approved agricultural investment opportunity."}
          </p>
        </div>

        {/* KEY STATS */}

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <MiniStat
            icon={
              <WalletCards className="h-3 w-3" />
            }
            label="Minimum"
            value={
              money(
                project.minimumInvestment
              )
            }
          />

          <MiniStat
            icon={
              <Percent className="h-3 w-3" />
            }
            label="ROI"
            value={`${roi}%`}
            highlight
          />

          <MiniStat
            icon={
              <CalendarDays className="h-3 w-3" />
            }
            label="Term"
            value={`${project.durationMonths} mo`}
          />

          <MiniStat
            icon={
              <HandCoins className="h-3 w-3" />
            }
            label="Goal"
            value={
              money(
                project.requiredInvestment
              )
            }
          />
        </div>

        {/* MINIMUM RETURN */}

        <div className="mt-2.5 rounded-xl border border-emerald-100 bg-emerald-50/75 px-2.5 py-2">
          <p className="text-[8px] font-black uppercase tracking-wide text-emerald-700">
            Minimum investment example
          </p>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold text-slate-600">
              {money(
                project.minimumInvestment
              )}
            </span>

            <span className="shrink-0 text-[10px] font-black text-emerald-700">
              +{money(
                minimumProfit
              )}
            </span>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[9px] font-bold">
            <span className="truncate text-slate-400">
              {money(
                funded
              )} funded
            </span>

            <span className="shrink-0 text-emerald-700">
              {progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width:
                  `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-auto pt-3">
          <Link
            href={`/investment/${project._id}`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
          >
            View Details
          </Link>

          <Link
            href={`/investment/${project._id}/invest`}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#07583f] px-3 py-2.5 text-[10px] font-black text-white shadow-sm transition hover:bg-[#064733]"
          >
            Invest Now

            <ArrowRight className="h-3 w-3" />
          </Link>

          {project.projectCode && (
            <p className="mt-2 truncate text-center font-mono text-[8px] text-slate-300">
              {project.projectCode}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}



function HeroPill({
  icon,
  text,
}: {
  icon:
    ReactNode;

  text:
    string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm">
      <span className="text-emerald-700">
        {icon}
      </span>

      {text}
    </div>
  );
}

function HeroMetric({
  label,
  value,
  icon,
}: {
  label:
    string;

  value:
    string;

  icon:
    ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/90 bg-white/78 p-3 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.38)] backdrop-blur-lg sm:p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[8px] font-black uppercase tracking-wide text-slate-400 sm:text-[9px]">
            {label}
          </p>

          <p className="mt-0.5 truncate text-xs font-black text-slate-900 sm:text-sm">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon:
    ReactNode;

  label:
    string;

  value:
    string;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border px-2 py-2 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div
        className={`flex min-w-0 items-center gap-1 text-[7px] font-black uppercase tracking-wide ${
          highlight
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        <span className="shrink-0">
          {icon}
        </span>

        <span className="truncate">
          {label}
        </span>
      </div>

      <p
        className={`mt-1 truncate text-[10px] font-black sm:text-[11px] ${
          highlight
            ? "text-emerald-800"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function HowStep({
  number,
  icon,
  title,
  text,
}: {
  number:
    string;

  icon:
    ReactNode;

  title:
    string;

  text:
    string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          {icon}
        </div>

        <span className="text-xl font-black text-slate-200">
          {number}
        </span>
      </div>

      <p className="mt-3 text-sm font-black text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function ProjectSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
      {Array.from({
        length:
          10,
      }).map(
        (
          _,
          index
        ) => (
          <div
            key={
              index
            }
            className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white/90"
          >
            <div className="aspect-[4/3] animate-pulse bg-slate-100" />

            <div className="space-y-3 p-3">
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-slate-100" />

              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              </div>

              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-9 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        )
      )}
    </div>
  );
}
