"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Inbox,
  RefreshCw,
  Search,
  AlertCircle,
  BadgeCheck,
  Clock3,
} from "lucide-react";
import ConsultationRequestCard from "@/components/expert/ConsultationRequestCard";
import {
  acceptConsultation,
  getConsultations,
  rejectConsultation,
} from "@/services/consultation.service";
import type { Consultation } from "@/types/consultation";

export default function ConsultationRequestsPage() {
  const searchParams = useSearchParams();
  const initialStatus =
    searchParams.get("status") === "ACCEPTED" ? "ACCEPTED" : "ALL";

  const [requests, setRequests] = useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "ACCEPTED">(
    initialStatus
  );
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getConsultations({
        status: "ALL",
        search: search.trim() || undefined,
        isExpert: true,
      });

      setRequests(
        data.filter(
          (item) => item.status === "PENDING" || item.status === "ACCEPTED"
        )
      );
    } catch (err) {
      console.error("Failed to load consultation requests:", err);
      setRequests([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load consultation requests."
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRequests();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [loadRequests]);

  const handleAccept = async (id: string) => {
    if (!id) return;

    setProcessingId(id);
    setError(null);

    try {
      await acceptConsultation(id);
      await loadRequests();
    } catch (err) {
      console.error("Failed to accept consultation:", err);
      setError(err instanceof Error ? err.message : "Unable to accept request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!id) return;

    const reason = window.prompt(
      "Reason for rejecting this consultation request (optional):"
    );

    if (reason === null) return;

    setProcessingId(id);
    setError(null);

    try {
      await rejectConsultation(id, reason.trim() || undefined);
      await loadRequests();
    } catch (err) {
      console.error("Failed to reject consultation:", err);
      setError(err instanceof Error ? err.message : "Unable to reject request.");
    } finally {
      setProcessingId(null);
    }
  };

  const counts = useMemo(() => {
    const pending = requests.filter((item) => item.status === "PENDING").length;
    const accepted = requests.filter((item) => item.status === "ACCEPTED").length;

    return {
      all: pending + accepted,
      pending,
      accepted,
    };
  }, [requests]);

  const displayedRequests = useMemo(() => {
    if (activeTab === "ALL") return requests;
    return requests.filter((item) => item.status === activeTab);
  }, [activeTab, requests]);

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-slate-50/60 p-3.5 sm:p-6 lg:p-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/dashboard/expert"
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-200 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                  Consultation Requests
                </h1>
                <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
                  Review new farmer requests and schedule consultations you have accepted.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-bold">Unable to complete the request</p>
            <p className="mt-0.5 text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setActiveTab("ALL")}
          className={`rounded-2xl border p-4 text-left transition ${
            activeTab === "ALL"
              ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100"
              : "border-slate-200 bg-white hover:border-emerald-300"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            All Active Requests
          </p>
          <p className="mt-1 text-3xl font-black text-slate-950">{counts.all}</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PENDING")}
          className={`rounded-2xl border p-4 text-left transition ${
            activeTab === "PENDING"
              ? "border-amber-500 bg-amber-50 ring-2 ring-amber-100"
              : "border-slate-200 bg-white hover:border-amber-300"
          }`}
        >
          <div className="flex items-center gap-2 text-amber-700">
            <Clock3 className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wide">Pending</p>
          </div>
          <p className="mt-1 text-3xl font-black text-slate-950">{counts.pending}</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ACCEPTED")}
          className={`rounded-2xl border p-4 text-left transition ${
            activeTab === "ACCEPTED"
              ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100"
              : "border-slate-200 bg-white hover:border-sky-300"
          }`}
        >
          <div className="flex items-center gap-2 text-sky-700">
            <BadgeCheck className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wide">Accepted</p>
          </div>
          <p className="mt-1 text-3xl font-black text-slate-950">{counts.accepted}</p>
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search farmer, crop, farm or problem..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Inbox className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-900">
            No consultation requests found
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
            Requests assigned to you, plus currently unassigned pending requests, will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {displayedRequests.map((request) => {
            const id = request._id || request.id || "";

            return (
              <ConsultationRequestCard
                key={id}
                request={request}
                isProcessing={processingId === id}
                onAccept={request.status === "PENDING" ? handleAccept : undefined}
                onReject={request.status === "PENDING" ? handleReject : undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
