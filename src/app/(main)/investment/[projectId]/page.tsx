"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  HandCoins,
  MapPin,
  Percent,
  ShieldCheck,
  Sprout,
  UserRound,
  WalletCards,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import {
  getApprovedInvestmentProject,
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

export default function InvestmentDetailsPage() {
  const params =
    useParams<{
      projectId:
        string;
    }>();

  const [
    project,
    setProject,
  ] =
    useState<
      InvestmentProject | null
    >(null);

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

  useEffect(() => {
    let active =
      true;

    const load =
      async () => {
        try {
          setLoading(true);

          const data =
            await getApprovedInvestmentProject(
              params.projectId
            );

          if (
            active
          ) {
            setProject(
              data
            );
          }
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err instanceof Error
                ? err.message
                : "Project unavailable."
            );
          }
        } finally {
          if (
            active
          ) {
            setLoading(false);
          }
        }
      };

    void load();

    return () => {
      active =
        false;
    };
  }, [
    params.projectId,
  ]);

  if (
    loading
  ) {
    return (
      <MarketplaceBackground>
        <div className="flex min-h-[60vh] items-center justify-center">

          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-700" />
        </div>
      </MarketplaceBackground>
    );
  }

  if (
    !project
  ) {
    return (
      <MarketplaceBackground>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">

          <p className="font-semibold text-red-700">
            {error ||
              "Project not found."}
          </p>

          <Link
            href="/investment"
            className="mt-5 inline-flex rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white"
          >
            Back
          </Link>
        </div>
      </MarketplaceBackground>
    );
  }

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

  const remaining =
    Math.max(
      goal -
        funded,
      0
    );

  const progress =
    goal >
    0
      ? Math.min(
          Math.round(
            funded /
              goal *
              100
          ),
          100
        )
      : 0;

  const exampleProfit =
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

  const exampleTotal =
    project.minimumInvestment +
    exampleProfit;

  const location =
    [
      project.address,
      project.upazila,
      project.district,
      project.division,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <MarketplaceBackground>
      <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-5 lg:px-6">

        <Link
          href="/investment"
          className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-black text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />

          Investment Projects
        </Link>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="mt-3 overflow-hidden rounded-[22px] border border-white/80 bg-white/95 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.45)]">

          <div className="grid lg:grid-cols-[360px_1fr]">

            {/* SHORT IMAGE */}

            <div className="relative h-[220px] overflow-hidden bg-emerald-50 sm:h-[250px] lg:h-auto lg:min-h-[340px]">

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

                  <Sprout className="h-12 w-12 text-emerald-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <p className="absolute bottom-4 left-4 font-mono text-[10px] text-white/90">
                {
                  project.projectCode
                }
              </p>
            </div>

            {/* INFO */}

            <div className="p-5 sm:p-6">

              <div className="flex flex-wrap gap-2">

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase text-emerald-700">

                  {categoryLabel(
                    project.category
                  )}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-3 py-1.5 text-[9px] font-black uppercase text-emerald-700">

                  <BadgeCheck className="h-3 w-3" />

                  Approved
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">

                {
                  project.projectName
                }
              </h1>

              <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">

                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />

                {
                  location
                }
              </div>

              {/* TERMS */}

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

                <InfoStat
                  label="Funding Goal"
                  value={
                    money(
                      goal
                    )
                  }
                />

                <InfoStat
                  label="Minimum"
                  value={
                    money(
                      project.minimumInvestment
                    )
                  }
                />

                <InfoStat
                  label="Term"
                  value={`${project.durationMonths} months`}
                />

                <InfoStat
                  label="Projected ROI"
                  value={`${roi}%`}
                  highlight
                />
              </div>

              {/* ROI EXAMPLE */}

              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">

                <div className="flex items-center gap-2">

                  <Percent className="h-4 w-4 text-emerald-700" />

                  <p className="text-xs font-black uppercase tracking-wide text-emerald-800">
                    Projected Return Example
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">

                  <ReturnItem
                    label="Investment"
                    value={
                      money(
                        project.minimumInvestment
                      )
                    }
                  />

                  <ReturnItem
                    label="Profit"
                    value={`+${money(
                      exampleProfit
                    )}`}
                    highlight
                  />

                  <ReturnItem
                    label="Total Return"
                    value={
                      money(
                        exampleTotal
                      )
                    }
                  />
                </div>

                <p className="mt-3 text-[9px] leading-4 text-slate-400">
                  Based on the projected
                  ROI for the full investment
                  term.
                </p>
              </div>

              {/* PROGRESS */}

              <div className="mt-4">

                <div className="flex justify-between text-[9px] font-bold text-slate-400">

                  <span>
                    {money(
                      funded
                    )} raised
                  </span>

                  <span>
                    {progress}%
                  </span>
                </div>

                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width:
                        `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-[9px] text-slate-400">
                  Remaining{" "}
                  {money(
                    remaining
                  )}
                </p>
              </div>

              {/* CTA */}

              <Link
                href={`/investment/${project._id}/invest`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07583f] px-5 py-3 text-sm font-black text-white hover:bg-[#064733]"
              >
                Invest Now

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =================================================
            LOWER CONTENT
        ================================================= */}

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">

          <section className="rounded-[22px] border border-white/80 bg-white/95 p-5 sm:p-6">

            <h2 className="text-lg font-black text-slate-950">
              About This Project
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {
                project.description
              }
            </p>

            <div className="mt-6 border-t border-slate-100 pt-5">

              <h3 className="font-black text-slate-950">
                Use of Investment
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {
                  project.useOfFunds
                }
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

              <div>

                <p className="text-xs font-black text-emerald-900">
                  Admin reviewed project
                </p>

                <p className="mt-1 text-[10px] leading-5 text-emerald-700">
                  This project was reviewed
                  before being listed publicly.
                </p>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[22px] border border-white/80 bg-white/95 p-4">

            <h3 className="text-sm font-black text-slate-900">
              Project Summary
            </h3>

            <div className="mt-3 divide-y divide-slate-100">

              <SummaryRow
                label="Farmer"
                value={
                  project.farmerName ||
                  "AgriNova Farmer"
                }
              />

              <SummaryRow
                label="Category"
                value={
                  categoryLabel(
                    project.category
                  )
                }
              />

              <SummaryRow
                label="Funding Goal"
                value={
                  money(
                    goal
                  )
                }
              />

              <SummaryRow
                label="Funded"
                value={
                  money(
                    funded
                  )
                }
              />

              <SummaryRow
                label="Minimum"
                value={
                  money(
                    project.minimumInvestment
                  )
                }
              />

              <SummaryRow
                label="Term"
                value={`${project.durationMonths} months`}
              />

              <SummaryRow
                label="Projected ROI"
                value={`${roi}%`}
              />
            </div>

            <Link
              href={`/investment/${project._id}/invest`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-800"
            >
              Start Investment

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </div>
      </main>
    </MarketplaceBackground>
  );
}

/* ============================================================
   COMPONENTS
============================================================ */

function InfoStat({
  label,
  value,
  highlight = false,
}: {
  label:
    string;

  value:
    string;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >

      <p className="text-[8px] font-black uppercase text-slate-400">
        {label}
      </p>

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

function ReturnItem({
  label,
  value,
  highlight = false,
}: {
  label:
    string;

  value:
    string;

  highlight?:
    boolean;
}) {
  return (
    <div>

      <p className="text-[8px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-black ${
          highlight
            ? "text-emerald-700"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="py-3 first:pt-0">

      <p className="text-[8px] font-black uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}