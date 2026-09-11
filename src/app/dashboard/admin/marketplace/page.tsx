"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  Loader2,
  Package,
  RefreshCw,
  Search,
  ShieldOff,
  Trash2,
  X,
} from "lucide-react";

import {
  marketplaceService,
} from "@/services/admin.marketplace.service";

import type {
  IProduct,
  ProductCategory,
  ProductStatus,
} from "@/types/marketplace";

const CATEGORY_OPTIONS: {
  value: ProductCategory;
  label: string;
}[] = [
  {
    value: "crops",
    label: "Crops",
  },
  {
    value: "seeds",
    label: "Seeds",
  },
  {
    value: "fertilizers",
    label: "Fertilizers",
  },
  {
    value: "pesticides",
    label: "Pesticides",
  },
  {
    value: "equipment",
    label: "Equipment",
  },
  {
    value: "poultry",
    label: "Poultry",
  },
  {
    value: "farm_foods",
    label: "Farm Food",
  },
  {
    value: "by_products",
    label: "By Products",
  },
  {
    value: "other",
    label: "Other",
  },
];

const STATUS_OPTIONS: {
  value: ProductStatus | "all";
  label: string;
}[] = [
  {
    value: "all",
    label: "All Status",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "available",
    label: "Available",
  },
  {
    value: "out_of_stock",
    label: "Out of Stock",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "disabled",
    label: "Disabled",
  },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

const categoryLabel = (
  category: ProductCategory
) =>
  CATEGORY_OPTIONS.find(
    (item) =>
      item.value === category
  )?.label || category;

function StatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const styles: Record<
    string,
    string
  > = {
    pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    available:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    out_of_stock:
      "bg-orange-50 text-orange-700 border-orange-200",
    rejected:
      "bg-rose-50 text-rose-700 border-rose-200",
    disabled:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ||
        "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )}
    </span>
  );
}

function getEffectiveStatus(product: IProduct): ProductStatus {
  if (
    !product.approvedAt &&
    (product.status === "available" ||
      product.status === "out_of_stock")
  ) {
    return "pending";
  }

  return product.status;
}

export default function AdminMarketplacePage() {
  const [products, setProducts] =
    useState<IProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [searchInput, setSearchInput] =
    useState("");

  const [status, setStatus] =
    useState<ProductStatus | "all">(
      "all"
    );

  const [category, setCategory] =
    useState<ProductCategory | "all">(
      "all"
    );

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [total, setTotal] =
    useState(0);

  const [selected, setSelected] =
    useState<IProduct | null>(null);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [rejectReason, setRejectReason] =
    useState("");

  const loadProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await marketplaceService.getAdminProducts(
            {
              page,
              limit: 10,
              status,
              category,
              search,
            }
          );

        setProducts(
          Array.isArray(result?.data)
            ? result.data
            : []
        );

        setTotal(
          result?.meta?.total || 0
        );

        setTotalPages(
          Math.max(
            result?.meta?.totalPages || 1,
            1
          )
        );
      } catch (err) {
        console.error(
          "Failed to load admin marketplace products:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load marketplace products."
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, [
      page,
      status,
      category,
      search,
    ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setPage(1);
    setSearch(
      searchInput.trim()
    );
  };

  const handleAction = async (
    action:
      | "approve"
      | "reject"
      | "disable"
      | "restore"
      | "remove",
    product: IProduct
  ) => {
    if (action === "reject") {
      if (!rejectReason.trim()) {
        setError(
          "Please provide a rejection reason."
        );
        return;
      }
    }

    if (action === "remove") {
      const confirmed =
        window.confirm(
          `Remove "${product.title}" from the marketplace?`
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setActionLoading(
        `${action}-${product._id}`
      );

      setError("");

      if (action === "approve") {
        await marketplaceService.approveProduct(
          product._id
        );
      }

      if (action === "reject") {
        await marketplaceService.rejectProduct(
          product._id,
          rejectReason.trim()
        );
      }

      if (action === "disable") {
        await marketplaceService.disableProduct(
          product._id
        );
      }

      if (action === "restore") {
        await marketplaceService.restoreProduct(
          product._id
        );
      }

      if (action === "remove") {
        await marketplaceService.removeProduct(
          product._id
        );
      }

      setSelected(null);
      setRejectReason("");

      await loadProducts();
    } catch (err) {
      console.error(
        `Marketplace ${action} failed:`,
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${action} product.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const openProduct = async (
    product: IProduct
  ) => {
    try {
      setSelected(product);

      const fresh =
        await marketplaceService.getAdminProductById(
          product._id
        );

      setSelected(fresh);
    } catch (err) {
      console.error(
        "Failed to load product details:",
        err
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                Marketplace Management
              </h1>

              <p className="text-sm text-slate-500">
                Review and manage farmer product listings.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_auto]">
          <form
            onSubmit={handleSearch}
            className="flex"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value
                  )
                }
                placeholder="Search product, seller or district..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              className="ml-2 h-11 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Search
            </button>
          </form>

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target
                  .value as ProductStatus | "all"
              );
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {STATUS_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <select
            value={category}
            onChange={(event) => {
              setCategory(
                event.target
                  .value as ProductCategory | "all"
              );
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">
              All Categories
            </option>

            {CATEGORY_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setStatus("all");
              setCategory("all");
              setPage(1);
            }}
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="flex-1">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="font-semibold hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">
            {total}
          </span>{" "}
          product
          {total === 1
            ? ""
            : "s"} found
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Seller
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Quantity
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center"
                  >
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading marketplace products...
                    </div>
                  </td>
                </tr>
              ) : products.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Package className="h-6 w-6" />
                      </div>

                      <p className="font-semibold text-slate-800">
                        No products found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing the filters or search term.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map(
                  (product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-slate-50/60"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex min-w-[250px] items-center gap-3">
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0]
                              }
                              alt={
                                product.title
                              }
                              className="h-12 w-12 rounded-xl border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {product.title}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                              {product.location ||
                                product.district ||
                                "Location not provided"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {product.sellerName ||
                            "Unknown seller"}
                        </p>

                        <p className="mt-0.5 max-w-[190px] truncate text-xs text-slate-500">
                          {product.sellerEmail ||
                            "No email"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {categoryLabel(
                            product.category
                          )}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-emerald-700">
                          {formatMoney(
                            Number(
                              product.price
                            )
                          )}
                        </p>

                        <p className="text-xs text-slate-400">
                          /{" "}
                          {product.unit ||
                            "unit"}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-700">
                          {product.quantity}{" "}
                          {product.unit}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            getEffectiveStatus(product)
                          }
                        />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            openProduct(
                              product
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading &&
          products.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
              <p className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-800">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={
                    page <= 1
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          current -
                            1,
                          1
                        )
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    page >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          current +
                            1,
                          totalPages
                        )
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>

      {/* Product Review */}
      {selected && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-950">
                Product Review
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {selected._id}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setRejectReason("");
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close review"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[320px_1fr]">
            {/* Image */}
            <div>
              {selected.images?.[0] ? (
                <img
                  src={
                    selected.images[0]
                  }
                  alt={
                    selected.title
                  }
                  className="h-72 w-full rounded-2xl border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Seller
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selected.sellerName ||
                    "Unknown seller"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selected.sellerEmail ||
                    "No email"}
                </p>

                {selected.sellerContact && (
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.sellerContact}
                  </p>
                )}
              </div>
            </div>

            {/* Details */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {categoryLabel(
                        selected.category
                      )}
                    </span>

                    <StatusBadge
                      status={
                        getEffectiveStatus(selected)
                      }
                    />
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-slate-950">
                    {selected.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {selected.description ||
                  "No description provided."}
              </p>

              {/* Product info */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Price
                  </p>

                  <p className="mt-1 font-bold text-emerald-700">
                    {formatMoney(
                      Number(
                        selected.price
                      )
                    )}
                  </p>

                  <p className="text-xs text-slate-400">
                    / {selected.unit}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Available Quantity
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {selected.quantity}{" "}
                    {selected.unit}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">
                    Production
                  </p>

                  <p className="mt-1 font-bold capitalize text-slate-900">
                    {selected.productionMethod}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                  {[
                    selected.location,
                    selected.upazila,
                    selected.district,
                    selected.division,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    "Location not provided"}
                </p>
              </div>

              {/* Rejection reason */}
              {selected.rejectionReason && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                    Rejection Reason
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    {
                      selected.rejectionReason
                    }
                  </p>
                </div>
              )}

              {/* Reject input */}
              {getEffectiveStatus(selected) ===
                "pending" && (
                <div className="mt-5">
                  <label className="text-sm font-semibold text-slate-800">
                    Rejection reason
                  </label>

                  <textarea
                    value={
                      rejectReason
                    }
                    onChange={(event) =>
                      setRejectReason(
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Explain why this product is being rejected..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                {getEffectiveStatus(selected) ===
                  "pending" && (
                  <>
                    <button
                      type="button"
                      disabled={
                        !!actionLoading
                      }
                      onClick={() =>
                        handleAction(
                          "approve",
                          selected
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                    >
                      {actionLoading ===
                      `approve-${selected._id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={
                        !!actionLoading
                      }
                      onClick={() =>
                        handleAction(
                          "reject",
                          selected
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ===
                      `reject-${selected._id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </button>
                  </>
                )}

                {(getEffectiveStatus(selected) ===
                  "available" ||
                  getEffectiveStatus(selected) ===
                    "out_of_stock") && (
                  <button
                    type="button"
                    disabled={
                      !!actionLoading
                    }
                    onClick={() =>
                      handleAction(
                        "disable",
                        selected
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {actionLoading ===
                    `disable-${selected._id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldOff className="h-4 w-4" />
                    )}
                    Disable
                  </button>
                )}

                {(getEffectiveStatus(selected) ===
                  "disabled" ||
                  getEffectiveStatus(selected) ===
                    "rejected") && (
                  <button
                    type="button"
                    disabled={
                      !!actionLoading
                    }
                    onClick={() =>
                      handleAction(
                        "restore",
                        selected
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                  >
                    {actionLoading ===
                    `restore-${selected._id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Restore
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    !!actionLoading
                  }
                  onClick={() =>
                    handleAction(
                      "remove",
                      selected
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {actionLoading ===
                  `remove-${selected._id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}