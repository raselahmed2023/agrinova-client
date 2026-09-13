"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  HandCoins,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  getApprovedInvestmentProjects,
} from "@/services/investment.service";

import type {
  InvestmentCategory,
  InvestmentProject,
} from "@/types/investment";



const categoryLabels: Record<
  InvestmentCategory,
  string
> = {
  organic_farming: "Organic Farming",
  poultry: "Poultry",
  vegetable_farming: "Vegetable Farming",
  greenhouse: "Greenhouse",
  irrigation: "Irrigation",
  equipment: "Equipment",
  technology: "Technology",
  livestock: "Livestock",
  fishery: "Fishery",
  other: "Other",
};

const heroCategories = [
  "Organic Farming",
  "Poultry",
  "Vegetable Farming",
  "Greenhouse",
  "Irrigation",
  "Technology",
];



const formatMoney = (
  value: number
) =>
  `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD",
    {
      maximumFractionDigits: 2,
    }
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
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");



  const loadProjects =
    useCallback(
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
        } catch (err) {
          setProjects([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load investment projects."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return (
    <main className="min-h-screen bg-[#F5F8F3]">


      <section className="relative overflow-hidden px-3 py-6 sm:px-4 lg:px-5 lg:py-8">
        {/* BACKGROUND IMAGE */}

        <div className="absolute inset-0 -z-20">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/marketplace-bg.jpg')",
            }}
          />

          <div className="absolute inset-0 bg-white/5" />

          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-emerald-950/5" />
        </div>

        <div className="mx-auto w-full max-w-[1600px]">
          {/* GLASS CARD */}

          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/65 shadow-xl shadow-slate-900/10 backdrop-blur-md">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:p-9">


              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />

                  AgriNova Investment
                </div>

                <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  Invest in{" "}
                  <span className="text-emerald-700">
                    Agricultural
                    Projects
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  Support verified
                  AgriNova farmers
                  and promising
                  agricultural
                  projects across
                  Bangladesh.
                </p>

                {/* CATEGORIES */}

                <div className="mt-6">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Investment
                    Opportunities
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {heroCategories.map(
                      (
                        category
                      ) => (
                        <span
                          key={
                            category
                          }
                          className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700"
                        >
                          {
                            category
                          }
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>



              <div className="rounded-[24px] border border-white/70 bg-white/55 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <HandCoins className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      How it works
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Simple and secure
                      investment process.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {/* STEP 1 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      1
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Choose
                      Project
                    </p>
                  </div>

                  {/* STEP 2 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      2
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Admin
                      Verifies
                    </p>
                  </div>

                  {/* STEP 3 */}

                  <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                      3
                    </div>

                    <p className="mt-3 text-xs font-bold leading-5 text-slate-800">
                      Complete
                      Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="mx-auto w-full max-w-[1600px] px-3 pb-16 pt-2 sm:px-4 lg:px-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles className="h-4 w-4" />

                Public Investment
                Listings
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                Available Projects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Browse
                admin-approved
                agricultural
                projects available
                for investment.
              </p>
            </div>

            {!loading &&
              projects.length >
              0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {
                    projects.length
                  }{" "}
                  project
                  {projects.length ===
                    1
                    ? ""
                    : "s"}
                </span>
              )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}



          {loading ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({
                length: 6,
              }).map(
                (
                  _,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="overflow-hidden rounded-[24px] border border-slate-200 bg-white"
                  >
                    <div className="h-52 animate-pulse bg-slate-100" />

                    <div className="space-y-4 p-5">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                      <div className="h-6 w-2/3 animate-pulse rounded bg-slate-100" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />

                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />

                        <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                      </div>

                      <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : projects.length ===
            0 ? (


            <div className="mt-6 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <HandCoins className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No investment
                projects available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                New agricultural
                projects will appear
                here after they are
                reviewed and
                approved by
                AgriNova.
              </p>
            </div>
          ) : (


            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map(
                (
                  project
                ) => (
                  <article
                    key={
                      project._id
                    }
                    className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* PROJECT IMAGE */}

                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {project.projectImage ? (
                        <img
                          src={
                            project.projectImage
                          }
                          alt={
                            project.projectName
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-[#E7F2E9] text-emerald-700">
                          <HandCoins className="h-14 w-14" />
                        </div>
                      )}

                      {/* IMAGE OVERLAY */}

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                        <div className="flex items-end justify-between gap-3">
                          <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-emerald-700 backdrop-blur">
                            {
                              categoryLabels[
                              project.category
                              ]
                            }
                          </span>

                          {project.projectCode && (
                            <span className="rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
                              {
                                project.projectCode
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}

                    <div className="p-5">
                      <h3 className="line-clamp-2 text-lg font-extrabold tracking-tight text-slate-900">
                        {
                          project.projectName
                        }
                      </h3>

                      {/* LOCATION */}

                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                        {[
                          project.upazila,
                          project.district,
                          project.division,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            ", "
                          )}
                      </p>

                      {/* DESCRIPTION */}

                      <p className="mt-4 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {
                          project.description
                        }
                      </p>

                      {/* INVESTMENT INFO */}

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Investment
                            Required
                          </p>

                          <p className="mt-1.5 text-base font-extrabold text-slate-900">
                            {formatMoney(
                              project.requiredInvestment
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-3.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Duration
                          </p>

                          <p className="mt-1.5 text-base font-extrabold text-slate-900">
                            {project.durationMonths}{" "}
                            {project.durationMonths === 1
                              ? "Month"
                              : "Months"}
                          </p>
                        </div>
                      </div>

                      {/* RETURNS */}

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <HandCoins className="h-3.5 w-3.5" />

                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              Minimum Investment
                            </span>
                          </div>

                          <p className="mt-1.5 text-sm font-bold text-emerald-800">
                            {formatMoney(
                              project.minimumInvestment
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />

                            <span className="text-[10px] font-bold uppercase tracking-wide">
                              Funded Amount
                            </span>
                          </div>

                          <p className="mt-1.5 text-sm font-bold text-slate-800">
                            {formatMoney(
                              project.fundedAmount
                            )}
                          </p>
                        </div>
                      </div>

                      {/* APPROVAL */}

                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />

                        <p className="text-[11px] font-semibold text-emerald-700">
                          Reviewed and
                          approved by
                          AgriNova
                        </p>
                      </div>



                      <Link
                        href={`/investment/${project._id}`}
                        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0B7A57] px-4 text-sm font-bold text-white transition hover:bg-[#086849]"
                      >
                        View Project

                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}