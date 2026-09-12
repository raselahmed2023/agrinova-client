"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  X,
} from "lucide-react";

import { marketplaceService } from "@/services/admin.marketplace.service";
import type {
  IOrder,
  IOrderFulfillment,
  IProduct,
  ProductCategory,
  ProductStatus,
} from "@/types/marketplace";

const categories: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "crops", label: "Crops" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "pesticides", label: "Pesticides" },
  { value: "equipment", label: "Equipment" },
  { value: "poultry", label: "Poultry" },
  { value: "farm_foods", label: "Farm food" },
  { value: "by_products", label: "By-products" },
  { value: "other", label: "Other" },
];

const statuses: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Live" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "disabled", label: "Hidden" },
  { value: "pending", label: "Legacy pending" },
];

const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-BD")}`;
const pretty = (value?: string) =>
  value ? value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

function Spinner() {
  return (
    <div className="flex min-h-64 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />
    </div>
  );
}

function StatusPill({ status }: { status: ProductStatus }) {
  const cls =
    status === "available"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "out_of_stock"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "disabled"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${cls}`}>
      {status === "available" ? "Live" : pretty(status)}
    </span>
  );
}

export default function AdminMarketplacePage() {
  const [tab, setTab] = useState<"products" | "fulfillment">("products");

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("tab");
    if (wanted === "fulfillment") setTab("fulfillment");
  }, []);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Marketplace Operations
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Marketplace Control Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Farmer listings publish instantly. Admin moderation is exception-based: hide or remove rule-violating listings, notify farmers, and coordinate pickup and delivery.
            </p>
          </div>

          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setTab("products")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "products" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
              }`}
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => setTab("fulfillment")}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                tab === "fulfillment" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
              }`}
            >
              Pickup & Delivery
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {tab === "products" ? <ProductsTab /> : <FulfillmentTab />}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({ live: 0, outOfStock: 0, hidden: 0 });
  const [selected, setSelected] = useState<IProduct | null>(null);
  const [reason, setReason] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await marketplaceService.getAdminProducts({
        page,
        limit: 12,
        search,
        status,
        category,
      });
      setProducts(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setCounts(result.meta.counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load marketplace products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, category]);

  useEffect(() => {
    load();
  }, [load]);

  const open = async (product: IProduct) => {
    setSelected(product);
    setReason(product.moderationReason || "");
    try {
      setSelected(await marketplaceService.getAdminProductById(product._id));
    } catch {
      // Keep table data in modal if refresh fails.
    }
  };

  const act = async (action: "hide" | "restore" | "remove") => {
    if (!selected) return;
    if ((action === "hide" || action === "remove") && !reason.trim()) {
      setError("Please write a clear reason so the farmer receives a useful notice.");
      return;
    }
    if (action === "remove" && !window.confirm(`Remove “${selected.title}” from AgriNova?`)) return;

    try {
      setActing(true);
      setError("");
      if (action === "hide") {
        await marketplaceService.moderateProduct(selected._id, reason.trim());
      } else if (action === "restore") {
        await marketplaceService.restoreProduct(selected._id);
      } else {
        await marketplaceService.removeProduct(selected._id, reason.trim());
      }
      setSelected(null);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Marketplace moderation failed.");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Live listings" value={counts.live} tone="emerald" />
        <Metric label="Out of stock" value={counts.outOfStock} tone="amber" />
        <Metric label="Hidden by moderation" value={counts.hidden} tone="red" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(searchInput.trim());
          }}
          className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search product, seller, email or district"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ProductStatus | "all");
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ProductCategory | "all");
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <button className="h-11 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800">
            Search
          </button>
        </form>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">No products match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Seller</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{product.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{pretty(product.category)} · {money(product.price)}/{product.unit}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{product.sellerName || "Farmer"}</p>
                      <p className="mt-1 text-xs text-slate-400">{product.sellerEmail || "—"}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{product.quantity} {product.unit}</td>
                    <td className="px-5 py-4"><StatusPill status={product.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => open(product)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                      >
                        <Eye className="h-4 w-4" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm">
          <span className="text-slate-500">{total.toLocaleString("en-BD")} listings</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((v) => v - 1)} className="rounded-lg border p-2 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <span className="font-semibold text-slate-700">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((v) => v + 1)} className="rounded-lg border p-2 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status={selected.status} />
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{pretty(selected.category)}</span>
                </div>
                <h2 className="mt-3 text-2xl font-extrabold text-slate-950">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-500">Seller: {selected.sellerName || "Farmer"} · {selected.sellerEmail || "No email"}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-xl border p-2 text-slate-500"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Info label="Price" value={`${money(selected.price)} / ${selected.unit}`} />
              <Info label="Remaining stock" value={`${selected.quantity} ${selected.unit}`} />
              <Info label="Location" value={[selected.upazila, selected.district, selected.division].filter(Boolean).join(", ") || "Not provided"} />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {selected.description}
            </div>

            {selected.moderationReason && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <strong>Previous moderation notice:</strong> {selected.moderationReason}
              </div>
            )}

            {selected.status !== "disabled" && (
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-800">Reason for moderation/removal</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Explain the specific rule or marketplace policy issue. This message is sent to the farmer."
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {selected.status === "disabled" ? (
                <button disabled={acting} onClick={() => act("restore")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  <RefreshCw className="h-4 w-4" /> Restore listing
                </button>
              ) : (
                <button disabled={acting} onClick={() => act("hide")} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  <Ban className="h-4 w-4" /> Hide & notify farmer
                </button>
              )}
              <button disabled={acting} onClick={() => act("remove")} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 disabled:opacity-50">
                <Trash2 className="h-4 w-4" /> Remove & notify farmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FulfillmentTab() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<string | null>(null);
  const [agents, setAgents] = useState<Record<string, { name: string; phone: string }>>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(await marketplaceService.getAdminOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load marketplace fulfillment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const activeStatuses = new Set([
      "ready_for_pickup",
      "picked_up",
      "out_for_delivery",
    ]);

    return orders
      .filter((order) => order.paymentMethod === "cod" || order.paymentStatus === "paid")
      .flatMap((order) =>
        order.fulfillments
          .filter((fulfillment) => activeStatuses.has(fulfillment.status))
          .map((fulfillment) => ({ order, fulfillment }))
      )
      .sort((a, b) => {
      const priority = (status: string) =>
        status === "ready_for_pickup" ? 0 : status === "picked_up" ? 1 : status === "out_for_delivery" ? 2 : 3;
      return priority(a.fulfillment.status) - priority(b.fulfillment.status);
    });
  }, [orders]);

  const advance = async (order: IOrder, fulfillment: IOrderFulfillment) => {
    const next =
      fulfillment.status === "ready_for_pickup"
        ? "picked_up"
        : fulfillment.status === "picked_up"
          ? "out_for_delivery"
          : fulfillment.status === "out_for_delivery"
            ? "delivered"
            : null;
    if (!next) return;

    const key = `${order._id}:${fulfillment.sellerId}`;
    const agent = agents[key] || { name: "", phone: "" };
    if (next === "picked_up" && !agent.name.trim()) {
      setError("Enter the assigned collection agent name before marking items picked up.");
      return;
    }

    try {
      setActing(key);
      setError("");
      const updated = await marketplaceService.updateAdminFulfillment(
        order._id,
        fulfillment.sellerId,
        next,
        next === "picked_up" ? { name: agent.name.trim(), phone: agent.phone.trim() } : fulfillment.deliveryPartner
      );
      setOrders((current) => current.map((item) => item._id === updated._id ? updated : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update fulfillment.");
    } finally {
      setActing(null);
    }
  };

  if (loading) return <div className="rounded-2xl border bg-white"><Spinner /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-950">Pickup & Delivery Queue</h2>
          <p className="mt-1 text-sm text-slate-500">Farmers notify admin when items are ready. Assign a collection agent, then move each seller fulfillment through pickup, delivery and completion.</p>
        </div>
        <button onClick={load} className="rounded-xl border p-2.5 text-slate-600 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /></button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {!rows.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No marketplace fulfillment activity yet.</div>
      ) : (
        <div className="space-y-4">
          {rows.map(({ order, fulfillment }) => {
            const key = `${order._id}:${fulfillment.sellerId}`;
            const next = fulfillment.status === "ready_for_pickup" ? "picked_up" : fulfillment.status === "picked_up" ? "out_for_delivery" : fulfillment.status === "out_for_delivery" ? "delivered" : null;
            const agent = agents[key] || { name: fulfillment.deliveryPartner?.name || "", phone: fulfillment.deliveryPartner?.phone || "" };

            return (
              <article key={key} className={`rounded-2xl border bg-white p-5 shadow-sm ${fulfillment.status === "ready_for_pickup" ? "border-emerald-300 ring-2 ring-emerald-50" : "border-slate-200"}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{order.orderNumber}</span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{pretty(fulfillment.status)}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold text-slate-900">{fulfillment.sellerName}</h3>
                    <p className="mt-1 text-sm text-slate-500">Pickup: {fulfillment.pickupAddress || "Seller location not provided"}</p>
                    <p className="mt-1 text-sm text-slate-500">Buyer: {order.customerName} · {order.shippingAddress.district}</p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Seller payout</p>
                    <p className="mt-1 text-xl font-extrabold text-emerald-700">{money(fulfillment.sellerPayout)}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {fulfillment.items.map((item) => (
                    <div key={item.productId} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                      <p className="font-bold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-slate-500">{item.quantity} {item.unit} · {money(item.subtotal)}</p>
                    </div>
                  ))}
                </div>

                {fulfillment.status === "ready_for_pickup" && (
                  <div className="mt-5 grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 sm:grid-cols-2">
                    <input
                      value={agent.name}
                      onChange={(e) => setAgents((v) => ({ ...v, [key]: { ...agent, name: e.target.value } }))}
                      placeholder="Collection agent name *"
                      className="h-11 rounded-xl border border-emerald-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                    />
                    <input
                      value={agent.phone}
                      onChange={(e) => setAgents((v) => ({ ...v, [key]: { ...agent, phone: e.target.value } }))}
                      placeholder="Agent phone"
                      className="h-11 rounded-xl border border-emerald-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {next && (
                  <button
                    type="button"
                    disabled={acting === key}
                    onClick={() => advance(order, fulfillment)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    <Truck className="h-4 w-4" />
                    {acting === key ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Updating fulfillment" /> : next === "picked_up" ? "Assign agent & mark picked up" : `Mark ${pretty(next)}`}
                  </button>
                )}

                {fulfillment.status === "delivered" && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Delivery complete
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: "emerald" | "amber" | "red" }) {
  const cls = tone === "emerald" ? "bg-emerald-50 text-emerald-700" : tone === "amber" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";
  const Icon = tone === "emerald" ? ShieldCheck : tone === "amber" ? AlertTriangle : Ban;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cls}`}><Icon className="h-5 w-5" /></div>
      <p className="mt-4 text-2xl font-extrabold text-slate-950">{value.toLocaleString("en-BD")}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}
