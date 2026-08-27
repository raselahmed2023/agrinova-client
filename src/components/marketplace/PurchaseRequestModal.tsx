"use client";

import {
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { createPurchaseRequest } from "@/services/marketplace.service";

import type { MarketplaceProduct } from "@/types/marketplace";

interface PurchaseRequestModalProps {
  product: MarketplaceProduct;
  open: boolean;
  onClose: () => void;
}

export default function PurchaseRequestModal({
  product,
  open,
  onClose,
}: PurchaseRequestModalProps) {
  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const [quantity, setQuantity] =
    useState(1);

  const [
    deliveryLocation,
    setDeliveryLocation,
  ] = useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!session?.user?.email) {
        throw new Error(
          "Please login to send a purchase request."
        );
      }

      if (quantity < 1) {
        throw new Error(
          "Quantity must be at least 1."
        );
      }

      if (
        quantity >
        product.quantity
      ) {
        throw new Error(
          `Only ${product.quantity} ${product.unit} available.`
        );
      }

      if (
        !deliveryLocation.trim()
      ) {
        throw new Error(
          "Delivery location is required."
        );
      }

      await createPurchaseRequest(
        {
          productId:
            product._id,

          quantity,

          deliveryLocation:
            deliveryLocation.trim(),

          note:
            note.trim() ||
            undefined,
        },
        {
          id:
            session.user.id,

          name:
            session.user.name ||
            "Farmer",

          email:
            session.user.email,
        }
      );

      setSuccess(
        "Purchase request sent successfully."
      );

      setTimeout(() => {
        setQuantity(1);

        setDeliveryLocation("");

        setNote("");

        setSuccess("");

        onClose();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send request."
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting =
    loading || sessionLoading;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Send Purchase Request
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {product.title}
            </p>
          </div>

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {session?.user && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3">
              <p className="text-xs text-emerald-700">
                Requesting as
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                {session.user.name ||
                  "Farmer"}
              </p>

              <p className="text-xs text-slate-500">
                {
                  session.user
                    .email
                }
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Quantity
            </label>

            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                  )
                }
                className="h-12 w-12 bg-slate-50 text-xl font-semibold text-slate-600"
              >
                −
              </button>

              <input
                type="number"
                min={1}
                max={
                  product.quantity
                }
                value={quantity}
                onChange={(
                  event
                ) =>
                  setQuantity(
                    Math.max(
                      1,
                      Number(
                        event
                          .target
                          .value
                      ) || 1
                    )
                  )
                }
                className="h-12 min-w-0 flex-1 border-x border-slate-200 text-center font-semibold outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (value) =>
                      Math.min(
                        product.quantity,
                        value + 1
                      )
                  )
                }
                className="h-12 w-12 bg-slate-50 text-xl font-semibold text-slate-600"
              >
                +
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              Maximum available:{" "}
              {product.quantity}{" "}
              {product.unit}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Delivery Location
            </label>

            <input
              value={
                deliveryLocation
              }
              onChange={(
                event
              ) =>
                setDeliveryLocation(
                  event.target
                    .value
                )
              }
              placeholder="e.g. Kushtia, Bangladesh"
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Note{" "}
              <span className="font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <textarea
              rows={4}
              value={note}
              onChange={(
                event
              ) =>
                setNote(
                  event.target
                    .value
                )
              }
              placeholder="Additional information for the seller..."
              className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Price
              </span>

              <span className="font-medium text-slate-700">
                ৳
                {product.price.toLocaleString()}{" "}
                × {quantity}
              </span>
            </div>

            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-700">
                Estimated Total
              </span>

              <span className="text-lg font-bold text-emerald-600">
                ৳
                {(
                  product.price *
                  quantity
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 p-6">
          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={onClose}
            className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={
              handleSubmit
            }
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {sessionLoading
              ? "Loading..."
              : loading
                ? "Sending..."
                : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}