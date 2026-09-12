"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { createInvestmentApplication, getApprovedInvestmentProject } from "@/services/investment.service";
import type { InvestmentPaymentMethod, InvestmentProject } from "@/types/investment";

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

export default function InvestPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const [project, setProject] = useState<InvestmentProject | null>(null);
  const [amount, setAmount] = useState(0);
  const [nidNumber, setNidNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<InvestmentPaymentMethod>("BANK_TRANSFER");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getApprovedInvestmentProject(params.projectId);
        setProject(data);
        setAmount(data.minimumInvestment);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.projectId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!project) return;
    try {
      setSubmitting(true);
      setError("");
      await createInvestmentApplication(project._id, { amount, nidNumber, note: note.trim() || undefined, paymentMethod });
      setNidNumber("");
      router.push("/dashboard/farmer/my-investments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit investment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>;
  if (!project) return <div className="mx-auto max-w-3xl p-8 text-center text-red-700">{error || "Project not found"}</div>;

  const remaining = Math.max(project.requiredInvestment - project.fundedAmount, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">You are investing in</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">{project.projectName}</h1>
          <p className="mt-2 text-sm text-slate-500">{project.farmName || "Farm"} · {project.district}</p>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Funding goal</span><strong>{money(project.requiredInvestment)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Already funded</span><strong>{money(project.fundedAmount)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Remaining</span><strong>{money(remaining)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Minimum</span><strong>{money(project.minimumInvestment)}</strong></div><div className="flex justify-between"><span className="text-slate-500">Duration</span><strong>{project.durationMonths} months</strong></div></div>
        </aside>

        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4"><ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-700" /><div><p className="font-black text-emerald-950">Identity verification</p><p className="mt-1 text-sm text-emerald-800">Your NID number is collected for Admin verification only. It is not shown to the project owner, other farmers, or on the public investment page.</p></div></div>
          <div className="mt-6 grid gap-5">
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Investment amount</span><input type="number" min={project.minimumInvestment} max={remaining} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">NID number</span><input inputMode="numeric" autoComplete="off" value={nidNumber} onChange={(e) => setNidNumber(e.target.value.replace(/\D/g, "").slice(0, 20))} minLength={10} maxLength={20} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="Enter NID number" /><p className="text-xs text-slate-400">Admin-only verification field.</p></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Preferred payment method</span><select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as InvestmentPaymentMethod)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"><option value="BANK_TRANSFER">Bank transfer</option><option value="STRIPE">Stripe</option></select></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Note <span className="font-normal text-slate-400">optional</span></span><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} maxLength={800} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="Anything Admin should know about this investment request" /></label>
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 font-black text-white hover:bg-emerald-800 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}Submit for Admin review</button>
        </form>
      </div>
    </main>
  );
}