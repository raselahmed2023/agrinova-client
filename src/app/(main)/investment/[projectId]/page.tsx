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
  String(
    value || "Agriculture"
  )
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
          setError("");

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
      <MarketplaceBackground overlayClassName="bg-white/75">
        <div className="flex min-h-[65vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-emerald-700" />
        </div>
      </MarketplaceBackground>
    );
  }

  if (
    !project
  ) {
    return (
      <MarketplaceBackground overlayClassName="bg-white/75">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <div className="rounded-[24px] border border-white/80 bg-white/95 p-8 shadow-sm">
            <p className="font-semibold text-red-700">
              {error ||
                "Project not found."}
            </p>

            <Link
              href="/investment"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Investments
            </Link>
          </div>
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
            (
              funded /
              goal
            ) *
              100
          ),
          100
        )
      : 0;

  const exampleProfit =
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

  const exampleTotal =
    Number(
      (
        Number(
          project.minimumInvestment ||
            0
        ) +
        exampleProfit
      ).toFixed(
        2
      )
    );

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
    <MarketplaceBackground overlayClassName="bg-white/75">
      <main className="mx-auto w-full max-w-[1760px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 xl:px-8 2xl:px-10">

        <Link
          href="/investment"
          className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Investment Projects
        </Link>

        {/* =================================================
            HERO / PROJECT OVERVIEW
        ================================================= */}

        <section className="mt-4 overflow-hidden rounded-[30px] border border-white/80 bg-white/95 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(380px,.75fr)]">

            {/* PROJECT INFO */}

            <div className="order-2 p-5 sm:p-7 lg:order-1 lg:p-9 xl:p-11">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                  {categoryLabel(
                    project.category
                  )}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-white">
                  <BadgeCheck className="h-3 w-3" />
                  Approved
                </span>
              </div>

              <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[44px] lg:leading-[1.07]">
                {project.projectName}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 sm:text-sm">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span className="truncate">
                    {location ||
                      "Location unavailable"}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4 text-emerald-700" />
                  {project.farmerName ||
                    "AgriNova Farmer"}
                </span>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                {project.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <InfoStat
                  icon={
                    <HandCoins className="h-4 w-4" />
                  }
                  label="Funding Goal"
                  value={
                    money(
                      goal
                    )
                  }
                />

                <InfoStat
                  icon={
                    <WalletCards className="h-4 w-4" />
                  }
                  label="Minimum"
                  value={
                    money(
                      project.minimumInvestment
                    )
                  }
                />

                <InfoStat
                  icon={
                    <CalendarDays className="h-4 w-4" />
                  }
                  label="Term"
                  value={`${project.durationMonths} months`}
                />

                <InfoStat
                  icon={
                    <Percent className="h-4 w-4" />
                  }
                  label="Projected ROI"
                  value={`${roi}%`}
                  highlight
                />
              </div>

              {/* FUNDING PROGRESS */}

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Funding Progress
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      {money(
                        funded
                      )}{" "}
                      raised
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-700">
                      {progress}%
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {money(
                        remaining
                      )} remaining
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all"
                    style={{
                      width:
                        `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href={`/investment/${project._id}/invest`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#07583f] px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#064733]"
                >
                  Invest in This Project
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Approved AgriNova listing
                </div>
              </div>
            </div>

            {/* PROJECT IMAGE */}

            <div className="order-1 relative min-h-[260px] overflow-hidden bg-emerald-50 sm:min-h-[340px] lg:order-2 lg:min-h-full">
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
                  <Sprout className="h-14 w-14 text-emerald-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <p className="font-mono text-[10px] text-white/90">
                  {project.projectCode}
                </p>

                <span className="rounded-full bg-white/95 px-3 py-1.5 text-[9px] font-black text-slate-700 shadow">
                  {progress}% funded
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            LOWER CONTENT
        ================================================= */}

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">

          <div className="space-y-5">

            <section className="rounded-[26px] border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Project Information
              </p>

              <h2 className="mt-1.5 text-xl font-black text-slate-950 sm:text-2xl">
                About This Project
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {project.description}
              </p>
            </section>

            <section className="rounded-[26px] border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Fund Allocation
              </p>

              <h2 className="mt-1.5 text-xl font-black text-slate-950">
                Use of Investment
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {project.useOfFunds ||
                  "Use of funds information is not available for this project."}
              </p>
            </section>

            <section className="rounded-[26px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Percent className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    Return Illustration
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    Example using the minimum investment
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This is a projection based on the listed ROI, not a guaranteed return.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                <ReturnItem
                  label="Investment"
                  value={
                    money(
                      project.minimumInvestment
                    )
                  }
                />

                <ReturnItem
                  label="Projected Profit"
                  value={`+${money(
                    exampleProfit
                  )}`}
                  highlight
                />

                <ReturnItem
                  label="Projected Total"
                  value={
                    money(
                      exampleTotal
                    )
                  }
                />
              </div>
            </section>
          </div>

          {/* SUMMARY */}

          <aside className="h-fit rounded-[26px] border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl xl:sticky xl:top-24">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
              At a Glance
            </p>

            <h3 className="mt-1.5 text-lg font-black text-slate-950">
              Project Summary
            </h3>

            <div className="mt-4 divide-y divide-slate-100">
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
                label="Already Funded"
                value={
                  money(
                    funded
                  )
                }
              />

              <SummaryRow
                label="Remaining"
                value={
                  money(
                    remaining
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
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07583f] px-4 py-3 text-xs font-black text-white transition hover:bg-[#064733]"
            >
              Start Investment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <p className="mt-3 text-center text-[9px] leading-4 text-slate-400">
              Review all project information before submitting an investment request.
            </p>
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
      className={`rounded-2xl border p-3 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wide ${
          highlight
            ? "text-emerald-600"
            : "text-slate-400"
        }`}
      >
        {icon}
        {label}
      </div>

      <p
        className={`mt-1.5 text-xs font-black sm:text-sm ${
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
    <div className="rounded-2xl border border-white bg-white/85 p-3 shadow-sm sm:p-4">
      <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-black sm:text-sm ${
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
    <div className="flex items-start justify-between gap-4 py-3.5 first:pt-0">
      <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="max-w-[58%] text-right text-xs font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}
