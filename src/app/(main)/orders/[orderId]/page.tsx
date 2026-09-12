"use client";


import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Package,
} from "lucide-react";

import {
  useParams,
} from "next/navigation";

import {
  OrderService,
} from "@/services/order.service";

import type {
  IOrder,
} from "@/types/marketplace";

export default function OrderDetailsPage() {
  const params =
    useParams<{
      orderId: string;
    }>();

  const [
    order,
    setOrder,
  ] =
    useState<IOrder | null>(
      null
    );

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!params.orderId) {
      return;
    }

    OrderService.getMyOrderById(
      params.orderId
    )
      .then(setOrder)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load order."
        )
      );
  }, [
    params.orderId,
  ]);

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center text-slate-500">
          Loading order...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Order
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {
                order.orderNumber
              }
            </h1>
          </div>

          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm">
            <span className="font-semibold capitalize text-emerald-700">
              {order.status.replaceAll(
                "_",
                " "
              )}
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Items
            </h2>

            <div className="mt-5 space-y-4">
              {order.items.map(
                (item) => (
                  <div
                    key={
                      item.productId
                    }
                    className="flex gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                      {item.image ? (
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.title
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="m-5 h-6 w-6 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold">
                        {
                          item.title
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {
                          item.quantity
                        }{" "}
                        {
                          item.unit
                        }{" "}
                        × ৳
                        {Number(
                          item.price
                        ).toLocaleString(
                          "en-BD"
                        )}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ৳
                      {Number(
                        item.subtotal
                      ).toLocaleString(
                        "en-BD"
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Summary
            </h2>

            <Row
              label="Subtotal"
              value={
                order.subtotal
              }
            />

            <Row
              label="Delivery"
              value={
                order.deliveryFee
              }
            />

            <div className="my-4 border-t" />

            <Row
              label="Total"
              value={
                order.totalAmount
              }
              strong
            />

            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">
                Delivery Address
              </p>

              <p className="mt-2 text-slate-600">
                {
                  order
                    .shippingAddress
                    .fullName
                }
                <br />
                {
                  order
                    .shippingAddress
                    .phone
                }
                <br />
                {
                  order
                    .shippingAddress
                    .address
                }
                <br />
                {
                  order
                    .shippingAddress
                    .upazila
                }
                {order
                  .shippingAddress
                  .upazila
                  ? ", "
                  : ""}
                {
                  order
                    .shippingAddress
                    .district
                }
                ,{" "}
                {
                  order
                    .shippingAddress
                    .division
                }
              </p>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Payment:{" "}
              {order.paymentMethod.toUpperCase()}
              {" • "}
              {
                order.paymentStatus
              }
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      className={`mt-3 flex justify-between ${
        strong
          ? "text-lg font-bold"
          : "text-sm"
      }`}
    >
      <span>{label}</span>

      <span>
        ৳
        {Number(
          value
        ).toLocaleString(
          "en-BD"
        )}
      </span>
    </div>
  );
}