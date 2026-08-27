"use client";

import {
  Inbox,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import RequestCard from "./RequestCard";

import { authClient } from "@/lib/auth-client";

import {
  getReceivedPurchaseRequests,
  getSentPurchaseRequests,
  updatePurchaseRequestStatus,
} from "@/services/marketplace.service";

import type {
  PurchaseRequest,
  PurchaseRequestStatus,
} from "@/types/marketplace";

type Tab =
  | "sent"
  | "received";

export default function PurchaseRequestsPanel() {
  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const userEmail =
    session?.user?.email ||
    "";

  const [tab, setTab] =
    useState<Tab>("sent");

  const [
    sentRequests,
    setSentRequests,
  ] = useState<
    PurchaseRequest[]
  >([]);

  const [
    receivedRequests,
    setReceivedRequests,
  ] = useState<
    PurchaseRequest[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingId,
    setUpdatingId,
  ] = useState<
    string | null
  >(null);

  const fetchRequests =
    useCallback(async () => {
      if (!userEmail) {
        setSentRequests([]);
        setReceivedRequests([]);
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          sent,
          received,
        ] = await Promise.all([
          getSentPurchaseRequests(
            userEmail
          ),

          getReceivedPurchaseRequests(
            userEmail
          ),
        ]);

        setSentRequests(
          sent.data || []
        );

        setReceivedRequests(
          received.data || []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load purchase requests."
        );
      } finally {
        setLoading(false);
      }
    }, [userEmail]);

  useEffect(() => {
    if (!isPending) {
      fetchRequests();
    }
  }, [
    fetchRequests,
    isPending,
  ]);

  const handleStatusChange =
    async (
      requestId: string,
      status: PurchaseRequestStatus
    ) => {
      if (!userEmail) {
        setError(
          "Please login first."
        );

        return;
      }

      try {
        setUpdatingId(
          requestId
        );

        setError("");

        await updatePurchaseRequestStatus(
          requestId,
          status,
          userEmail
        );

        await fetchRequests();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update request."
        );
      } finally {
        setUpdatingId(null);
      }
    };

  const activeRequests =
    tab === "sent"
      ? sentRequests
      : receivedRequests;

  if (isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#f7f9f8]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-lg font-bold text-amber-800">
              Login Required
            </h2>

            <p className="mt-2 text-sm text-amber-700">
              Please login to view
              your purchase requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Farmer Marketplace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Purchase Requests
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track your sent
              requests and manage
              requests from buyers.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Logged in as{" "}
              <span className="font-semibold text-slate-600">
                {session.user.email}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={
              fetchRequests
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() =>
              setTab("sent")
            }
            className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
              tab === "sent"
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Send className="h-4 w-4" />

            Sent

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                tab === "sent"
                  ? "bg-white/20"
                  : "bg-slate-100"
              }`}
            >
              {
                sentRequests.length
              }
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setTab(
                "received"
              )
            }
            className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
              tab ===
              "received"
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Inbox className="h-4 w-4" />

            Received

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                tab ===
                "received"
                  ? "bg-white/20"
                  : "bg-slate-100"
              }`}
            >
              {
                receivedRequests.length
              }
            </span>
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading requests...
              </p>
            </div>
          </div>
        ) : activeRequests.length ===
          0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            {tab === "sent" ? (
              <Send className="h-12 w-12 text-slate-300" />
            ) : (
              <Inbox className="h-12 w-12 text-slate-300" />
            )}

            <h2 className="mt-4 text-lg font-bold text-slate-800">
              {tab === "sent"
                ? "No sent requests"
                : "No received requests"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {tab === "sent"
                ? "Purchase requests you send will appear here."
                : "Buyer requests for your products will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeRequests.map(
              (request) => (
                <RequestCard
                  key={
                    request._id
                  }
                  request={
                    request
                  }
                  type={tab}
                  updatingId={
                    updatingId
                  }
                  onStatusChange={
                    handleStatusChange
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}