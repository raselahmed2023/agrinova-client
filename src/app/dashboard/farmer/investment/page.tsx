"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Loader2, PlusCircle, XCircle } from "lucide-react";
import { getMyFarms } from "@/services/farm.service";
import { createInvestmentProject, getMyInvestmentProjects } from "@/services/investment.service";
import type { IFarm } from "@/types/farm";
import type { CreateInvestmentProjectPayload, InvestmentCategory, InvestmentProject } from "@/types/investment";

const categories: Array<{ value: InvestmentCategory; label: string }> = [
  { value: "vegetable_farming", label: "Vegetable Farming" },
  { value: "organic_farming", label: "Organic Farming" },
  { value: "poultry", label: "Poultry" },
  { value: "livestock", label: "Livestock" },
  { value: "fishery", label: "Fishery" },
  { value: "greenhouse", label: "Greenhouse" },
  { value: "irrigation", label: "Irrigation" },
  { value: "equipment", label: "Equipment" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

const initialForm: CreateInvestmentProjectPayload = {
  farmId: "",
  projectName: "",
  category: "vegetable_farming",
  requiredInvestment: 100000,
  minimumInvestment: 5000,
  durationMonths: 6,
  description: "",
  useOfFunds: "",
};

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

export default function NeedInvestmentPage() {
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [projects, setProjects] = useState<InvestmentProject[]>([]);
  const [form, setForm] = useState<CreateInvestmentProjectPayload>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const activeFarms = useMemo(() => farms.filter((farm) => farm.status === "Active"), [farms]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [farmData, projectData] = await Promise.all([getMyFarms(), getMyInvestmentProjects()]);
      setFarms(farmData);
      setProjects(projectData);
      setForm((current) => ({ ...current, farmId: current.farmId || farmData.find((farm) => farm.status === "Active")?._id || "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load investment workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const update = <K extends keyof CreateInvestmentProjectPayload>(key: K, value: CreateInvestmentProjectPayload[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createInvestmentProject(form);
      setSuccess("Investment request submitted. Admin will review it before it becomes public.");
      setForm({ ...initialForm, farmId: form.farmId });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit investment request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-7 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Farmer funding</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">Need Investment</h1>
        <p className="mt-3 max-w-3xl text-emerald-50/90">Submit only the information an investor actually needs. Revenue estimates, profit-sharing percentages and farmer contribution are intentionally not collected.</p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3"><PlusCircle className="h-6 w-6 text-emerald-700" /><div><h2 className="text-xl font-black text-slate-950">Request funding</h2><p className="text-sm text-slate-500">Simple, review-ready project information.</p></div></div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Farm</span><select value={form.farmId} onChange={(e) => update("farmId", e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600"><option value="">Select farm</option>{activeFarms.map((farm) => <option key={farm._id} value={farm._id}>{farm.name}</option>)}</select></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Category</span><select value={form.category} onChange={(e) => update("category", e.target.value as InvestmentCategory)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600">{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="space-y-2 md:col-span-2"><span className="text-sm font-bold text-slate-700">Project name</span><input value={form.projectName} onChange={(e) => update("projectName", e.target.value)} required maxLength={150} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="e.g. Expand greenhouse vegetable production" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Funding goal</span><input type="number" min={1} value={form.requiredInvestment} onChange={(e) => update("requiredInvestment", Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Minimum investment</span><input type="number" min={1} value={form.minimumInvestment} onChange={(e) => update("minimumInvestment", Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Project duration (months)</span><input type="number" min={1} max={120} value={form.durationMonths} onChange={(e) => update("durationMonths", Number(e.target.value))} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" /></label>
            <label className="space-y-2"><span className="text-sm font-bold text-slate-700">Project image URL <span className="font-normal text-slate-400">optional</span></span><input value={form.projectImage || ""} onChange={(e) => update("projectImage", e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="https://..." /></label>
            <label className="space-y-2 md:col-span-2"><span className="text-sm font-bold text-slate-700">Project description</span><textarea value={form.description} onChange={(e) => update("description", e.target.value)} required rows={5} maxLength={3000} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="What will you build or expand, and why is it needed?" /></label>
            <label className="space-y-2 md:col-span-2"><span className="text-sm font-bold text-slate-700">How the funding will be used</span><textarea value={form.useOfFunds} onChange={(e) => update("useOfFunds", e.target.value)} required rows={4} maxLength={1200} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-600" placeholder="Seeds, equipment, irrigation, livestock, working capital..." /></label>
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
          {success && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{success}</p>}
          <button disabled={submitting || !form.farmId} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 font-black text-white hover:bg-emerald-800 disabled:opacity-50">{submitting && <Loader2 className="h-4 w-4 animate-spin" />}Submit for review</button>
        </form>

        <section className="space-y-4"><div><h2 className="text-xl font-black text-slate-950">Your funding requests</h2><p className="text-sm text-slate-500">Track Admin review and funding progress.</p></div>{projects.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No investment request yet.</div> : projects.map((project) => { const Icon = project.status === "APPROVED" ? CheckCircle2 : project.status === "REJECTED" ? XCircle : Clock3; return <article key={project._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wide text-emerald-700">{project.projectCode}</p><h3 className="mt-1 text-lg font-black text-slate-950">{project.projectName}</h3><p className="mt-1 text-sm text-slate-500">{project.farmName || "Farm"} · {project.district}</p></div><Icon className={`h-6 w-6 ${project.status === "APPROVED" ? "text-emerald-600" : project.status === "REJECTED" ? "text-red-600" : "text-amber-500"}`} /></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Goal</p><p className="font-black">{money(project.requiredInvestment)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Funded</p><p className="font-black">{money(project.fundedAmount)}</p></div></div>{project.adminNote && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800"><strong>Admin note:</strong> {project.adminNote}</p>}</article>; })}</section>
      </div>
    </div>
  );
}