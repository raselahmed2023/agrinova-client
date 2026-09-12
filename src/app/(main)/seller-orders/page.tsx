"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Package, RefreshCw, Truck } from "lucide-react";

import { OrderService } from "@/services/order.service";
import type { IOrder, IOrderFulfillment } from "@/types/marketplace";

const nextStatus: Record<
  string,
  "confirmed" | "processing" | "ready_for_pickup" | null
> = {
  pending: "confirmed",
  confirmed: "processing",
  processing: "ready_for_pickup",
};

const pretty = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await OrderService.getSellerOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load seller orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const advance = async (
    orderId: string,
    status: "confirmed" | "processing" | "ready_for_pickup"
  ) => {
    try {
      setActionId(orderId);
      setError("");
      setNotice("");

      const updated = await OrderService.updateSellerFulfillment(orderId, status);
      setOrders((current) => current.map((order) => (order._id === orderId ? updated : order)));

      if (status === "ready_for_pickup") {
        setNotice(
          "Pickup request sent. AgriNova admin has been notified and can now assign a collection agent."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update order.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Marketplace Seller
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Sell Orders
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Only orders containing your own products are shown here. Prepare each order, mark it ready for pickup, and AgriNova admin will coordinate collection and delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {notice && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-7 flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />
          </div>
        ) : !orders.length ? (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-300" />
            <h2 className="mt-4 font-extrabold text-slate-900">No sell orders yet</h2>
            <p className="mt-2 text-sm text-slate-500">Orders for your marketplace listings will appear here.</p>
          </div>
        ) : (
          <div className="mt-7 space-y-5">
            {orders.map((order) => {
              const fulfillment = order.fulfillments[0];
              if (!fulfillment) return null;

              return (
                <SellerOrderCard
                  key={order._id}
                  order={order}
                  fulfillment={fulfillment}
                  busy={actionId === order._id}
                  onAdvance={(status) => advance(order._id, status)}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function SellerOrderCard({
  order,
  fulfillment,
  busy,
  onAdvance,
}: {
  order: IOrder;
  fulfillment: IOrderFulfillment;
  busy: boolean;
  onAdvance: (status: "confirmed" | "processing" | "ready_for_pickup") => void;
}) {
  const next = nextStatus[fulfillment.status] || null;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {order.orderNumber}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {pretty(fulfillment.status)}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">Buyer: {order.customerName}</p>
          <p className="mt-1 text-xs text-slate-500">Delivery district: {order.shippingAddress.district}</p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Your payout</p>
          <p className="mt-1 text-xl font-extrabold text-emerald-700">{money(fulfillment.sellerPayout)}</p>
          <p className="mt-1 text-xs text-slate-400">After {fulfillment.commissionRate}% marketplace commission</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {fulfillment.items.map((item) => (
            <div key={item.productId} className="rounded-xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">{item.title}</p>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                <span>{item.quantity} {item.unit}</span>
                <span className="font-bold text-slate-800">{money(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {fulfillment.deliveryPartner?.name && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <strong>AgriNova collection agent:</strong> {fulfillment.deliveryPartner.name}
            {fulfillment.deliveryPartner.phone ? ` · ${fulfillment.deliveryPartner.phone}` : ""}
          </div>
        )}

        {next && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAdvance(next)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            <Truck className="h-4 w-4" />
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Updating order" />
            ) : next === "ready_for_pickup" ? (
              "Ready for pickup — notify AgriNova"
            ) : (
              `Mark ${pretty(next)}`
            )}
          </button>
        )}

        {fulfillment.status === "ready_for_pickup" && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            AgriNova has been notified. Keep the items ready at your pickup location while admin assigns a collection agent.
          </div>
        )}

        {fulfillment.status === "delivered" && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Fulfillment completed
          </div>
        )}
      </div>
    </article>
  );
}