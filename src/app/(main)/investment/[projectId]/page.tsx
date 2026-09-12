"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Landmark,
  Loader2,
  MapPin,
  ShieldCheck,
  Sprout,
  UserRound,
  WalletCards,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getApprovedInvestmentProject } from "@/services/investment.service";
import type { InvestmentProject } from "@/types/investment";

const formatMoney = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;
const categoryLabel = (value: string) => value.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

export default function InvestmentProjectDetailsPage() {
  const params = useParams<{ projectId: string }>();
  const { data: session, isPending: sessionLoading } = useSession();
  const [project, setProject] = useState<InvestmentProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.projectId) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        setProject(await getApprovedInvestmentProject(params.projectId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Project not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.projectId]);

  const metrics = useMemo(() => {
    if (!project) return { progress: 0, remaining: 0 };
    const goal = Math.max(1, Number(project.requiredInvestment || 1));
    const funded = Math.max(0, Number(project.fundedAmount || 0));
    return { progress: Math.min(100, Math.round((funded / goal) * 100)), remaining: Math.max(0, goal - funded) };
  }, [project]);

  if (loading) return <main className="flex min-h-[65vh] items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></main>;

  if (error || !project) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-bold text-red-800">{error || "Project not found"}</p>
          <Link href="/investment" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white">Back to projects</Link>
        </div>
      </main>
    );
  }

  const role = String(session?.user?.role || "").toUpperCase();
  const currentUserId = String(session?.user?.id || "");
  const isOwner = Boolean(currentUserId && currentUserId === String(project.farmerId));
  const canApply = role === "FARMER" && !isOwner && project.fundingStatus === "OPEN" && metrics.remaining > 0;
  const investHref = `/investment/${project._id}/invest`;

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/investment" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700"><ArrowLeft className="h-4 w-4" /> All investment projects</Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-7">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-[300px] bg-gradient-to-br from-emerald-100 via-lime-50 to-white sm:h-[430px]">
                {project.projectImage ? <img src={project.projectImage} alt={project.projectName} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Sprout className="h-24 w-24 text-emerald-700/25" /></div>}
                <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-black text-emerald-800 shadow">{categoryLabel(project.category)}</span>
                  <span className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow">Admin approved</span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">{project.projectCode}</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{project.projectName}</h1>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {project.upazila}, {project.district}, {project.division}</span>
                  <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> {project.farmerName || "AgriNova Farmer"}</span>
                  <span className="inline-flex items-center gap-2"><Landmark className="h-4 w-4" /> {project.farmName || "Farm project"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black text-slate-950">Project overview</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{project.description}</p>
              <div className="my-7 h-px bg-slate-100" />
              <h3 className="font-black text-slate-900">How the funds will be used</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{project.useOfFunds}</p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [CalendarDays, "Duration", `${project.durationMonths} months`],
                [WalletCards, "Minimum investment", formatMoney(project.minimumInvestment)],
                [CircleDollarSign, "Funding goal", formatMoney(project.requiredInvestment)],
                [CircleDollarSign, "Already funded", formatMoney(project.fundedAmount)],
              ].map(([Icon, label, value]) => {
                const MetricIcon = Icon as typeof CalendarDays;
                return <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5"><MetricIcon className="h-5 w-5 text-emerald-700" /><p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{String(label)}</p><p className="mt-1 text-lg font-black text-slate-900">{String(value)}</p></div>;
              })}
            </section>

            <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-black">Important investment notice</p><p className="mt-1">Admin approval verifies the submitted project and platform workflow. Agricultural and business investments still involve risk; review the project information before committing funds.</p></div></div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-500">Funding progress</p><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{project.fundingStatus}</span></div>
              <p className="mt-3 text-3xl font-black text-slate-950">{formatMoney(project.fundedAmount)}</p>
              <p className="mt-1 text-sm text-slate-500">raised of {formatMoney(project.requiredInvestment)}</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${metrics.progress}%` }} /></div>
              <div className="mt-2 flex justify-between text-xs font-bold text-slate-400"><span>{metrics.progress}% funded</span><span>{formatMoney(metrics.remaining)} left</span></div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Minimum investment</p><p className="mt-1 font-black text-slate-900">{formatMoney(project.minimumInvestment)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">Duration</p><p className="mt-1 font-black text-slate-900">{project.durationMonths} months</p></div>
              </div>

              <div className="mt-6">
                {sessionLoading ? (
                  <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
                ) : !session?.user ? (
                  <Link href={`/login?redirect=${encodeURIComponent(investHref)}`} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-800">Sign in to invest <ArrowRight className="h-4 w-4" /></Link>
                ) : isOwner ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm font-bold text-amber-800">This is your project. You cannot invest in your own farm project.</div>
                ) : role !== "FARMER" ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm font-semibold text-slate-600">Investment applications are currently available to farmer accounts.</div>
                ) : project.fundingStatus !== "OPEN" || metrics.remaining <= 0 ? (
                  <div className="rounded-2xl bg-slate-100 p-4 text-center text-sm font-bold text-slate-600">This project is no longer accepting investments.</div>
                ) : canApply ? (
                  <Link href={investHref} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-800">Apply to invest <ArrowRight className="h-4 w-4" /></Link>
                ) : null}
              </div>

              <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-400"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> Payment is not collected during application. Admin reviews your investment request first.</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}