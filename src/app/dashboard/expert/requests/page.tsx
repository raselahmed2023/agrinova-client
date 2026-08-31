"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ClipboardList,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
  Eye,
  Building2,
  MapPin,
  Sprout,
  Calendar,
  LayoutGrid,
  List,
  AlertCircle,
} from "lucide-react";
import ConsultationRequestCard from "@/components/expert/ConsultationRequestCard";
import ConsultationStatusBadge, {
  UrgencyBadge,
} from "@/components/expert/ConsultationStatusBadge";
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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

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

  const handleOpenReject = (id: string) => {
    setRejectingId(id);
    setRejectReason("Unable to handle this consultation.");
  };

  const handleConfirmReject = async () => {
    if (!rejectingId) return;
    setProcessingId(rejectingId);
    try {
      await rejectConsultationRequest(
        rejectingId,
        rejectReason || "Unable to handle this consultation."
      );
      setRejectingId(null);
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
            Review incoming farmer problem submissions, inspect crop symptoms, and accept or reject requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "table"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </button>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farmer name, farm, district, crop, or problem..."
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

      {/* Content Rendering */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
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
            You are all caught up! New requests submitted by farmers will appear here.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Required Table View:
           Farmer Name, Farm Name, District, Crop, Problem Title, Requested Date, Status, Action (View, Accept, Reject)
        */
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-4">Farmer Name</th>
                  <th className="py-4 px-4">Farm Name</th>
                  <th className="py-4 px-4">District</th>
                  <th className="py-4 px-4">Crop</th>
                  <th className="py-4 px-4">Problem Title</th>
                  <th className="py-4 px-4">Requested Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRequests.map((req) => {
                  const reqId = req._id || req.id || "";
                  const farmName =
                    req.farmName || req.farmer?.farmName || "Standard Farmland";
                  const district =
                    req.district ||
                    req.farmer?.district ||
                    req.farmer?.location ||
                    "Bangladesh";
                  const requestedDate =
                    req.preferredDate ||
                    new Date(req.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  const isProcessing = processingId === reqId;

                  return (
                    <tr
                      key={reqId}
                      className="group transition hover:bg-slate-50/80"
                    >
                      {/* Farmer Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-900 font-bold overflow-hidden flex items-center justify-center text-xs shrink-0 border border-emerald-200">
                            {req.farmer?.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={req.farmer.avatar}
                                alt={req.farmer.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              req.farmer?.name?.charAt(0) || "F"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-emerald-900">
                              {req.farmer?.name}
                            </p>
                            {req.farmer?.phone && (
                              <p className="text-[11px] text-slate-400">
                                {req.farmer.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Farm Name */}
                      <td className="py-4 px-4">
                        <span className="font-medium text-slate-700">
                          {farmName}
                        </span>
                      </td>

                      {/* District */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="h-3 w-3 text-rose-500" />
                          {district}
                        </span>
                      </td>

                      {/* Crop */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800">
                          <Sprout className="h-3 w-3 text-emerald-600" />
                          {req.cropType}
                        </span>
                      </td>

                      {/* Problem Title */}
                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-bold text-slate-800 truncate">
                          {req.problemTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {req.problemDescription}
                        </p>
                      </td>

                      {/* Requested Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                          {requestedDate}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <ConsultationStatusBadge status={req.status} size="sm" />
                      </td>

                      {/* Actions: View, Accept, Reject */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Action */}
                          <Link
                            href={`/dashboard/expert/requests/${reqId}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                            title="View Consultation Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>

                          {/* Accept Action */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleAccept(reqId)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                            title="Accept Request"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Accept
                          </button>

                          {/* Reject Action */}
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleOpenReject(reqId)}
                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                            title="Reject Request"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((request) => (
            <ConsultationRequestCard
              key={request._id || request.id}
              request={request}
              onAccept={handleAccept}
              onReject={(id) => handleOpenReject(id)}
              isProcessing={processingId === (request._id || request.id)}
            />
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2 rounded-xl bg-rose-100">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reject Consultation Request
                </h3>
                <p className="text-xs text-slate-500">
                  Provide a note explaining why this request cannot be accepted.
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Unable to handle this consultation / fully booked this week."
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={Boolean(processingId)}
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
