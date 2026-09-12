"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  ExternalLink,
  HandCoins,
  Loader2,
  Search,
  ShieldCheck,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import { investmentAdminService } from "@/services/admin.investment.service";
import type { InvestmentApplication, InvestmentProject } from "@/types/investment";

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;
const readable = (value: string) => value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

type Tab = "PROJECTS" | "APPLICATIONS";

export default function AdminInvestmentsPage() {
  const [tab, setTab] = useState<Tab>("PROJECTS");
  const [projects, setProjects] = useState<InvestmentProject[]>([]);
  const [applications, setApplications] = useState<InvestmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rejecting, setRejecting] = useState<{ type: "PROJECT" | "APPLICATION" | "PAYMENT"; id: string } | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const query = new URLSearchParams({ limit: "100" });
      if (search.trim()) query.set("search", search.trim());
      if (status) tab === "PROJECTS" ? query.set("status", status) : query.set(status.startsWith("PAYMENT:") ? "paymentStatus" : "status", status.replace("PAYMENT:", ""));
      if (tab === "PROJECTS") {
        const result = await investmentAdminService.getProjects(query.toString());
        setProjects(result.data);
      } else {
        const result = await investmentAdminService.getApplications(query.toString());
        setApplications(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load investment review data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [tab, status]);

  const counts = useMemo(() => ({
    projectPending: projects.filter((item) => item.status === "PENDING_REVIEW").length,
    appPending: applications.filter((item) => item.status === "PENDING_REVIEW").length,
    bankPending: applications.filter((item) => item.paymentStatus === "PENDING_VERIFICATION").length,
  }), [projects, applications]);

  const approveProject = async (id: string) => {
    try { setBusyId(id); setError(""); await investmentAdminService.approveProject(id); setMessage("Project approved and farmer notified."); await load(); } catch (err) { setError(err instanceof Error ? err.message : "Project approval failed"); } finally { setBusyId(""); }
  };

  const approveApplication = async (id: string) => {
    try { setBusyId(id); setError(""); await investmentAdminService.reviewApplication(id, "APPROVED"); setMessage("Investment decision approved. Investor can now complete payment and both farmers were notified."); await load(); } catch (err) { setError(err instanceof Error ? err.message : "Application approval failed"); } finally { setBusyId(""); }
  };

  const confirmBankPayment = async (id: string) => {
    try { setBusyId(id); setError(""); await investmentAdminService.reviewBankPayment(id, "PAID"); setMessage("Bank transfer confirmed. Funding totals and notifications were updated."); await load(); } catch (err) { setError(err instanceof Error ? err.message : "Payment confirmation failed"); } finally { setBusyId(""); }
  };

  const submitReject = async () => {
    if (!rejecting || !reviewNote.trim()) return;
    try {
      setBusyId(rejecting.id); setError("");
      if (rejecting.type === "PROJECT") await investmentAdminService.rejectProject(rejecting.id, reviewNote.trim());
      if (rejecting.type === "APPLICATION") await investmentAdminService.reviewApplication(rejecting.id, "REJECTED", reviewNote.trim());
      if (rejecting.type === "PAYMENT") await investmentAdminService.reviewBankPayment(rejecting.id, "PAYMENT_REJECTED", reviewNote.trim());
      setMessage(rejecting.type === "PAYMENT" ? "Payment proof rejected and investor notified." : "Review decision saved and notification sent.");
      setRejecting(null); setReviewNote(""); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Review failed"); } finally { setBusyId(""); }
  };

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><HandCoins className="h-6 w-6" /></div><div><h1 className="text-2xl font-black text-slate-950">Investment Control Center</h1><p className="mt-1 text-sm text-slate-500">Review funding projects, investor decisions and bank payment proof.</p></div></div></div>
          <div className="flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm"><button onClick={() => { setTab("PROJECTS"); setStatus(""); }} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === "PROJECTS" ? "bg-slate-950 text-white" : "text-slate-500"}`}>Project review</button><button onClick={() => { setTab("APPLICATIONS"); setStatus(""); }} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === "APPLICATIONS" ? "bg-slate-950 text-white" : "text-slate-500"}`}>Investor applications</button></div>
        </div>

        <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5"><Clock3 className="h-5 w-5 text-amber-600" /><p className="mt-3 text-xs font-bold uppercase text-slate-400">Pending projects loaded</p><p className="mt-1 text-2xl font-black">{counts.projectPending}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><UserRoundCheck className="h-5 w-5 text-sky-600" /><p className="mt-3 text-xs font-bold uppercase text-slate-400">Pending applications loaded</p><p className="mt-1 text-2xl font-black">{counts.appPending}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><Banknote className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-xs font-bold uppercase text-slate-400">Bank proofs loaded</p><p className="mt-1 text-2xl font-black">{counts.bankPending}</p></div></div>

        {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">{message}</div>}
        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_230px_auto]">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4"><Search className="h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void load()} placeholder={tab === "PROJECTS" ? "Search project, farmer, district..." : "Search application, project, investor..."} className="w-full py-2.5 text-sm outline-none" /></label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none"><option value="">All statuses</option>{tab === "PROJECTS" ? <><option value="PENDING_REVIEW">Pending review</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></> : <><option value="PENDING_REVIEW">Application pending</option><option value="APPROVED">Application approved</option><option value="REJECTED">Application rejected</option><option value="PAYMENT:PENDING_VERIFICATION">Bank proof pending</option><option value="PAYMENT:PAID">Paid</option></>}</select>
          <button onClick={() => void load()} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-black text-white">Search</button>
        </div>

        {loading ? <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="h-7 w-7 animate-spin text-emerald-700" /></div> : tab === "PROJECTS" ? (
          <div className="grid gap-5 xl:grid-cols-2">{projects.length === 0 ? <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm text-slate-500">No investment projects match this filter.</div> : projects.map((project) => <article key={project._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${project.status === "PENDING_REVIEW" ? "bg-amber-50 text-amber-700" : project.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{readable(project.status)}</span><span className="text-xs font-bold text-slate-400">{project.projectCode}</span></div><h2 className="mt-3 text-xl font-black text-slate-950">{project.projectName}</h2><p className="mt-1 text-sm text-slate-500">{project.farmerName} · {project.farmName || "Farm"} · {project.district}</p></div><ShieldCheck className="h-6 w-6 text-emerald-600" /></div><div className="mt-5 grid grid-cols-3 gap-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-400">Goal</p><p className="mt-1 text-sm font-black">{money(project.requiredInvestment)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-400">Minimum</p><p className="mt-1 text-sm font-black">{money(project.minimumInvestment)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] text-slate-400">Duration</p><p className="mt-1 text-sm font-black">{project.durationMonths} mo</p></div></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{project.description}</p>{project.adminNote && <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"><strong>Admin note:</strong> {project.adminNote}</div>}{project.status === "PENDING_REVIEW" && <div className="mt-5 flex gap-3"><button disabled={busyId === project._id} onClick={() => void approveProject(project._id)} className="flex-1 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">Approve & publish</button><button onClick={() => { setRejecting({ type: "PROJECT", id: project._id }); setReviewNote(""); }} className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-700">Reject</button></div>}</article>)}</div>
        ) : (
          <div className="space-y-5">{applications.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm text-slate-500">No investor applications match this filter.</div> : applications.map((app) => <article key={app._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-black ${app.status === "PENDING_REVIEW" ? "bg-amber-50 text-amber-700" : app.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{readable(app.status)}</span><span className={`rounded-full px-3 py-1 text-xs font-black ${app.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-700" : app.paymentStatus === "PENDING_VERIFICATION" ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-600"}`}>{readable(app.paymentStatus)}</span><span className="text-xs font-bold text-slate-400">{app.applicationCode}</span></div><h2 className="mt-3 text-xl font-black text-slate-950">{app.projectName}</h2><div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4"><div><p className="text-xs text-slate-400">Investor</p><p className="font-bold text-slate-800">{app.investorName || app.investorEmail}</p></div><div><p className="text-xs text-slate-400">NID (Admin only)</p><p className="font-mono font-bold text-slate-900">{app.nidNumber || "—"}</p></div><div><p className="text-xs text-slate-400">Project owner</p><p className="font-bold text-slate-800">{app.projectOwnerName || app.projectOwnerEmail}</p></div><div><p className="text-xs text-slate-400">Amount</p><p className="font-black text-slate-900">{money(app.amount)}</p></div><div><p className="text-xs text-slate-400">Payment method</p><p className="font-bold text-slate-800">{app.paymentMethod === "STRIPE" ? "Stripe" : "Bank transfer"}</p></div></div>{app.note && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600"><strong>Investor note:</strong> {app.note}</p>}{app.adminNote && <p className="mt-3 text-sm text-red-700"><strong>Review note:</strong> {app.adminNote}</p>}</div><div className="w-full space-y-2 lg:w-56">{app.status === "PENDING_REVIEW" && <><button disabled={busyId === app._id} onClick={() => void approveApplication(app._id)} className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">Approve investment</button><button onClick={() => { setRejecting({ type: "APPLICATION", id: app._id }); setReviewNote(""); }} className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-700">Reject investment</button></>}{app.paymentStatus === "PENDING_VERIFICATION" && <><a href={app.paymentProofUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700">View proof <ExternalLink className="h-4 w-4" /></a><button disabled={busyId === app._id} onClick={() => void confirmBankPayment(app._id)} className="w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">Confirm transfer</button><button onClick={() => { setRejecting({ type: "PAYMENT", id: app._id }); setReviewNote(""); }} className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-black text-red-700">Reject proof</button></>}{app.paymentStatus === "PAID" && <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-black text-emerald-700"><CheckCircle2 className="mx-auto mb-1 h-5 w-5" /> Confirmed paid</div>}</div></div>{app.paymentStatus === "PENDING_VERIFICATION" && <div className="mt-5 grid gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm sm:grid-cols-3"><div><p className="text-xs text-sky-600">Sender bank</p><p className="font-bold text-sky-950">{app.senderBankName || "—"}</p></div><div><p className="text-xs text-sky-600">Transaction reference</p><p className="font-bold text-sky-950">{app.transactionReference || "—"}</p></div><div><p className="text-xs text-sky-600">Amount expected</p><p className="font-black text-sky-950">{money(app.amount)}</p></div></div>}</article>)}</div>
        )}
      </div>

      {rejecting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700"><XCircle className="h-5 w-5" /></div><h2 className="mt-4 text-xl font-black text-slate-950">{rejecting.type === "PAYMENT" ? "Reject payment proof" : "Reject submission"}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Give a clear reason. The farmer will receive this in their notification/status area.</p><textarea autoFocus value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={4} placeholder="Reason for rejection..." className="mt-4 w-full rounded-2xl border border-slate-200 p-3 text-sm outline-none focus:border-red-400" /><div className="mt-5 flex justify-end gap-3"><button onClick={() => { setRejecting(null); setReviewNote(""); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button disabled={!reviewNote.trim() || busyId === rejecting.id} onClick={() => void submitReject()} className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">Save rejection</button></div></div></div>}
    </div>
  );
}