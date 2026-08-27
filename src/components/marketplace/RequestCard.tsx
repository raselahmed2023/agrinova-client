"use client";

import {
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Package,
  Store,
  User,
  XCircle,
} from "lucide-react";

import RequestStatusBadge from "./RequestStatusBadge";

import type {
  PurchaseRequest,
  PurchaseRequestStatus,
} from "@/types/marketplace";

interface RequestCardProps {
  request: PurchaseRequest;
  type: "sent" | "received";
  updatingId: string | null;
  onStatusChange: (
    requestId: string,
    status: PurchaseRequestStatus
  ) => void;
}

export default function RequestCard({
  request,
  type,
  updatingId,
  onStatusChange,
}: RequestCardProps) {
  const isUpdating =
    updatingId === request._id;

  const total =
    request.productPrice *
    request.quantity;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <RequestStatusBadge
              status={request.status}
            />

            <span className="text-xs text-slate-400">
              #{request._id.slice(-6)}
            </span>
          </div>

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            {request.productTitle}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ৳
            {request.productPrice.toLocaleString()}{" "}
            × {request.quantity}{" "}
            {request.unit}
          </p>
        </div>

        <div className="shrink-0 text-left md:text-right">
          <p className="text-xs font-medium text-slate-400">
            Estimated Total
          </p>

          <p className="mt-1 text-xl font-extrabold text-emerald-600">
            ৳{total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-2">
        <div className="flex items-start gap-3">
          {type === "sent" ? (
            <Store className="mt-0.5 h-4 w-4 text-emerald-600" />
          ) : (
            <User className="mt-0.5 h-4 w-4 text-emerald-600" />
          )}

          <div>
            <p className="text-xs text-slate-400">
              {type === "sent"
                ? "Seller"
                : "Buyer"}
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              {type === "sent"
                ? request.sellerName ||
                  request.sellerEmail
                : request.buyerName ||
                  request.buyerEmail}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />

          <div>
            <p className="text-xs text-slate-400">
              Delivery Location
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              {request.deliveryLocation}
            </p>
          </div>
        </div>
      </div>

      {request.note && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-400">
            Note
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {request.note}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        {type === "received" &&
          request.status === "PENDING" && (
            <>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onStatusChange(
                    request._id,
                    "ACCEPTED"
                  )
                }
                className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}

                Accept
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() =>
                  onStatusChange(
                    request._id,
                    "REJECTED"
                  )
                }
                className="flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </>
          )}

        {type === "received" &&
          request.status ===
            "ACCEPTED" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  request._id,
                  "PROCESSING"
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Clock3 className="h-4 w-4" />
              )}

              Start Processing
            </button>
          )}

        {type === "received" &&
          request.status ===
            "PROCESSING" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  request._id,
                  "COMPLETED"
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Mark Completed
            </button>
          )}

        {type === "sent" &&
          request.status === "PENDING" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(
                  request._id,
                  "CANCELLED"
                )
              }
              className="flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}

              Cancel Request
            </button>
          )}

        {[
          "REJECTED",
          "COMPLETED",
          "CANCELLED",
        ].includes(request.status) && (
          <div className="flex h-10 items-center gap-2 text-sm font-medium text-slate-400">
            <Package className="h-4 w-4" />
            No further action
          </div>
        )}
      </div>
    </article>
  );
}