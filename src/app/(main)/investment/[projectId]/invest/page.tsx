"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Banknote,
  Calculator,
  CheckCircle2,
  CreditCard,
  HandCoins,
  Loader2,
  LockKeyhole,
  Percent,
  ShieldCheck,
  Sprout,
  WalletCards,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

import {
  createInvestmentApplication,
  getApprovedInvestmentProject,
} from "@/services/investment.service";

import type {
  InvestmentPaymentMethod,
  InvestmentProject,
} from "@/types/investment";


const money = (
  value: number
) =>
  `৳${Number(
    value || 0
  ).toLocaleString(
    "en-BD",
    {
      maximumFractionDigits:
        2,
    }
  )}`;


export default function InvestPage() {
  const params =
    useParams<{
      projectId:
        string;
    }>();

  const router =
    useRouter();

  const [
    project,
    setProject,
  ] =
    useState<
      InvestmentProject | null
    >(null);

  const [
    amount,
    setAmount,
  ] =
    useState(0);

  const [
    nidNumber,
    setNidNumber,
  ] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<
      InvestmentPaymentMethod
    >(
      "BANK_TRANSFER"
    );

  const [
    note,
    setNote,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

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
            !active
          ) {
            return;
          }

          setProject(
            data
          );

          const remaining =
            Math.max(
              data.requiredInvestment -
                data.fundedAmount,
              0
            );

          const initialAmount =
            Math.min(
              data.minimumInvestment,
              remaining
            );

          setAmount(
            initialAmount
          );
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err instanceof Error
                ? err.message
                : "Unable to load project."
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



  const remaining =
    project
      ? Math.max(
          project.requiredInvestment -
            project.fundedAmount,
          0
        )
      : 0;

  const minimumAllowed =
    project
      ? Math.min(
          project.minimumInvestment,
          remaining
        )
      : 0;

  const roi =
    Number(
      project?.expectedReturnPercent ||
        0
    );

  const progress =
    project &&
    Number(
      project.requiredInvestment ||
        0
    ) >
      0
      ? Math.min(
          Math.round(
            (
              Number(
                project.fundedAmount ||
                  0
              ) /
              Number(
                project.requiredInvestment
              )
            ) *
              100
          ),
          100
        )
      : 0;

  const projectedProfit =
    useMemo(
      () =>
        Number(
          (
            Number(
              amount ||
                0
            ) *
            (
              roi /
              100
            )
          ).toFixed(
            2
          )
        ),
      [
        amount,
        roi,
      ]
    );

  const projectedTotal =
    useMemo(
      () =>
        Number(
          (
            Number(
              amount ||
                0
            ) +
            projectedProfit
          ).toFixed(
            2
          )
        ),
      [
        amount,
        projectedProfit,
      ]
    );


  const submit =
    async (
      event:
        FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      if (
        !project ||
        submitting
      ) {
        return;
      }

      if (
        amount <
        minimumAllowed
      ) {
        setError(
          `Minimum investment is ${money(
            minimumAllowed
          )}.`
        );

        return;
      }

      if (
        amount >
        remaining
      ) {
        setError(
          `Only ${money(
            remaining
          )} remains available.`
        );

        return;
      }

      if (
        !/^\d{10,20}$/.test(
          nidNumber
        )
      ) {
        setError(
          "Enter a valid NID number using 10-20 digits."
        );

        return;
      }

      try {
        setSubmitting(true);
        setError("");

        await createInvestmentApplication(
          project._id,
          {
            amount,

            nidNumber,

            note:
              note.trim() ||
              undefined,

            paymentMethod,
          }
        );

        setNidNumber("");

        router.push(
          "/dashboard/farmer/my-investments"
        );
      } catch (
        err
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to submit investment request."
        );
      } finally {
        setSubmitting(false);
      }
    };


  if (
    loading
  ) {
    return (
      <MarketplaceBackground overlayClassName="bg-white/75">
        <div className="flex min-h-[65vh] items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-emerald-700" />
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
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Investments
            </Link>
          </div>
        </div>
      </MarketplaceBackground>
    );
  }

  return (
    <MarketplaceBackground overlayClassName="bg-white/75">
      <main className="mx-auto w-full max-w-[1560px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 xl:px-8">

        <Link
          href={`/investment/${project._id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm backdrop-blur transition hover:border-emerald-200 hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Project Details
        </Link>


        <section className="mt-4 overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-[0_20px_65px_-42px_rgba(15,23,42,0.42)] backdrop-blur-xl">
          <div className="grid sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">

            <div className="relative min-h-[180px] overflow-hidden bg-emerald-50 sm:min-h-full">
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
                  <Sprout className="h-10 w-10 text-emerald-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            </div>

            <div className="p-5 sm:p-6 lg:flex lg:items-center lg:justify-between lg:gap-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  Investment Request
                </p>

                <h1 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {project.projectName}
                </h1>

                <p className="mt-1.5 text-xs text-slate-500">
                  {project.district},{" "}
                  {project.division}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 lg:mt-0 lg:min-w-[390px]">
                <TopMetric
                  label="Minimum"
                  value={
                    money(
                      minimumAllowed
                    )
                  }
                />

                <TopMetric
                  label="Projected ROI"
                  value={`${roi}%`}
                  highlight
                />

                <TopMetric
                  label="Remaining"
                  value={
                    money(
                      remaining
                    )
                  }
                />
              </div>
            </div>
          </div>
        </section>



        <div className="mt-5 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)]">



          <aside className="h-fit space-y-4 lg:sticky lg:top-24">

            <section className="rounded-[26px] border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur-xl">

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <HandCoins className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    Project Summary
                  </p>

                  <h2 className="text-sm font-black text-slate-950">
                    Before you submit
                  </h2>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniInfo
                  label="Funding Goal"
                  value={
                    money(
                      project.requiredInvestment
                    )
                  }
                />

                <MiniInfo
                  label="Remaining"
                  value={
                    money(
                      remaining
                    )
                  }
                />

                <MiniInfo
                  label="Minimum"
                  value={
                    money(
                      minimumAllowed
                    )
                  }
                />

                <MiniInfo
                  label="Term"
                  value={`${project.durationMonths} months`}
                />

                <MiniInfo
                  label="Projected ROI"
                  value={`${roi}%`}
                  highlight
                />

                <MiniInfo
                  label="Already Funded"
                  value={
                    money(
                      project.fundedAmount
                    )
                  }
                />
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-400">
                    Funding progress
                  </span>

                  <span className="text-emerald-700">
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
            </section>

            <section className="rounded-[22px] border border-amber-100 bg-amber-50/90 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />

                <div>
                  <p className="text-xs font-black text-amber-900">
                    Investment reminder
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-amber-800">
                    Projected returns are estimates based on the listed project terms and are not guaranteed.
                  </p>
                </div>
              </div>
            </section>
          </aside>


          <form
            onSubmit={
              submit
            }
            className="rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_20px_65px_-45px_rgba(15,23,42,0.4)] backdrop-blur-xl sm:p-7 lg:p-8"
          >

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Investment Request
              </p>

              <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-950">
                Choose Your Investment
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Enter an amount within the available range. The projected return updates automatically.
              </p>
            </div>



            <section className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="text-xs font-black text-slate-700">
                    Investment Amount
                  </label>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Minimum{" "}
                    {money(
                      minimumAllowed
                    )}{" "}
                    • Maximum{" "}
                    {money(
                      remaining
                    )}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                    Available
                  </p>

                  <p className="mt-0.5 text-sm font-black text-emerald-700">
                    {money(
                      remaining
                    )}
                  </p>
                </div>
              </div>

              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
                  ৳
                </span>

                <input
                  type="number"
                  required
                  min={
                    minimumAllowed
                  }
                  max={
                    remaining
                  }
                  step={
                    1
                  }
                  value={
                    amount
                  }
                  onChange={(
                    event
                  ) => {
                    setAmount(
                      Number(
                        event.target.value
                      )
                    );

                    if (
                      error
                    ) {
                      setError("");
                    }
                  }}
                  className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-lg font-black text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </section>


            <section className="mt-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-4 sm:p-5">

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Calculator className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-black text-emerald-900">
                    Projected Return Calculator
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-700">
                    Illustration based on the project&apos;s listed ROI.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <CalculatorItem
                  label="Investment"
                  value={
                    money(
                      amount
                    )
                  }
                />

                <CalculatorItem
                  label="Projected ROI"
                  value={`${roi}%`}
                />

                <CalculatorItem
                  label="Projected Profit"
                  value={`+${money(
                    projectedProfit
                  )}`}
                  highlight
                />

                <CalculatorItem
                  label="Projected Total"
                  value={
                    money(
                      projectedTotal
                    )
                  }
                />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-white px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5 text-emerald-700" />

                  <span className="text-[10px] font-bold text-slate-500">
                    Investment term
                  </span>
                </div>

                <span className="text-xs font-black text-slate-900">
                  {project.durationMonths}{" "}
                  months
                </span>
              </div>
            </section>



            <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">

              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

                <div>
                  <p className="text-xs font-black text-blue-900">
                    Private identity verification
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-blue-700">
                    Your NID is used for Admin verification and is not displayed on the public project.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-4">
              <label className="text-xs font-black text-slate-700">
                NID Number
              </label>

              <input
                inputMode="numeric"
                autoComplete="off"
                required
                minLength={
                  10
                }
                maxLength={
                  20
                }
                value={
                  nidNumber
                }
                onChange={(
                  event
                ) =>
                  setNidNumber(
                    event.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        20
                      )
                  )
                }
                placeholder="Enter 10-20 digit NID number"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>



            <div className="mt-5">

              <p className="text-xs font-black text-slate-700">
                Preferred Payment Method
              </p>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <PaymentOption
                  active={
                    paymentMethod ===
                    "BANK_TRANSFER"
                  }
                  icon={
                    <Banknote className="h-4 w-4" />
                  }
                  title="Bank Transfer"
                  onClick={() =>
                    setPaymentMethod(
                      "BANK_TRANSFER"
                    )
                  }
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "STRIPE"
                  }
                  icon={
                    <CreditCard className="h-4 w-4" />
                  }
                  title="Stripe"
                  onClick={() =>
                    setPaymentMethod(
                      "STRIPE"
                    )
                  }
                />
              </div>

              <p className="mt-2 text-[10px] leading-5 text-slate-400">
                Payment is completed only after your investment request is approved.
              </p>
            </div>



            <div className="mt-5">

              <label className="text-xs font-black text-slate-700">
                Note{" "}
                <span className="font-normal text-slate-400">
                  optional
                </span>
              </label>

              <textarea
                rows={
                  4
                }
                maxLength={
                  800
                }
                value={
                  note
                }
                onChange={(
                  event
                ) =>
                  setNote(
                    event.target.value
                  )
                }
                placeholder="Any information Admin should know..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}



            <button
              type="submit"
              disabled={
                submitting ||
                remaining <=
                  0
              }
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07583f] px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:bg-[#064733] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submit Investment Request
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              No payment is charged at this stage.
            </div>
          </form>
        </div>
      </main>
    </MarketplaceBackground>
  );
}



function TopMetric({
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
      className={`min-w-0 rounded-xl border px-2.5 py-2.5 ${
        highlight
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <p className="truncate text-[7px] font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-[10px] font-black sm:text-xs ${
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

function MiniInfo({
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
      <p className="text-[8px] font-black uppercase tracking-wide text-slate-400">
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

function CalculatorItem({
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
    <div className="rounded-xl border border-white bg-white/85 p-3 shadow-sm">
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

function PaymentOption({
  active,
  icon,
  title,
  onClick,
}: {
  active:
    boolean;

  icon:
    ReactNode;

  title:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active
            ? "bg-emerald-700 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <span className="text-xs font-black">
        {title}
      </span>
    </button>
  );
}
