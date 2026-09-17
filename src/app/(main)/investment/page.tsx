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

/* ============================================================
   HELPERS
============================================================ */

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
  value
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");

/* ============================================================
   PAGE
============================================================ */

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
    <MarketplaceBackground>
      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-5 lg:px-6">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/92 px-5 py-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-6">

          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative flex items-center justify-between gap-6">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-800">

                <HandCoins className="h-3.5 w-3.5" />

                AgriNova Investment
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Invest in Agriculture
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Compare approved farming
                projects, projected returns
                and investment terms before
                submitting your investment.
              </p>
            </div>

            <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 md:flex">

              <Sprout className="h-7 w-7" />
            </div>
          </div>
        </section>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mt-5">

          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
            Investment Opportunities
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-950">
            Approved Projects
          </h2>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            PROJECTS
        ================================================= */}

        <section className="mt-4">

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-[22px] border border-white/70 bg-white/90">

              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-700" />
            </div>
          ) : projects.length ===
            0 ? (
            <div className="rounded-[22px] border border-white/70 bg-white/90 px-6 py-12 text-center">

              <Sprout className="mx-auto h-7 w-7 text-emerald-700" />

              <p className="mt-3 font-black text-slate-900">
                No investment projects available.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

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

        {/* =================================================
            HOW INVESTMENT WORKS
        ================================================= */}

        <section className="mt-5 rounded-[22px] border border-white/75 bg-white/92 p-5 shadow-sm backdrop-blur-xl">

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Simple Process
            </p>

            <h2 className="mt-1 text-lg font-black text-slate-950">
              How Investment Works
            </h2>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">

            <HowStep
              number="01"
              icon={
                <SearchCheck className="h-4 w-4" />
              }
              title="Review"
              text="Compare the funding goal, term, minimum investment and projected ROI."
            />

            <HowStep
              number="02"
              icon={
                <HandCoins className="h-4 w-4" />
              }
              title="Invest"
              text="Choose your investment amount and see your projected profit before submitting."
            />

            <HowStep
              number="03"
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              title="Confirm"
              text="After Admin approval and payment confirmation, your investment is recorded."
            />
          </div>
        </section>
      </main>
    </MarketplaceBackground>
  );
}

/* ============================================================
   PROJECT CARD
============================================================ */

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
        project.minimumInvestment *
        (
          roi /
          100
        )
      ).toFixed(
        2
      )
    );

  const minimumTotal =
    Number(
      (
        project.minimumInvestment +
        minimumProfit
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
    <article className="overflow-hidden rounded-[22px] border border-white/80 bg-white/95 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.45)]">

      <div className="grid lg:grid-cols-[300px_1fr]">

        {/* IMAGE */}

        <div className="relative h-[190px] overflow-hidden bg-emerald-50 lg:h-full lg:min-h-[235px]">

          {project.projectImage ? (
            <img
              src={
                project.projectImage
              }
              alt={
                project.projectName
              }
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">

              <Sprout className="h-10 w-10 text-emerald-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black text-emerald-800">

            {categoryLabel(
              project.category
            )}
          </span>

          <h3 className="absolute bottom-4 left-4 right-4 text-xl font-black text-white">

            {
              project.projectName
            }
          </h3>
        </div>

        {/* BODY */}

        <div className="p-4 sm:p-5">

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-1 text-xs text-slate-500">

                  <MapPin className="h-3.5 w-3.5 text-emerald-700" />

                  {location ||
                    "Location unavailable"}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                {
                  project.description
                }
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">

              <BadgeCheck className="h-3 w-3" />

              Approved
            </span>
          </div>

          {/* TERMS */}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

            <Stat
              icon={
                <HandCoins className="h-3.5 w-3.5" />
              }
              label="Funding Goal"
              value={
                money(
                  project.requiredInvestment
                )
              }
            />

            <Stat
              icon={
                <WalletCards className="h-3.5 w-3.5" />
              }
              label="Minimum"
              value={
                money(
                  project.minimumInvestment
                )
              }
            />

            <Stat
              icon={
                <CalendarDays className="h-3.5 w-3.5" />
              }
              label="Term"
              value={`${project.durationMonths} months`}
            />

            <Stat
              icon={
                <Percent className="h-3.5 w-3.5" />
              }
              label="Projected ROI"
              value={`${roi}%`}
              highlight
            />
          </div>

          {/* RETURN EXAMPLE */}

          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[9px] font-black uppercase tracking-wide text-emerald-700">
                Example on minimum investment
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Invest{" "}
                <strong>
                  {money(
                    project.minimumInvestment
                  )}
                </strong>
                {" • "}
                projected profit{" "}
                <strong className="text-emerald-700">
                  +{money(
                    minimumProfit
                  )}
                </strong>
              </p>
            </div>

            <div className="text-left sm:text-right">

              <p className="text-[9px] font-black uppercase text-slate-400">
                Projected Total
              </p>

              <p className="text-sm font-black text-slate-900">
                {money(
                  minimumTotal
                )}
              </p>
            </div>
          </div>

          {/* PROGRESS */}

          <div className="mt-3">

            <div className="mb-1 flex justify-between text-[9px] font-bold text-slate-400">

              <span>
                {money(
                  funded
                )} funded
              </span>

              <span>
                {progress}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-emerald-600"
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* ACTION */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

            <p className="font-mono text-[10px] text-slate-400">
              {
                project.projectCode
              }
            </p>

            <div className="flex gap-2">

              <Link
                href={`/investment/${project._id}`}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
              >
                View Details
              </Link>

              <Link
                href={`/investment/${project._id}/invest`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#07583f] px-4 py-2.5 text-xs font-black text-white hover:bg-[#064733]"
              >
                Invest Now

                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Stat({
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
      className={`rounded-xl border px-3 py-2.5 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >

      <div
        className={`flex items-center gap-1 text-[8px] font-black uppercase ${
          highlight
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        {icon}

        {label}
      </div>

      <p
        className={`mt-1 text-xs font-black ${
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
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

      <div className="flex justify-between">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          {icon}
        </div>

        <span className="text-lg font-black text-slate-200">
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