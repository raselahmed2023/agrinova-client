"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Building2, CreditCard, HandCoins, ShieldCheck } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { createInvestmentApplication, getApprovedInvestmentProject } from "@/services/investment.service";
import type { InvestmentPaymentMethod, InvestmentProject } from "@/types/investment";

const formatMoney = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

export default function InvestInProjectPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [project, setProject] = useState<InvestmentProject | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<InvestmentPaymentMethod>("BANK_TRANSFER");
  const [note, setNote] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.projectId) return;
    (async () => {
      try {
        setProject(await getApprovedInvestmentProject(params.projectId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.projectId]);

  const remaining = useMemo(() => project ? Math.max(0, project.requiredInvestment - project.fundedAmount) : 0, [project]);
  const isOwner = Boolean(project && session?.user?.id && String(project.farmerId) === String(session.user.id));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!project || submitting) return;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < project.minimumInvestment) {
      setError(`Minimum investment is ${formatMoney(project.minimumInvestment)}.`);
      return;
    }
    if (numericAmount > remaining) {
      setError(`Only ${formatMoney(remaining)} remains in this funding round.`);
      return;
    }
    if (!agreed) {
      setError("Please confirm that you understand the investment risk and review process.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      await createInvestmentApplication(project._id, { amount: numericAmount, paymentMethod, note: note.trim() || undefined });
      router.push("/dashboard/farmer/my-investments?submitted=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit investment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || sessionLoading) return <main className="min-h-screen bg-slate-50 px-4 py-24 text-center text-sm text-slate-500">Loading investment form...</main>;
  if (!project) return <main className="min-h-screen bg-slate-50 px-4 py-24 text-center text-red-700">{error || "Project not found"}</main>;

  if (isOwner) {
    return <main className="min-h-screen bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center"><h1 className="text-xl font-black text-amber-900">You cannot invest in your own project</h1><p className="mt-2 text-sm text-amber-800">Choose another farmer&apos;s approved project instead.</p><Link href="/investment" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white">Browse projects</Link></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#f6f8f6] py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href={`/investment/${project._id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" /> Project details</Link>
        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><HandCoins className="h-6 w-6" /></div>
            <h1 className="mt-5 text-3xl font-black text-slate-950">Investment application</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Submit your proposed amount and preferred payment method. No money is charged until an admin approves this investment decision.</p>

            {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <div className="mt-7">
              <label className="text-sm font-bold text-slate-700">Investment amount (BDT)</label>
              <input type="number" min={project.minimumInvestment} max={remaining} step="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={`Minimum ${project.minimumInvestment}`} required className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-base font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>Minimum: {formatMoney(project.minimumInvestment)}</span><span>Remaining: {formatMoney(remaining)}</span></div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-700">Preferred payment method</label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setPaymentMethod("BANK_TRANSFER")} className={`rounded-2xl border p-4 text-left transition ${paymentMethod === "BANK_TRANSFER" ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/10" : "border-slate-200 hover:border-slate-300"}`}><Building2 className="h-5 w-5 text-emerald-700" /><p className="mt-3 font-black text-slate-900">Bank transfer</p><p className="mt-1 text-xs leading-5 text-slate-500">Transfer after approval, then upload your payment proof.</p></button>
                <button type="button" onClick={() => setPaymentMethod("STRIPE")} className={`rounded-2xl border p-4 text-left transition ${paymentMethod === "STRIPE" ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600/10" : "border-slate-200 hover:border-slate-300"}`}><CreditCard className="h-5 w-5 text-emerald-700" /><p className="mt-3 font-black text-slate-900">Stripe</p><p className="mt-1 text-xs leading-5 text-slate-500">Use secure Stripe Checkout only after admin approval.</p></button>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-slate-700">Note to admin <span className="font-normal text-slate-400">(optional)</span></label>
              <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={4} placeholder="Any context about your investment request..." className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-4 w-4 accent-emerald-700" /><span>I understand that expected returns are estimates, investment involves risk, and payment will be requested only if Admin approves my application.</span></label>

            <button type="submit" disabled={submitting || project.fundingStatus !== "OPEN"} className="mt-7 w-full rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Submitting..." : "Submit for admin review"}</button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">You are investing in</p><h2 className="mt-2 text-xl font-black text-slate-950">{project.projectName}</h2><p className="mt-2 text-sm text-slate-500">{project.farmName || "AgriNova Farm"} · {project.district}</p><div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Funding goal</span><strong>{formatMoney(project.requiredInvestment)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Estimated return</span><strong>{project.expectedReturnPercent}%</strong></div><div className="flex justify-between"><span className="text-slate-500">Duration</span><strong>{project.durationMonths} months</strong></div></div></div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-900"><div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-black">Two-stage verification</p><p className="mt-1">The project is already approved. Your individual investment request is reviewed separately before payment.</p></div></div></div>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 text-xs leading-5 text-slate-500"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Your investment status and payment steps will appear under Farmer Dashboard → My Investments.</div>
          </aside>
        </div>
      </div>
    </main>
  );
}