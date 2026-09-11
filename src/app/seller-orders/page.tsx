"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";

import {
  OrderService,
} from "@/services/order.service";

import type {
  IOrder,
  IOrderFulfillment,
} from "@/types/marketplace";

const nextStatus: Record<
  string,
  | "confirmed"
  | "processing"
  | "ready_for_pickup"
  | null
> = {
  pending: "confirmed",

  confirmed: "processing",

  processing:
    "ready_for_pickup",
};

export default function SellerOrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<IOrder[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionId,
    setActionId,
  ] = useState<string | null>(
    null
  );

  const [error, setError] =
    useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      setOrders(
        await OrderService.getSellerOrders()
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load seller orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance =
    async (
      orderId: string,
      status:
        | "confirmed"
        | "processing"
        | "ready_for_pickup"
    ) => {
      try {
        setActionId(orderId);

        const updated =
          await OrderService.updateSellerFulfillment(
            orderId,
            status
          );

        setOrders(
          (current) =>
            current.map(
              (order) =>
                order._id ===
                orderId
                  ? updated
                  : order
            )
        );
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Unable to update order."
        );
      } finally {
        setActionId(null);
      }
    };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Seller Area
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Seller Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Orders placed for your
              products.
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
            Loading seller orders...
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
                No seller orders yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                When another farmer
                buys your product,
                the order will appear
                here.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <div className="mt-7 space-y-5">
              {orders.map(
                (order) => (
                  <article
                    key={
                      order._id
                    }
                    className="rounded-2xl border bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Customer Order
                        </p>

                        <h2 className="mt-1 text-lg font-bold">
                          {
                            order.orderNumber
                          }
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            order.customerName
                          }{" "}
                          •{" "}
                          {
                            order.customerEmail
                          }
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700">
                        {order.status.replaceAll(
                          "_",
                          " "
                        )}
                      </span>
                    </div>

                    <div className="mt-5 space-y-4">
                      {order.fulfillments.map(
                        (
                          fulfillment: IOrderFulfillment
                        ) => (
                          <div
                            key={
                              fulfillment.sellerId
                            }
                            className="rounded-xl bg-slate-50 p-4"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row">
                              <div>
                                <p className="font-semibold">
                                  Your Fulfillment
                                </p>

                                <p className="mt-1 text-sm capitalize text-slate-500">
                                  Status:{" "}
                                  {fulfillment.status.replaceAll(
                                    "_",
                                    " "
                                  )}
                                </p>
                              </div>

                              <p className="font-bold text-emerald-700">
                                ৳
                                {Number(
                                  fulfillment.subtotal
                                ).toLocaleString(
                                  "en-BD"
                                )}
                              </p>
                            </div>

                            <div className="mt-4 space-y-2">
                              {fulfillment.items.map(
                                (
                                  item
                                ) => (
                                  <div
                                    key={
                                      item.productId
                                    }
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {
                                        item.title
                                      }{" "}
                                      ×{" "}
                                      {
                                        item.quantity
                                      }
                                    </span>

                                    <span className="font-semibold">
                                      ৳
                                      {Number(
                                        item.subtotal
                                      ).toLocaleString(
                                        "en-BD"
                                      )}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>

                            {nextStatus[
                              fulfillment
                                .status
                            ] && (
                              <button
                                type="button"
                                disabled={
                                  actionId ===
                                  order._id
                                }
                                onClick={() =>
                                  advance(
                                    order._id,
                                    nextStatus[
                                      fulfillment
                                        .status
                                    ]!
                                  )
                                }
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                              >
                                <Truck className="h-4 w-4" />

                                {actionId ===
                                order._id
                                  ? "Updating..."
                                  : `Mark ${nextStatus[
                                      fulfillment
                                        .status
                                    ]!.replaceAll(
                                      "_",
                                      " "
                                    )}`}
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}