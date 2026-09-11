"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  HandCoins,
  Loader2,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react";

import {
  createInvestmentStripeCheckout,
  getMyInvestmentApplications,
  submitBankInvestmentPayment,
  verifyInvestmentStripeCheckout,
} from "@/services/investment.service";
import type { InvestmentApplication } from "@/types/investment";

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

const BANK = {
  name: process.env.NEXT_PUBLIC_INVESTMENT_BANK_NAME || "Configure bank name",
  accountName: process.env.NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NAME || "Configure account name",
  accountNumber: process.env.NEXT_PUBLIC_INVESTMENT_BANK_ACCOUNT_NUMBER || "Configure account number",
  branch: process.env.NEXT_PUBLIC_INVESTMENT_BANK_BRANCH || "Configure branch",
};

const applicationStatus = (item: InvestmentApplication) => {
  if (item.status === "REJECTED") return { text: "Application rejected", className: "bg-red-50 text-red-700", icon: XCircle };
  if (item.status === "PENDING_REVIEW") return { text: "Awaiting admin review", className: "bg-amber-50 text-amber-700", icon: Clock3 };
  if (item.paymentStatus === "PAID") return { text: "Investment confirmed", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 };
  if (item.paymentStatus === "PENDING_VERIFICATION") return { text: "Payment verification pending", className: "bg-sky-50 text-sky-700", icon: ShieldCheck };
  if (item.paymentStatus === "PAYMENT_REJECTED") return { text: "Payment proof rejected", className: "bg-red-50 text-red-700", icon: XCircle };
  if (item.paymentStatus === "FAILED") return { text: "Payment failed", className: "bg-red-50 text-red-700", icon: XCircle };
  return { text: "Approved — payment required", className: "bg-emerald-50 text-emerald-700", icon: BadgeCheck };
};

async function uploadProof(file: File) {
  const body = new FormData();
  body.append("image", file);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json();
  if (!response.ok || !data?.success || !data?.url) throw new Error(data?.message || "Payment proof upload failed");
  return String(data.url);
}

export default function MyInvestmentsPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<InvestmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bankOpenId, setBankOpenId] = useState("");
  const [senderBankName, setSenderBankName] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setItems(await getMyInvestmentApplications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    const stripe = searchParams.get("stripe");
    const applicationId = searchParams.get("applicationId");
    const sessionId = searchParams.get("session_id");
    if (stripe !== "success" || !applicationId || !sessionId) return;
    (async () => {
      try {
        setBusyId(applicationId);
        await verifyInvestmentStripeCheckout(applicationId, sessionId);
        setSuccess("Stripe payment received. Your investment status has been updated.");
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify Stripe payment");
      } finally {
        setBusyId("");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((item) => item.status === "PENDING_REVIEW").length,
    approved: items.filter((item) => item.status === "APPROVED").length,
    paid: items.filter((item) => item.paymentStatus === "PAID").length,
  }), [items]);

  const startStripe = async (application: InvestmentApplication) => {
    try {
      setBusyId(application._id);
      setError("");
      const result = await createInvestmentStripeCheckout(application._id);
      if (!result.url) throw new Error("Stripe checkout URL was not returned");
      window.location.assign(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start Stripe checkout");
      setBusyId("");
    }
  };

  const submitBank = async (event: FormEvent, application: InvestmentApplication) => {
    event.preventDefault();
    if (!proofFile) { setError("Upload a payment receipt or screenshot."); return; }
    try {
      setBusyId(application._id);
      setError("");
      setSuccess("");
      const paymentProofUrl = await uploadProof(proofFile);
      await submitBankInvestmentPayment(application._id, {
        senderBankName: senderBankName.trim(),
        transactionReference: transactionReference.trim(),
        paymentProofUrl,
      });
      setSuccess("Bank payment proof submitted. Admin will verify the transfer.");
      setBankOpenId("");
      setSenderBankName("");
      setTransactionReference("");
      setProofFile(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit bank payment proof");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-[#073d2e] p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10"><HandCoins className="h-6 w-6" /></div><h1 className="text-3xl font-black">My Investments</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/75">Track investment applications, admin decisions, bank verification and Stripe payments in one place.</p></div>
            <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15"><RefreshCw className="h-4 w-4" /> Refresh</button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[ ["Applications", stats.total], ["Pending review", stats.pending], ["Approved", stats.approved], ["Paid", stats.paid] ].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>)}
        </section>

        {searchParams.get("submitted") === "1" && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">Your investment request was submitted to Admin for review. Do not send payment yet.</div>}
        {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{success}</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center text-sm text-slate-500">Loading your investment activity...</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center"><HandCoins className="mx-auto h-12 w-12 text-slate-300" /><h2 className="mt-4 font-black text-slate-900">No investments yet</h2><p className="mt-2 text-sm text-slate-500">Open the public Investment page and choose another farmer&apos;s project.</p><a href="/investment" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white">Browse projects</a></div>
        ) : (
          <div className="space-y-5">
            {items.map((item) => {
              const ui = applicationStatus(item);
              const StatusIcon = ui.icon;
              const canPay = item.status === "APPROVED" && ["AWAITING_PAYMENT", "FAILED", "PAYMENT_REJECTED"].includes(item.paymentStatus);
              const bankOpen = bankOpenId === item._id;
              return (
                <article key={item._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${ui.className}`}><StatusIcon className="h-3.5 w-3.5" /> {ui.text}</span><span className="text-xs font-bold text-slate-400">{item.applicationCode}</span></div>
                      <h2 className="mt-3 text-xl font-black text-slate-950">{item.projectName}</h2>
                      <p className="mt-1 text-sm text-slate-500">Project owner: {item.projectOwnerName || "AgriNova Farmer"}</p>
                      <div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Investment amount</p><p className="mt-1 font-black text-slate-900">{money(item.amount)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Payment method</p><p className="mt-1 font-black text-slate-900">{item.paymentMethod === "STRIPE" ? "Stripe" : "Bank transfer"}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Payment status</p><p className="mt-1 text-sm font-black text-slate-900">{item.paymentStatus.replaceAll("_", " ")}</p></div></div>
                      {item.adminNote && <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><strong className="text-slate-800">Admin note:</strong> {item.adminNote}</div>}
                      {item.paymentAdminNote && <div className="mt-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"><strong>Payment review:</strong> {item.paymentAdminNote}</div>}
                    </div>

                    <div className="w-full lg:w-64">
                      {item.status === "PENDING_REVIEW" && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"><Clock3 className="mb-2 h-5 w-5" /><strong>Do not pay yet.</strong><br />Admin is reviewing your investment decision.</div>}
                      {item.status === "REJECTED" && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"><XCircle className="mb-2 h-5 w-5" />This investment request was not approved.</div>}
                      {item.paymentStatus === "PAID" && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"><CheckCircle2 className="mb-2 h-5 w-5" /><strong>Payment confirmed.</strong><br />Your investment is recorded.</div>}
                      {item.paymentStatus === "PENDING_VERIFICATION" && <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-800"><ShieldCheck className="mb-2 h-5 w-5" /><strong>Proof received.</strong><br />Admin is verifying the bank transfer.</div>}
                      {canPay && item.paymentMethod === "STRIPE" && <button disabled={busyId === item._id} onClick={() => void startStripe(item)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#635bff] px-4 py-3 text-sm font-black text-white hover:opacity-90 disabled:opacity-50">{busyId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />} Pay securely with Stripe</button>}
                      {canPay && item.paymentMethod === "BANK_TRANSFER" && <button onClick={() => setBankOpenId(bankOpen ? "" : item._id)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white hover:bg-emerald-800"><Building2 className="h-4 w-4" /> {bankOpen ? "Close payment form" : "Bank transfer details"}</button>}
                    </div>
                  </div>

                  {bankOpen && canPay && item.paymentMethod === "BANK_TRANSFER" && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-6">
                      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex items-center gap-2 font-black text-emerald-900"><Building2 className="h-5 w-5" /> Bank transfer destination</div><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-xs text-emerald-700">Bank</dt><dd className="font-bold text-emerald-950">{BANK.name}</dd></div><div><dt className="text-xs text-emerald-700">Account name</dt><dd className="font-bold text-emerald-950">{BANK.accountName}</dd></div><div><dt className="text-xs text-emerald-700">Account number</dt><dd className="font-bold text-emerald-950">{BANK.accountNumber}</dd></div><div><dt className="text-xs text-emerald-700">Branch</dt><dd className="font-bold text-emerald-950">{BANK.branch}</dd></div><div><dt className="text-xs text-emerald-700">Exact amount</dt><dd className="text-lg font-black text-emerald-950">{money(item.amount)}</dd></div></dl></div>
                        <form onSubmit={(event) => void submitBank(event, item)} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-black text-slate-900">Submit payment proof</h3><p className="mt-1 text-xs text-slate-500">After transfer, provide the sender bank and transaction reference. Admin will verify before marking it paid.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Sender bank<input required value={senderBankName} onChange={(e) => setSenderBankName(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500" placeholder="e.g. BRAC Bank" /></label><label className="text-sm font-bold text-slate-700">Transaction reference<input required value={transactionReference} onChange={(e) => setTransactionReference(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 font-normal outline-none focus:border-emerald-500" placeholder="Transaction / reference ID" /></label></div><label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-600"><UploadCloud className="h-5 w-5 text-emerald-700" /><span className="min-w-0 truncate">{proofFile?.name || "Upload receipt / screenshot"}</span><input type="file" accept="image/jpeg,image/png,image/webp" required onChange={(e) => setProofFile(e.target.files?.[0] || null)} className="hidden" /></label><button disabled={busyId === item._id} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">{busyId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ReceiptText className="h-4 w-4" />} Submit proof for verification</button></form>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-5 text-slate-500"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0" /> For production, configure the public bank destination in your client environment variables and Stripe secrets/webhook in the server environment. Never place Stripe secret keys in the browser.</div>
      </div>
    </div>
  );
}