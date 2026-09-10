"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  Package,
  RefreshCw,
} from "lucide-react";

import {
  OrderService,
} from "@/services/order.service";

import type {
  IOrder,
} from "@/types/marketplace";

const statusClass =
  (status: string) => {
    if (
      status ===
      "delivered"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      status ===
      "cancelled"
    ) {
      return "bg-red-50 text-red-700";
    }

    if (
      status ===
      "pending"
    ) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-blue-50 text-blue-700";
  };

export default function OrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<IOrder[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      setOrders(
        await OrderService.getMyOrders()
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Orders you placed as a
              farmer-buyer.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            className="rounded-xl border bg-white p-3 text-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {loading && (
          <div className="mt-7 rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
            Loading orders...
          </div>
        )}

        {!loading &&
          error && (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          )}

        {!loading &&
          !error &&
          !orders.length && (
            <div className="mt-7 rounded-2xl border border-dashed bg-white p-14 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 font-bold">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your marketplace purchases
                will appear here.
              </p>

              <Link
                href="/marketplace"
                className="mt-5 inline-block rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Browse Marketplace
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="mt-7 space-y-4">
              {orders.map(
                (order) => (
                  <Link
                    key={
                      order._id
                    }
                    href={`/orders/${order._id}`}
                    className="block rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Order
                        </p>

                        <h2 className="mt-1 font-bold text-slate-900">
                          {
                            order.orderNumber
                          }
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            order.items
                              .length
                          }{" "}
                          item
                          {order
                            .items
                            .length !==
                          1
                            ? "s"
                            : ""}

                          {" • "}

                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString(
                                "en-BD"
                              )
                            : "Date unavailable"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            ৳
                            {Number(
                              order.totalAmount
                            ).toLocaleString(
                              "en-BD"
                            )}
                          </p>

                          <p className="text-xs text-slate-500">
                            {order.paymentMethod.toUpperCase()}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                            order.status
                          )}`}
                        >
                          {order.status.replaceAll(
                            "_",
                            " "
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}