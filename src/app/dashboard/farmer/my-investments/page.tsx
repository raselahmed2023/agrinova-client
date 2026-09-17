"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Calculator,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  HandCoins,
  ImageIcon,
  Loader2,
  Percent,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Sprout,
  UploadCloud,
  WalletCards,
  XCircle,
} from "lucide-react";

import {
  createInvestmentStripeCheckout,
  getMyInvestmentApplications,
  submitBankInvestmentPayment,
  verifyInvestmentStripeCheckout,
} from "@/services/investment.service";

import type {
  InvestmentApplication,
} from "@/types/investment";

/* ============================================================
   BANK CONFIG
============================================================ */

const BANK = {
  name:
    process.env
      .NEXT_PUBLIC_INVESTMENT_BANK_NAME ||
    "",

  accountName:
    process.env
      .NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NAME ||
    "",

  accountNumber:
    process.env
      .NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NUMBER ||
    "",

  branch:
    process.env
      .NEXT_PUBLIC_INVESTMENT_BANK_BRANCH ||
    "",
};

const bankConfigured =
  Boolean(
    BANK.name &&
      BANK.accountName &&
      BANK.accountNumber
  );

/* ============================================================
   HELPERS
============================================================ */

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

const readableStatus = (
  value: string
) =>
  value
    .toLowerCase()
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
   APPLICATION STATUS UI
============================================================ */

const getApplicationStatus =
  (
    item:
      InvestmentApplication
  ) => {
    if (
      item.status ===
      "REJECTED"
    ) {
      return {
        text:
          "Application Rejected",

        className:
          "border-red-200 bg-red-50 text-red-700",

        Icon:
          XCircle,
      };
    }

    if (
      item.status ===
      "PENDING_REVIEW"
    ) {
      return {
        text:
          "Awaiting Review",

        className:
          "border-amber-200 bg-amber-50 text-amber-700",

        Icon:
          Clock3,
      };
    }

    if (
      item.paymentStatus ===
      "PAID"
    ) {
      return {
        text:
          "Investment Confirmed",

        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700",

        Icon:
          CheckCircle2,
      };
    }

    if (
      item.paymentStatus ===
      "PENDING_VERIFICATION"
    ) {
      return {
        text:
          "Payment Under Review",

        className:
          "border-blue-200 bg-blue-50 text-blue-700",

        Icon:
          ShieldCheck,
      };
    }

    if (
      item.paymentStatus ===
      "PAYMENT_REJECTED"
    ) {
      return {
        text:
          "Payment Rejected",

        className:
          "border-red-200 bg-red-50 text-red-700",

        Icon:
          XCircle,
      };
    }

    if (
      item.paymentStatus ===
      "FAILED"
    ) {
      return {
        text:
          "Payment Failed",

        className:
          "border-red-200 bg-red-50 text-red-700",

        Icon:
          XCircle,
      };
    }

    return {
      text:
        "Approved — Payment Required",

      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",

      Icon:
        BadgeCheck,
    };
  };

/* ============================================================
   PAYMENT PROOF UPLOAD
============================================================ */

const uploadProof =
  async (
    file:
      File
  ): Promise<string> => {
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(
        file.type
      )
    ) {
      throw new Error(
        "Only JPG, PNG and WEBP payment proofs are allowed."
      );
    }

    if (
      file.size >
      8 *
        1024 *
        1024
    ) {
      throw new Error(
        "Payment proof must be 8MB or smaller."
      );
    }

    /* ========================================================
       PRIMARY: NEXT.JS UPLOAD ROUTE
    ======================================================== */

    try {
      const body =
        new FormData();

      body.append(
        "image",
        file
      );

      const response =
        await fetch(
          "/api/upload",
          {
            method:
              "POST",

            body,
          }
        );

      const data =
        await response
          .json()
          .catch(
            () =>
              null
          );

      if (
        response.ok &&
        data?.success &&
        data?.url
      ) {
        return String(
          data.url
        );
      }
    } catch (
      error
    ) {
      console.warn(
        "Primary payment proof upload failed:",
        error
      );
    }

    /* ========================================================
       FALLBACK: DIRECT IMGBB
    ======================================================== */

    const apiKey =
      process.env
        .NEXT_PUBLIC_IMGBB_API_KEY;

    if (
      !apiKey
    ) {
      throw new Error(
        "Payment proof upload failed. ImgBB fallback is not configured."
      );
    }

    const fallbackBody =
      new FormData();

    fallbackBody.append(
      "image",
      file
    );

    const response =
      await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
          apiKey
        )}`,
        {
          method:
            "POST",

          body:
            fallbackBody,
        }
      );

    const data =
      await response
        .json()
        .catch(
          () =>
            null
        );

    if (
      !response.ok ||
      !data?.success ||
      !data?.data?.url
    ) {
      throw new Error(
        data?.error?.message ||
          "Payment proof upload failed."
      );
    }

    return String(
      data.data.url
    );
  };

/* ============================================================
   CONTENT
============================================================ */

function MyInvestmentsContent() {
  const searchParams =
    useSearchParams();

  const [
    items,
    setItems,
  ] =
    useState<
      InvestmentApplication[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    busyId,
    setBusyId,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  /* ==========================================================
     BANK FORM
  ========================================================== */

  const [
    bankOpenId,
    setBankOpenId,
  ] =
    useState("");

  const [
    senderBankName,
    setSenderBankName,
  ] =
    useState("");

  const [
    transactionReference,
    setTransactionReference,
  ] =
    useState("");

  const [
    proofFile,
    setProofFile,
  ] =
    useState<
      File | null
    >(null);

  const [
    proofPreview,
    setProofPreview,
  ] =
    useState("");

  const [
    stripeVerified,
    setStripeVerified,
  ] =
    useState(false);

  /* ==========================================================
     LOAD
  ========================================================== */

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const data =
            await getMyInvestmentApplications();

          setItems(
            Array.isArray(
              data
            )
              ? data
              : []
          );
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to load your investments."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void load();
  }, [
    load,
  ]);

  /* ==========================================================
     STRIPE RETURN VERIFICATION
  ========================================================== */

  useEffect(() => {
    if (
      stripeVerified
    ) {
      return;
    }

    const stripe =
      searchParams.get(
        "stripe"
      );

    const applicationId =
      searchParams.get(
        "applicationId"
      );

    const sessionId =
      searchParams.get(
        "session_id"
      );

    if (
      stripe ===
      "cancelled"
    ) {
      setStripeVerified(
        true
      );

      setError(
        "Stripe payment was cancelled. You can try again whenever you are ready."
      );

      return;
    }

    if (
      stripe !==
        "success" ||
      !applicationId ||
      !sessionId
    ) {
      return;
    }

    setStripeVerified(
      true
    );

    const verify =
      async () => {
        try {
          setBusyId(
            applicationId
          );

          setError(
            ""
          );

          setSuccess(
            ""
          );

          await verifyInvestmentStripeCheckout(
            applicationId,
            sessionId
          );

          setSuccess(
            "Stripe payment confirmed. Your investment has been recorded."
          );

          await load();
        } catch (
          err
        ) {
          setError(
            err instanceof
              Error
              ? err.message
              : "Unable to verify Stripe payment."
          );
        } finally {
          setBusyId(
            ""
          );
        }
      };

    void verify();
  }, [
    searchParams,
    stripeVerified,
    load,
  ]);

  /* ==========================================================
     STATS
  ========================================================== */

  const stats =
    useMemo(
      () => {
        const confirmed =
          items.filter(
            (
              item
            ) =>
              item.paymentStatus ===
              "PAID"
          );

        return {
          applications:
            items.length,

          pending:
            items.filter(
              (
                item
              ) =>
                item.status ===
                "PENDING_REVIEW"
            ).length,

          confirmed:
            confirmed.length,

          invested:
            confirmed.reduce(
              (
                total,
                item
              ) =>
                total +
                Number(
                  item.amount ||
                    0
                ),
              0
            ),
        };
      },
      [
        items,
      ]
    );

  /* ==========================================================
     STRIPE CHECKOUT
  ========================================================== */

  const startStripe =
    async (
      application:
        InvestmentApplication
    ) => {
      if (
        busyId
      ) {
        return;
      }

      try {
        setBusyId(
          application._id
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        const result =
          await createInvestmentStripeCheckout(
            application._id
          );

        if (
          !result.url
        ) {
          throw new Error(
            "Stripe checkout URL was not returned."
          );
        }

        window.location.assign(
          result.url
        );
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to start Stripe checkout."
        );

        setBusyId(
          ""
        );
      }
    };

  /* ==========================================================
     PROOF FILE
  ========================================================== */

  const handleProofFile =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[
          0
        ] ||
        null;

      if (
        proofPreview
      ) {
        URL.revokeObjectURL(
          proofPreview
        );
      }

      setProofFile(
        file
      );

      setProofPreview(
        file
          ? URL.createObjectURL(
              file
            )
          : ""
      );

      setError(
        ""
      );
    };

  /* ==========================================================
     CLOSE BANK FORM
  ========================================================== */

  const closeBankForm =
    () => {
      if (
        proofPreview
      ) {
        URL.revokeObjectURL(
          proofPreview
        );
      }

      setBankOpenId(
        ""
      );

      setSenderBankName(
        ""
      );

      setTransactionReference(
        ""
      );

      setProofFile(
        null
      );

      setProofPreview(
        ""
      );
    };

  /* ==========================================================
     SUBMIT BANK PAYMENT
  ========================================================== */

  const submitBank =
    async (
      event:
        FormEvent<HTMLFormElement>,

      application:
        InvestmentApplication
    ) => {
      event.preventDefault();

      if (
        busyId
      ) {
        return;
      }

      if (
        !bankConfigured
      ) {
        setError(
          "AgriNova bank transfer information has not been configured yet."
        );

        return;
      }

      if (
        !senderBankName
          .trim()
      ) {
        setError(
          "Enter the sender bank name."
        );

        return;
      }

      if (
        !transactionReference
          .trim()
      ) {
        setError(
          "Enter the transaction reference."
        );

        return;
      }

      if (
        !proofFile
      ) {
        setError(
          "Upload the bank transfer receipt or screenshot."
        );

        return;
      }

      try {
        setBusyId(
          application._id
        );

        setError(
          ""
        );

        setSuccess(
          ""
        );

        /* ================================================
           UPLOAD ONLY WHEN FINAL SUBMIT HAPPENS
        ================================================ */

        const paymentProofUrl =
          await uploadProof(
            proofFile
          );

        await submitBankInvestmentPayment(
          application._id,
          {
            senderBankName:
              senderBankName
                .trim(),

            transactionReference:
              transactionReference
                .trim(),

            paymentProofUrl,
          }
        );

        setSuccess(
          "Payment proof submitted. Admin will verify your bank transfer."
        );

        closeBankForm();

        await load();
      } catch (
        err
      ) {
        setError(
          err instanceof
            Error
            ? err.message
            : "Unable to submit payment proof."
        );
      } finally {
        setBusyId(
          ""
        );
      }
    };

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-5 lg:p-6">

      <div className="mx-auto w-full max-w-[1500px] space-y-5">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#063d2e] via-[#07543d] to-[#087356] px-5 py-5 text-white shadow-lg sm:px-6">

          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.17em] text-emerald-200">
                Investment Portfolio
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                My Investments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/85">
                Track your applications,
                projected returns, approvals
                and payments from one place.
              </p>
            </div>

            <div className="flex gap-2">

              <Link
                href="/investment"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/20"
              >
                Browse Projects

                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() =>
                  void load()
                }
                disabled={
                  loading
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================
            STATS
        =================================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <PortfolioStat
            label="Applications"
            value={String(
              stats.applications
            )}
            icon={
              <FileCheck2 className="h-4 w-4" />
            }
          />

          <PortfolioStat
            label="Pending Review"
            value={String(
              stats.pending
            )}
            icon={
              <Clock3 className="h-4 w-4" />
            }
          />

          <PortfolioStat
            label="Confirmed"
            value={String(
              stats.confirmed
            )}
            icon={
              <CheckCircle2 className="h-4 w-4" />
            }
          />

          <PortfolioStat
            label="Total Invested"
            value={
              money(
                stats.invested
              )
            }
            icon={
              <WalletCards className="h-4 w-4" />
            }
            highlight
          />
        </section>

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {searchParams.get(
          "submitted"
        ) ===
          "1" && (
          <MessageBox type="success">
            Your investment request was
            submitted for Admin review.
            Do not make payment until it
            is approved.
          </MessageBox>
        )}

        {success && (
          <MessageBox type="success">
            {success}
          </MessageBox>
        )}

        {error && (
          <MessageBox type="error">
            {error}
          </MessageBox>
        )}

        {/* ===================================================
            CONTENT
        =================================================== */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-[24px] border border-slate-200 bg-white">

            <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
          </div>
        ) : items.length ===
          0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

              <HandCoins className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-lg font-black text-slate-900">
              No investments yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
              Browse approved agricultural
              projects and choose one you
              would like to invest in.
            </p>

            <Link
              href="/investment"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07583f] px-5 py-2.5 text-xs font-black text-white"
            >
              Browse Investment Projects

              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <section className="space-y-4">

            {items.map(
              (
                item
              ) => (
                <InvestmentCard
                  key={
                    item._id
                  }
                  item={
                    item
                  }
                  busy={
                    busyId ===
                    item._id
                  }
                  bankOpen={
                    bankOpenId ===
                    item._id
                  }
                  senderBankName={
                    senderBankName
                  }
                  transactionReference={
                    transactionReference
                  }
                  proofFile={
                    proofFile
                  }
                  proofPreview={
                    proofPreview
                  }
                  onSenderBankChange={
                    setSenderBankName
                  }
                  onReferenceChange={
                    setTransactionReference
                  }
                  onProofChange={
                    handleProofFile
                  }
                  onStripe={() =>
                    void startStripe(
                      item
                    )
                  }
                  onToggleBank={() => {
                    if (
                      bankOpenId ===
                      item._id
                    ) {
                      closeBankForm();
                    } else {
                      closeBankForm();

                      setBankOpenId(
                        item._id
                      );
                    }
                  }}
                  onSubmitBank={(
                    event
                  ) =>
                    void submitBank(
                      event,
                      item
                    )
                  }
                />
              )
            )}
          </section>
        )}

        {/* ===================================================
            SECURITY NOTE
        =================================================== */}

        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">

          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />

          <p className="text-[10px] leading-5 text-slate-500">
            Your NID is used only for
            administrative verification.
            Stripe secret keys and payment
            verification remain on the
            backend and are never exposed
            to the browser.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   INVESTMENT CARD
============================================================ */

function InvestmentCard({
  item,
  busy,
  bankOpen,
  senderBankName,
  transactionReference,
  proofFile,
  proofPreview,
  onSenderBankChange,
  onReferenceChange,
  onProofChange,
  onStripe,
  onToggleBank,
  onSubmitBank,
}: {
  item:
    InvestmentApplication;

  busy:
    boolean;

  bankOpen:
    boolean;

  senderBankName:
    string;

  transactionReference:
    string;

  proofFile:
    File | null;

  proofPreview:
    string;

  onSenderBankChange:
    (
      value:
        string
    ) => void;

  onReferenceChange:
    (
      value:
        string
    ) => void;

  onProofChange:
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => void;

  onStripe:
    () => void;

  onToggleBank:
    () => void;

  onSubmitBank:
    (
      event:
        FormEvent<HTMLFormElement>
    ) => void;
}) {
  const status =
    getApplicationStatus(
      item
    );

  const StatusIcon =
    status.Icon;

  const roi =
    Number(
      item.expectedReturnPercent ||
        0
    );

  const duration =
    Number(
      item.durationMonths ||
        0
    );

  const projectedProfit =
    Number(
      (
        Number(
          item.amount ||
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

  const projectedTotal =
    Number(
      (
        Number(
          item.amount ||
            0
        ) +
        projectedProfit
      ).toFixed(
        2
      )
    );

  const canPay =
    item.status ===
      "APPROVED" &&
    [
      "AWAITING_PAYMENT",
      "FAILED",
      "PAYMENT_REJECTED",
    ].includes(
      item.paymentStatus
    );

  return (
    <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="grid lg:grid-cols-[1fr_275px]">

        {/* ===================================================
            INFORMATION
        =================================================== */}

        <div className="p-5">

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />

                  {
                    status.text
                  }
                </span>

                <span className="font-mono text-[9px] font-bold text-slate-400">
                  {
                    item.applicationCode
                  }
                </span>
              </div>

              <h2 className="mt-3 text-lg font-black text-slate-950">
                {
                  item.projectName
                }
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Project owner:{" "}
                {item.projectOwnerName ||
                  "AgriNova Farmer"}
              </p>
            </div>

            <Link
              href={`/investment/${item.projectId}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 hover:bg-slate-50"
            >
              <Sprout className="h-3.5 w-3.5" />

              Project
            </Link>
          </div>

          {/* =================================================
              TERMS
          ================================================= */}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">

            <InvestmentInfo
              label="Investment"
              value={
                money(
                  item.amount
                )
              }
              icon={
                <HandCoins className="h-3.5 w-3.5" />
              }
            />

            <InvestmentInfo
              label="Projected ROI"
              value={
                roi >
                0
                  ? `${roi}%`
                  : "—"
              }
              icon={
                <Percent className="h-3.5 w-3.5" />
              }
              highlight
            />

            <InvestmentInfo
              label="Term"
              value={
                duration >
                0
                  ? `${duration} months`
                  : "—"
              }
              icon={
                <Clock3 className="h-3.5 w-3.5" />
              }
            />

            <InvestmentInfo
              label="Payment"
              value={
                item.paymentMethod ===
                "STRIPE"
                  ? "Stripe"
                  : "Bank Transfer"
              }
              icon={
                item.paymentMethod ===
                "STRIPE" ? (
                  <CreditCard className="h-3.5 w-3.5" />
                ) : (
                  <Banknote className="h-3.5 w-3.5" />
                )
              }
            />
          </div>

          {/* =================================================
              PROJECTED RETURN
          ================================================= */}

          {roi >
            0 && (
            <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">

              <div className="flex items-center gap-2">

                <Calculator className="h-3.5 w-3.5 text-emerald-700" />

                <p className="text-[9px] font-black uppercase tracking-wide text-emerald-700">
                  Projected Return
                </p>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">

                <ReturnStat
                  label="Principal"
                  value={
                    money(
                      item.amount
                    )
                  }
                />

                <ReturnStat
                  label="Projected Profit"
                  value={`+${money(
                    projectedProfit
                  )}`}
                  highlight
                />

                <ReturnStat
                  label="Projected Total"
                  value={
                    money(
                      projectedTotal
                    )
                  }
                />
              </div>

              <p className="mt-2 text-[8px] leading-4 text-slate-400">
                Projected return for the
                stated investment term.
                Agricultural returns are
                estimates and are not
                guaranteed.
              </p>
            </div>
          )}

          {/* =================================================
              PAYMENT STATUS
          ================================================= */}

          <div className="mt-3 flex flex-wrap gap-2">

            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-black text-slate-600">
              Payment:{" "}
              {readableStatus(
                item.paymentStatus
              )}
            </span>

            {item.paymentStatus ===
              "PAID" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[9px] font-black text-emerald-700">

                <BadgeCheck className="h-3 w-3" />

                Confirmed
              </span>
            )}
          </div>

          {/* =================================================
              NOTES
          ================================================= */}

          {item.adminNote && (
            <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5">

              <p className="text-[9px] font-black uppercase text-amber-700">
                Admin Note
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                {
                  item.adminNote
                }
              </p>
            </div>
          )}

          {item.paymentAdminNote && (
            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5">

              <p className="text-[9px] font-black uppercase text-red-700">
                Payment Review
              </p>

              <p className="mt-1 text-xs leading-5 text-red-800">
                {
                  item.paymentAdminNote
                }
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            ACTION
        =================================================== */}

        <aside className="border-t border-slate-100 bg-slate-50/70 p-4 lg:border-l lg:border-t-0">

          {item.status ===
            "PENDING_REVIEW" && (
            <StatusNotice
              icon={
                <Clock3 className="h-4 w-4" />
              }
              title="Admin Review"
              text="Your application is being reviewed. Do not make payment yet."
              tone="warning"
            />
          )}

          {item.status ===
            "REJECTED" && (
            <StatusNotice
              icon={
                <XCircle className="h-4 w-4" />
              }
              title="Not Approved"
              text="This investment request was not approved."
              tone="error"
            />
          )}

          {item.paymentStatus ===
            "PAID" && (
            <StatusNotice
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
              title="Investment Confirmed"
              text={`${money(
                item.amount
              )} has been recorded as a confirmed investment.`}
              tone="success"
            />
          )}

          {item.paymentStatus ===
            "PENDING_VERIFICATION" && (
            <StatusNotice
              icon={
                <ShieldCheck className="h-4 w-4" />
              }
              title="Verification Pending"
              text="Your bank payment proof has been received and is waiting for Admin verification."
              tone="info"
            />
          )}

          {/* STRIPE */}

          {canPay &&
            item.paymentMethod ===
              "STRIPE" && (
            <div>

              <div className="mb-3 rounded-xl border border-violet-100 bg-violet-50 p-3">

                <CreditCard className="h-4 w-4 text-violet-700" />

                <p className="mt-2 text-xs font-black text-violet-900">
                  Stripe Payment
                </p>

                <p className="mt-1 text-[10px] leading-5 text-violet-700">
                  Pay exactly{" "}
                  <strong>
                    {money(
                      item.amount
                    )}
                  </strong>{" "}
                  through secure Stripe
                  checkout.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onStripe
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#635bff] px-4 py-3 text-xs font-black text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}

                {busy
                  ? "Opening..."
                  : "Pay with Stripe"}
              </button>
            </div>
          )}

          {/* BANK */}

          {canPay &&
            item.paymentMethod ===
              "BANK_TRANSFER" && (
            <div>

              <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">

                <Banknote className="h-4 w-4 text-emerald-700" />

                <p className="mt-2 text-xs font-black text-emerald-900">
                  Bank Transfer
                </p>

                <p className="mt-1 text-[10px] leading-5 text-emerald-700">
                  Transfer exactly{" "}
                  <strong>
                    {money(
                      item.amount
                    )}
                  </strong>{" "}
                  then submit your receipt.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  busy
                }
                onClick={
                  onToggleBank
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07583f] px-4 py-3 text-xs font-black text-white transition hover:bg-[#064733] disabled:opacity-50"
              >
                <Building2 className="h-4 w-4" />

                {bankOpen
                  ? "Close Bank Details"
                  : "Bank Transfer Details"}
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* =====================================================
          BANK PAYMENT FORM
      ===================================================== */}

      {bankOpen &&
        canPay &&
        item.paymentMethod ===
          "BANK_TRANSFER" && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">

          {!bankConfigured ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

              <p className="text-sm font-black text-amber-900">
                Bank transfer is not configured
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Add the public investment
                bank environment variables
                before accepting bank payments.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">

              {/* BANK INFO */}

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

                <div className="flex items-center gap-2">

                  <Building2 className="h-4 w-4 text-emerald-700" />

                  <h3 className="text-sm font-black text-emerald-950">
                    Transfer Destination
                  </h3>
                </div>

                <div className="mt-4 space-y-3">

                  <BankRow
                    label="Bank"
                    value={
                      BANK.name
                    }
                  />

                  <BankRow
                    label="Account Name"
                    value={
                      BANK.accountName
                    }
                  />

                  <BankRow
                    label="Account Number"
                    value={
                      BANK.accountNumber
                    }
                  />

                  {BANK.branch && (
                    <BankRow
                      label="Branch"
                      value={
                        BANK.branch
                      }
                    />
                  )}

                  <div className="border-t border-emerald-200 pt-3">

                    <p className="text-[9px] font-black uppercase text-emerald-600">
                      Exact Amount
                    </p>

                    <p className="mt-1 text-xl font-black text-emerald-950">
                      {money(
                        item.amount
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROOF FORM */}

              <form
                onSubmit={
                  onSubmitBank
                }
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >

                <div className="flex items-start gap-3">

                  <ReceiptText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

                  <div>

                    <h3 className="text-sm font-black text-slate-950">
                      Submit Payment Proof
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      Complete the bank transfer
                      first, then provide the
                      transaction information.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <label>

                    <span className="text-xs font-black text-slate-700">
                      Sender Bank
                    </span>

                    <input
                      required
                      value={
                        senderBankName
                      }
                      onChange={(
                        event
                      ) =>
                        onSenderBankChange(
                          event.target.value
                        )
                      }
                      placeholder="e.g. BRAC Bank"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>

                  <label>

                    <span className="text-xs font-black text-slate-700">
                      Transaction Reference
                    </span>

                    <input
                      required
                      value={
                        transactionReference
                      }
                      onChange={(
                        event
                      ) =>
                        onReferenceChange(
                          event.target.value
                        )
                      }
                      placeholder="Transaction / reference ID"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>

                {/* PROOF */}

                <label className="mt-4 block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-emerald-300">

                  {proofPreview ? (
                    <div className="grid sm:grid-cols-[150px_1fr]">

                      <div className="h-[120px] overflow-hidden bg-slate-100">

                        <img
                          src={
                            proofPreview
                          }
                          alt="Payment proof preview"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex items-center gap-3 p-4">

                        <ImageIcon className="h-5 w-5 shrink-0 text-emerald-700" />

                        <div className="min-w-0">

                          <p className="truncate text-xs font-black text-slate-800">
                            {proofFile?.name}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Click to replace
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[100px] items-center justify-center gap-3 p-4">

                      <UploadCloud className="h-6 w-6 text-emerald-700" />

                      <div>

                        <p className="text-xs font-black text-slate-800">
                          Upload receipt or screenshot
                        </p>

                        <p className="mt-1 text-[9px] text-slate-400">
                          JPG, PNG or WEBP • max 8MB
                        </p>
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={
                      onProofChange
                    }
                    className="hidden"
                  />
                </label>

                <button
                  type="submit"
                  disabled={
                    busy
                  }
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Submitting...
                    </>
                  ) : (
                    <>
                      <ReceiptText className="h-4 w-4" />

                      Submit for Verification
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function PortfolioStat({
  label,
  value,
  icon,
  highlight = false,
}: {
  label:
    string;

  value:
    string;

  icon:
    React.ReactNode;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        highlight
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">

        <p
          className={`text-[9px] font-black uppercase tracking-wide ${
            highlight
              ? "text-emerald-600"
              : "text-slate-400"
          }`}
        >
          {label}
        </p>

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            highlight
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </div>
      </div>

      <p
        className={`mt-2 text-xl font-black ${
          highlight
            ? "text-emerald-900"
            : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InvestmentInfo({
  label,
  value,
  icon,
  highlight = false,
}: {
  label:
    string;

  value:
    string;

  icon:
    React.ReactNode;

  highlight?:
    boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        highlight
          ? "border-emerald-100 bg-emerald-50"
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
        className={`mt-1 truncate text-xs font-black ${
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

function ReturnStat({
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

function StatusNotice({
  icon,
  title,
  text,
  tone,
}: {
  icon:
    React.ReactNode;

  title:
    string;

  text:
    string;

  tone:
    | "success"
    | "warning"
    | "error"
    | "info";
}) {
  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800",

    warning:
      "border-amber-200 bg-amber-50 text-amber-800",

    error:
      "border-red-200 bg-red-50 text-red-700",

    info:
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <div
      className={`rounded-xl border p-3 ${styles[tone]}`}
    >
      {icon}

      <p className="mt-2 text-xs font-black">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-5">
        {text}
      </p>
    </div>
  );
}

function BankRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div>

      <p className="text-[9px] font-black uppercase text-emerald-600">
        {label}
      </p>

      <p className="mt-1 break-all text-xs font-black text-emerald-950">
        {value}
      </p>
    </div>
  );
}

function MessageBox({
  type,
  children,
}: {
  type:
    | "success"
    | "error";

  children:
    React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 text-xs font-semibold ${
        type ===
        "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   SUSPENSE
============================================================ */

function MyInvestmentsLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">

      <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
    </div>
  );
}

export default function MyInvestmentsPage() {
  return (
    <Suspense
      fallback={
        <MyInvestmentsLoading />
      }
    >
      <MyInvestmentsContent />
    </Suspense>
  );
}