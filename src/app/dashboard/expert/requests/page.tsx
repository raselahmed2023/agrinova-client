"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ClipboardList,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ConsultationRequestCard from "@/components/expert/ConsultationRequestCard";
import {
  getConsultations,
  acceptConsultationRequest,
  rejectConsultationRequest,
} from "@/services/consultation.service";
import type { Consultation } from "@/types/consultation";

export default function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getConsultations({
        status: "PENDING",
        search: search.trim() || undefined,
      });
      setRequests(data);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [search]);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptConsultationRequest(id);
      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectConsultationRequest(id, "Expert currently unavailable.");
      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (urgencyFilter !== "ALL" && req.urgency !== urgencyFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/expert"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Overview
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Consultation Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming farmer problem submissions, inspect photos, and accept bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Requests
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farmer name, crop, or problem..."
            className="w-full rounded-xl bg-slate-50 py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="EMERGENCY">Emergency Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
            />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ClipboardList className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No Pending Consultation Requests
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You are all caught up! New requests from farmers will appear here as soon as they are submitted.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((request) => (
            <ConsultationRequestCard
              key={request._id || request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
              isProcessing={processingId === (request._id || request.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
