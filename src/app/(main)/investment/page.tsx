"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  HandCoins,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  getApprovedInvestmentProjects,
} from "@/services/investment.service";

import type {
  InvestmentCategory,
  InvestmentProject,
} from "@/types/investment";

const categories: Array<{
  value:
    | ""
    | InvestmentCategory;

  label:
    string;
}> = [
  {
    value: "",
    label:
      "All categories",
  },

  {
    value:
      "organic_farming",
    label:
      "Organic Farming",
  },

  {
    value:
      "poultry",
    label:
      "Poultry",
  },

  {
    value:
      "vegetable_farming",
    label:
      "Vegetable Farming",
  },

  {
    value:
      "greenhouse",
    label:
      "Greenhouse",
  },

  {
    value:
      "irrigation",
    label:
      "Irrigation",
  },

  {
    value:
      "equipment",
    label:
      "Equipment",
  },

  {
    value:
      "technology",
    label:
      "Technology",
  },

  {
    value:
      "livestock",
    label:
      "Livestock",
  },

  {
    value:
      "fishery",
    label:
      "Fishery",
  },

  {
    value:
      "other",
    label:
      "Other",
  },
];

const categoryLabel =
  (
    value:
      string
  ) =>
    value
      .split(
        "_"
      )
      .map(
        (
          word:
            string
        ) =>
          word
            .charAt(
              0
            )
            .toUpperCase() +
          word.slice(
            1
          )
      )
      .join(
        " "
      );

const formatMoney =
  (
    value:
      number
  ) =>
    `৳${Number(
      value || 0
    ).toLocaleString(
      "en-BD"
    )}`;

export default function InvestmentPublicPage() {
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
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    category,
    setCategory,
  ] =
    useState<
      | ""
      | InvestmentCategory
    >("");

 

  const loadProjects =
    async () => {
      try {
        setLoading(
          true
        );

        setError(
          ""
        );

        const query =
          new URLSearchParams(
            {
              limit:
                "60",
            }
          );

        if (
          search.trim()
        ) {
          query.set(
            "search",
            search.trim()
          );
        }

        if (
          category
        ) {
          query.set(
            "category",
            category
          );
        }

        const result =
          await getApprovedInvestmentProjects(
            query.toString()
          );

        setProjects(
          result.data
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load investment projects"
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  useEffect(() => {
    void loadProjects();

  
  }, []);

  const totalOpen =
    useMemo(
      () =>
        projects.filter(
          (
            project:
              InvestmentProject
          ) =>
            project
              .fundingStatus ===
            "OPEN"
        ).length,

      [projects]
    );

  return (
    <main className="min-h-screen bg-[#f6f8f6]">

    

      <section className="relative overflow-hidden border-b border-emerald-100 bg-[#062f25] text-white">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-20">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50">
              <ShieldCheck className="h-4 w-4" />

              Admin-reviewed opportunities
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Support real
              agricultural projects.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/80 sm:text-lg">
              Discover funding
              requests from AgriNova
              farmers. Every project
              shown publicly has passed
              an Admin review before
              becoming available for
              investment applications.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">

              <span className="rounded-xl bg-white/10 px-4 py-2">
                {
                  projects.length
                }{" "}
                projects loaded
              </span>

              <span className="rounded-xl bg-white/10 px-4 py-2">
                {
                  totalOpen
                }{" "}
                accepting investments
              </span>

              <span className="rounded-xl bg-white/10 px-4 py-2">
                Bank transfer + Stripe
              </span>
            </div>
          </div>

          {/* HOW IT WORKS */}

          <div className="self-end rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur sm:p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300 text-emerald-950">
                <WalletCards className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold">
                  How it works
                </p>

                <p className="text-sm text-emerald-50/70">
                  Apply first. Pay only
                  after Admin approval.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">

              {[
                "Choose project",
                "Admin verifies",
                "Complete payment",
              ].map(
                (
                  step:
                    string,
                  index:
                    number
                ) => (
                  <div
                    key={
                      step
                    }
                    className="rounded-2xl bg-black/10 p-3"
                  >
                    <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 font-bold">
                      {
                        index +
                        1
                      }
                    </div>

                    {
                      step
                    }
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ======================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* SEARCH */}

        <div className="-mt-16 mb-10 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-5">

          <div className="grid gap-3 lg:grid-cols-[1fr_240px_auto]">

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">

              <Search className="h-5 w-5 text-slate-400" />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    void loadProjects();
                  }
                }}
                placeholder="Search project, farmer, farm or district..."
                className="w-full py-3.5 text-sm outline-none"
              />
            </label>

            <select
              value={
                category
              }
              onChange={(
                event
              ) =>
                setCategory(
                  event
                    .target
                    .value as
                    | ""
                    | InvestmentCategory
                )
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none focus:border-emerald-500"
            >
              {categories.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              onClick={() =>
                void loadProjects()
              }
              disabled={
                loading
              }
              className="flex min-h-12 items-center justify-center rounded-2xl bg-emerald-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Find projects"
              )}
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {
              error
            }
          </div>
        )}

        {/* ====================================================
            LOADING - SPINNER
        ===================================================== */}

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
            <Loader2
              role="status"
              aria-label="Loading investment projects"
              className="h-10 w-10 animate-spin text-emerald-700"
            />
          </div>
        ) : projects.length ===
          0 ? (

          /* EMPTY */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <HandCoins className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No approved projects found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try a different search
              or category.
            </p>
          </div>
        ) : (

          /* ==================================================
             PROJECT GRID
          =================================================== */

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {projects.map(
              (
                project:
                  InvestmentProject
              ) => {
                const funded =
                  Math.max(
                    0,
                    Number(
                      project.fundedAmount ||
                        0
                    )
                  );

                const goal =
                  Math.max(
                    1,
                    Number(
                      project.requiredInvestment ||
                        1
                    )
                  );

                const progress =
                  Math.min(
                    100,
                    Math.round(
                      (funded /
                        goal) *
                        100
                    )
                  );

                const remaining =
                  Math.max(
                    0,
                    goal -
                      funded
                  );

                return (
                  <article
                    key={
                      project._id
                    }
                    className="group flex overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                  >
                    <div className="flex w-full flex-col">

                      {/* IMAGE */}

                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-emerald-100 to-lime-50">

                        {project.projectImage ? (
                          <img
                            src={
                              project.projectImage
                            }
                            alt={
                              project.projectName
                            }
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <HandCoins className="h-16 w-16 text-emerald-700/40" />
                          </div>
                        )}

                        <div className="absolute left-4 top-4 flex flex-wrap gap-2">

                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm">
                            {categoryLabel(
                              project.category
                            )}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                              project.fundingStatus ===
                              "OPEN"
                                ? "bg-emerald-700 text-white"
                                : "bg-slate-800 text-white"
                            }`}
                          >
                            {project.fundingStatus ===
                            "OPEN"
                              ? "Open"
                              : project.fundingStatus}
                          </span>
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="flex flex-1 flex-col p-6">

                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                          {project.farmName ||
                            "AgriNova Farm"}
                        </p>

                        <h2 className="mt-2 line-clamp-2 text-xl font-black text-slate-950">
                          {
                            project.projectName
                          }
                        </h2>

                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 shrink-0" />

                          {[project.district, project.division]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        {/* FUNDING PROGRESS */}

                        <div className="mt-5">

                          <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-slate-500">

                            <span>
                              {formatMoney(
                                funded
                              )}{" "}
                              funded
                            </span>

                            <span>
                              {
                                progress
                              }
                              %
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-emerald-600 transition-all"
                              style={{
                                width:
                                  `${progress}%`,
                              }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-slate-400">
                            {formatMoney(
                              remaining
                            )}{" "}
                            remaining of{" "}
                            {formatMoney(
                              goal
                            )}
                          </p>
                        </div>

                        {/* PROJECT FACTS */}

                        <div className="mt-5 grid grid-cols-3 gap-2">

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] text-slate-400">
                              Minimum
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900">
                              {formatMoney(
                                project.minimumInvestment
                              )}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] text-slate-400">
                              Duration
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900">
                              {
                                project.durationMonths
                              }{" "}
                              mo
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] text-slate-400">
                              Funding goal
                            </p>

                            <p className="mt-1 text-sm font-black text-slate-900">
                              {formatMoney(
                                goal
                              )}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/investment/${project._id}`}
                          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                        >
                          View project

                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        {/* ====================================================
            RISK NOTICE
        ===================================================== */}

        <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">

          <TrendingUp className="mt-0.5 h-5 w-5 shrink-0" />

          <p>
            <strong>
              Investment risk notice:
            </strong>{" "}
            Agricultural projects
            involve financial and
            operational risk. Project
            approval by AgriNova does
            not guarantee profit,
            repayment, project success
            or any particular financial
            return. Review the project
            information carefully
            before submitting an
            investment application.
          </p>
        </div>
      </section>
    </main>
  );
}