"use client";

import {
  CheckCircle2,
  Clock3,
  HandCoins,
  ImagePlus,
  Leaf,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getMyFarms } from "@/services/farm.service";
import {
  createInvestmentProject,
  getMyInvestmentProjects,
} from "@/services/investment.service";
import type { IFarm } from "@/types/farm";
import type {
  CreateInvestmentProjectPayload,
  InvestmentCategory,
  InvestmentProject,
} from "@/types/investment";

const categories: { value: InvestmentCategory; label: string }[] = [
  { value: "vegetable_farming", label: "Vegetable farming" },
  { value: "organic_farming", label: "Organic farming" },
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
  ownContribution: 0,
  durationMonths: 6,
  expectedReturnPercent: 10,
  investorSharePercent: 20,
  description: "",
  useOfFunds: "",
};

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

const statusUI = (status: InvestmentProject["status"]) => {
  if (status === "APPROVED") {
    return { label: "Approved & public", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700" };
  }
  if (status === "REJECTED") {
    return { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-700" };
  }
  return { label: "Pending admin review", icon: Clock3, className: "bg-amber-50 text-amber-700" };
};

async function uploadImage(file: File) {
  const body = new FormData();
  body.append("image", file);
  const response = await fetch("/api/upload", { method: "POST", body });
  const result = await response.json();
  if (!response.ok || !result?.success || !result?.url) {
    throw new Error(result?.message || "Image upload failed");
  }
  return String(result.url);
}

export default function NeedInvestmentPage() {
  const [farms, setFarms] = useState<IFarm[]>([]);
  const [projects, setProjects] = useState<InvestmentProject[]>([]);
  const [form, setForm] = useState<CreateInvestmentProjectPayload>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const activeFarms = useMemo(() => farms.filter((farm) => farm.status === "Active"), [farms]);
  const selectedFarm = useMemo(
    () => activeFarms.find((farm) => farm._id === form.farmId) || null,
    [activeFarms, form.farmId]
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const [farmData, projectData] = await Promise.all([getMyFarms(), getMyInvestmentProjects()]);
      setFarms(farmData);
      setProjects(projectData);
      setForm((current) => ({
        ...current,
        farmId:
          current.farmId && farmData.some((farm) => farm._id === current.farmId)
            ? current.farmId
            : farmData.find((farm) => farm.status === "Active")?._id || "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load investment workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const update = <K extends keyof CreateInvestmentProjectPayload>(
    key: K,
    value: CreateInvestmentProjectPayload[K]
  ) => setForm((current) => ({ ...current, [key]: value }));

  const handleImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Use a JPG, PNG or WEBP image under 5MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.farmId) {
      setError("Select one of your active farms first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");
      let projectImage: string | undefined;
      if (imageFile) projectImage = await uploadImage(imageFile);

      await createInvestmentProject({ ...form, projectImage });
      setMessage("Funding request submitted. Admin will review it before it appears publicly.");
      setImageFile(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setForm({ ...initialForm, farmId: form.farmId });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit funding request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-6 text-white shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
                <Sparkles className="h-4 w-4" />
                Farmer Funding Workspace
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Need investment for a farm?</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/85 sm:text-base">
                Choose an existing farm, explain the funding goal, and submit one clear proposal. AgriNova Admin reviews it before investors can see it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="mt-1 text-xs text-emerald-100">Total requests</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="text-2xl font-bold">{projects.filter((p) => p.status === "APPROVED").length}</p>
                <p className="mt-1 text-xs text-emerald-100">Approved</p>
              </div>
            </div>
          </div>
        </section>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}

        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Funding request</h2>
                <p className="mt-1 text-sm text-slate-500">Only the information investors actually need.</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Farm" className="sm:col-span-2">
                <select value={form.farmId} onChange={(e) => update("farmId", e.target.value)} className={inputClass} required>
                  <option value="">Select an active farm</option>
                  {activeFarms.map((farm) => <option key={farm._id} value={farm._id}>{farm.name} · {farm.district}</option>)}
                </select>
                {selectedFarm && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                    {selectedFarm.farmType} · {selectedFarm.upazila}, {selectedFarm.district}, {selectedFarm.division}
                  </p>
                )}
              </Field>

              <Field label="Project title" className="sm:col-span-2">
                <input value={form.projectName} onChange={(e) => update("projectName", e.target.value)} className={inputClass} placeholder="e.g. Winter vegetable expansion" required />
              </Field>

              <Field label="Category">
                <select value={form.category} onChange={(e) => update("category", e.target.value as InvestmentCategory)} className={inputClass}>
                  {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </Field>

              <Field label="Project duration (months)">
                <input type="number" min={1} max={120} value={form.durationMonths} onChange={(e) => update("durationMonths", Number(e.target.value))} className={inputClass} required />
              </Field>

              <Field label="Funding goal (BDT)">
                <input type="number" min={1} value={form.requiredInvestment} onChange={(e) => update("requiredInvestment", Number(e.target.value))} className={inputClass} required />
              </Field>

              <Field label="Minimum single investment (BDT)">
                <input type="number" min={1} value={form.minimumInvestment} onChange={(e) => update("minimumInvestment", Number(e.target.value))} className={inputClass} required />
              </Field>

              <Field label="Your own contribution (BDT)">
                <input type="number" min={0} value={form.ownContribution || 0} onChange={(e) => update("ownContribution", Number(e.target.value))} className={inputClass} />
              </Field>

              <Field label="Expected project return (%)">
                <input type="number" min={0} max={100} step="0.1" value={form.expectedReturnPercent} onChange={(e) => update("expectedReturnPercent", Number(e.target.value))} className={inputClass} required />
              </Field>

              <Field label="Investor profit share (%)" className="sm:col-span-2">
                <input type="number" min={0} max={100} step="0.1" value={form.investorSharePercent} onChange={(e) => update("investorSharePercent", Number(e.target.value))} className={inputClass} required />
              </Field>

              <Field label="Project summary" className="sm:col-span-2">
                <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputClass} min-h-28 resize-y py-3`} placeholder="What will the project do and why is funding needed?" required />
              </Field>

              <Field label="How the investment will be used" className="sm:col-span-2">
                <textarea value={form.useOfFunds} onChange={(e) => update("useOfFunds", e.target.value)} className={`${inputClass} min-h-24 resize-y py-3`} placeholder="Example: seeds, feed, irrigation equipment, labor, storage..." required />
              </Field>

              <Field label="Project image" className="sm:col-span-2">
                <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50/40">
                  {preview ? <img src={preview} alt="Project preview" className="h-20 w-28 rounded-xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><ImagePlus className="h-6 w-6" /></span>}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">{imageFile?.name || "Upload a clear farm/project image"}</span>
                    <span className="mt-1 block text-xs text-slate-500">JPG, PNG or WEBP · max 5MB</span>
                  </span>
                  <UploadCloud className="h-5 w-5 text-slate-400" />
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImage(e.target.files?.[0])} />
                </label>
              </Field>
            </div>

            <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
              Expected returns are estimates, not guarantees. Admin review checks completeness and platform eligibility; it does not guarantee project performance.
            </div>

            <button type="submit" disabled={submitting || loading || activeFarms.length === 0} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
              {submitting ? "Submitting for review..." : "Submit funding request"}
            </button>
          </form>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">My funding projects</h2>
                <p className="mt-1 text-sm text-slate-500">Track review and funding progress.</p>
              </div>
              <button type="button" onClick={() => void load()} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" aria-label="Refresh">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500"><Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />Loading...</div>
            ) : projects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <HandCoins className="mx-auto h-9 w-9 text-slate-300" />
                <p className="mt-3 font-semibold text-slate-800">No funding requests yet</p>
                <p className="mt-1 text-sm text-slate-500">Your submitted projects will appear here.</p>
              </div>
            ) : (
              projects.map((project) => {
                const status = statusUI(project.status);
                const StatusIcon = status.icon;
                const percent = Math.min(Math.round((Number(project.fundedAmount || 0) / Math.max(Number(project.requiredInvestment || 1), 1)) * 100), 100);
                return (
                  <article key={project._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex gap-4 p-5">
                      {project.projectImage ? <img src={project.projectImage} alt={project.projectName} className="h-24 w-28 shrink-0 rounded-2xl object-cover" /> : <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><HandCoins className="h-8 w-8" /></div>}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-slate-400">{project.projectCode}</p>
                            <h3 className="mt-1 truncate font-bold text-slate-900">{project.projectName}</h3>
                            <p className="mt-1 text-xs text-slate-500">{project.farmName || "Farm"} · {project.district}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}><StatusIcon className="h-3.5 w-3.5" />{status.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 p-5">
                      <div className="flex items-center justify-between text-xs text-slate-500"><span>{money(project.fundedAmount || 0)} funded</span><span>{money(project.requiredInvestment)}</span></div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${percent}%` }} /></div>
                      <div className="mt-3 flex items-center justify-between text-xs"><span className="font-semibold text-emerald-700">{percent}% funded</span><span className="text-slate-400">Min {money(project.minimumInvestment || 1000)}</span></div>
                      {project.status === "REJECTED" && project.adminNote && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700"><strong>Admin feedback:</strong> {project.adminNote}</div>}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}