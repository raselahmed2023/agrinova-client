"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldOff,
  Trash2,
} from "lucide-react";

import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";
import { useSession } from "@/lib/auth-client";
import { MarketplaceService } from "@/services/marketplace.service";
import type {
  IProduct,
  ProductStatus,
} from "@/types/marketplace";

const PAGE_SIZE = 12;

type ListingFilter = ProductStatus | "all";

type StatusView = {
  label: string;
  badge: string;
  icon: typeof Clock3;
  help: string;
};

const STATUS_CONFIG: Record<ProductStatus, StatusView> = {
  pending: {
    label: "Legacy listing",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
    help: "Legacy status. Edit and save to publish under the new instant-listing flow.",
  },
  available: {
    label: "Live",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    help: "Visible in the public marketplace.",
  },
  out_of_stock: {
    label: "Out of stock",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    icon: AlertCircle,
    help: "Currently unavailable because stock is zero.",
  },
  disabled: {
    label: "Disabled",
    badge: "border-slate-300 bg-slate-100 text-slate-700",
    icon: ShieldOff,
    help: "Disabled by an admin.",
  },
};

const FILTERS: { value: ListingFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "available", label: "Live" },
  { value: "out_of_stock", label: "Out of stock" },
  { value: "disabled", label: "Disabled" },
];

function formatMoney(product: IProduct) {
  if (product.transactionType === "free") return "Free";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(product.price || 0));
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const getEffectiveStatus = (product: IProduct): ProductStatus => {
  return product.status;
};

export default function MyListingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<ListingFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusCounts, setStatusCounts] = useState<
    Partial<Record<ListingFilter, number>>
  >({});

  const loadCounts = useCallback(async () => {
    try {
      const statuses: ProductStatus[] = [
        "pending",
        "available",
        "out_of_stock",
        "disabled",
      ];

      const [allResult, ...statusResults] = await Promise.all([
        MarketplaceService.getMyProductsPage({ page: 1, limit: 1 }),
        ...statuses.map((item) =>
          MarketplaceService.getMyProductsPage({
            page: 1,
            limit: 1,
            status: item,
          })
        ),
      ]);

      const next: Partial<Record<ListingFilter, number>> = {
        all: allResult.meta.total,
      };

      statuses.forEach((item, index) => {
        next[item] = statusResults[index].meta.total;
      });

      setStatusCounts(next);
    } catch (countError) {
      console.warn("Unable to load listing counts:", countError);
    }
  }, []);

  const loadListings = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await MarketplaceService.getMyProductsPage({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status === "all" ? undefined : status,
        sort: "newest",
      });

      setProducts(result.data);
      setTotal(result.meta.total);
      setTotalPages(Math.max(result.meta.totalPages, 1));
    } catch (err) {
      console.error("Failed to load my listings:", err);
      setProducts([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, session?.user, status]);

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      loadListings();
    }
  }, [sessionLoading, session?.user, loadListings]);

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      loadCounts();
    }
  }, [sessionLoading, session?.user, loadCounts]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleRange = useMemo(() => {
    if (total === 0) return "0 listings";

    const from = (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, total);
    return `${from}–${to} of ${total}`;
  }, [page, total]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDelete = async (product: IProduct) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"? This permanently removes it from your active marketplace listings.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");
      await MarketplaceService.deleteProduct(product._id);
      await Promise.all([loadListings(), loadCounts()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (sessionLoading) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-16 rounded-2xl bg-white" />
          <div className="h-24 rounded-2xl bg-white" />
          <div className="h-80 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-950">
            Login required
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage the products you have published in the marketplace.
          </p>
          <Link
            href="/login?redirect=/marketplace/listings"
            className="mt-6 inline-flex rounded-xl bg-[#0B513D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#083f30]"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <MarketplaceBackground>
      <main className="min-h-screen bg-[#f4f7f2]/95">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/marketplace"
                className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0B513D]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to marketplace
              </Link>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDEBDD] text-[#0B513D]">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    My marketplace listings
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Publish products instantly, manage stock, edit listings, and review any moderation notices from one place.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => Promise.all([loadListings(), loadCounts()])}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Link
                href="/marketplace/sell"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083f30]"
              >
                <Plus className="h-4 w-4" />
                Add product
              </Link>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {FILTERS.map((item) => {
              const active = status === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setStatus(item.value);
                    setPage(1);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[#0B513D] bg-[#0B513D] text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-800 hover:border-emerald-200 hover:bg-emerald-50/40"
                  }`}
                >
                  <p className={`text-xs font-semibold ${active ? "text-emerald-100" : "text-slate-500"}`}>
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {statusCounts[item.value] ?? "—"}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <form onSubmit={handleSearch} className="flex w-full max-w-xl gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search title, description or location..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Search
                </button>
              </form>

              <div className="flex items-center justify-between gap-3 text-sm text-slate-500 lg:justify-end">
                <span>{visibleRange}</span>
                {(search || status !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                      setStatus("all");
                      setPage(1);
                    }}
                    className="font-semibold text-[#0B513D] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Marketplace request failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="space-y-3 p-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Package className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-950">
                  No listings found
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {search || status !== "all"
                    ? "Try clearing the current search or status filter."
                    : "Create your first marketplace listing and it will appear publicly as soon as it is published."}
                </p>
                {!search && status === "all" && (
                  <Link
                    href="/marketplace/sell"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B513D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083f30]"
                  >
                    <Plus className="h-4 w-4" />
                    List a product
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map((product) => {
                  const effectiveStatus = getEffectiveStatus(product);
                  const view = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.pending;
                  const StatusIcon = view.icon;
                  const canViewPublic =
                    product.status === "available" || product.status === "out_of_stock";

                  return (
                    <article
                      key={product._id}
                      className="p-4 transition hover:bg-slate-50/60 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 flex-1 gap-4">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-32">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-300">
                                <Package className="h-8 w-8" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 py-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${view.badge}`}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {view.label}
                              </span>
                              <span className="text-xs font-medium capitalize text-slate-400">
                                {String(product.category).replaceAll("_", " ")}
                              </span>
                            </div>

                            <h2 className="mt-2 truncate text-lg font-bold text-slate-950">
                              {product.title}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              {view.help}
                            </p>

                            {(product.moderationReason || product.rejectionReason) && (
                              <div className="mt-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                <span className="font-bold">Admin feedback:</span>{" "}
                                {product.moderationReason || product.rejectionReason}
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
                              <span className="font-semibold text-slate-800">
                                {formatMoney(product)} / {product.unit}
                              </span>
                              <span>
                                Stock: <strong className="text-slate-700">{product.quantity} {product.unit}</strong>
                              </span>
                              {(product.district || product.location) && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {product.district || product.location}
                                </span>
                              )}
                              <span>Updated {formatDate(product.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2 lg:w-[270px] lg:justify-end">
                          {canViewPublic && (
                            <Link
                              href={`/marketplace/${product._id}`}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          )}

                          <Link
                            href={`/marketplace/${product._id}?edit=1`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0B513D] px-4 text-sm font-semibold text-white transition hover:bg-[#083f30]"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                            aria-label={`Delete ${product.title}`}
                          >
                            {deletingId === product._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {!loading && totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page <= 1}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <p className="text-sm font-medium text-slate-500">
                Page <strong className="text-slate-900">{page}</strong> of{" "}
                <strong className="text-slate-900">{totalPages}</strong>
              </p>

              <button
                type="button"
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                disabled={page >= totalPages}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </MarketplaceBackground>
  );
}