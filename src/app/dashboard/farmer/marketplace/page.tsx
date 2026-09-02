"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  Store,
} from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  images?: string[];
  sellerName?: string;
  sellerEmail?: string;
  sellerContact?: string;
  location?: string;
  status?: string;
  isFeatured?: boolean;
  createdAt?: string;
}

interface ProductResponse {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Product[];
}

const categories = [
  "all",
  "crops",
  "seeds",
  "fertilizers",
  "equipment",
];

const getCategoryLabel = (category: string) => {
  if (category === "all") return "All Products";

  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function FarmerMarketplacePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", "8");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "all") {
          params.set("category", category);
        }

        if (sort) {
          params.set("sort", sort);
        }

        const response = await fetch(
          `${API_URL}/marketplace/products?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result: ProductResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch marketplace products."
          );
        }

        setProducts(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
        setTotalProducts(result.meta?.total || 0);
      } catch (err) {
        setProducts([]);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeout);
  }, [API_URL, page, search, category, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, category, sort]);

  const availableProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.status !== "unavailable"
      ),
    [products]
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Farmer Marketplace
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Browse Marketplace
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover crops, seeds, fertilizers,
              farming equipment and other agricultural
              products from farmers and local sellers.
            </p>
          </div>

          <Link
            href="/dashboard/farmer/marketplace/sell"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Store className="h-4 w-4" />
            Sell Product
          </Link>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {getCategoryLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 focus:bg-white"
            >
              <option value="newest">
                Newest First
              </option>
              <option value="price_asc">
                Price: Low to High
              </option>
              <option value="price_desc">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">
              {totalProducts}
            </span>{" "}
            products available
          </p>

          {category !== "all" && (
            <button
              type="button"
              onClick={() => setCategory("all")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear category
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-48 animate-pulse bg-slate-100" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="font-semibold text-red-700">
              Could not load marketplace products
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          availableProducts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-lg font-bold text-slate-800">
                No products found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or category.
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          availableProducts.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {availableProducts.map(
                (product) => {
                  const image =
                    product.images?.[0];

                  return (
                    <article
                      key={product._id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        {image ? (
                          <Image
                            src={image}
                            alt={product.title}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                              <Package className="mx-auto h-10 w-10 text-slate-300" />

                              <p className="mt-2 text-xs font-medium text-slate-400">
                                No product image
                              </p>
                            </div>
                          </div>
                        )}

                        {product.isFeatured && (
                          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            Featured
                          </span>
                        )}

                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm">
                          {getCategoryLabel(
                            product.category
                          )}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                            {product.title}
                          </h2>

                          <div className="shrink-0 text-right">
                            <p className="text-lg font-extrabold text-emerald-600">
                              ৳
                              {product.price.toLocaleString()}
                            </p>

                            <p className="text-xs text-slate-400">
                              per {product.unit}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                          {product.description}
                        </p>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="text-slate-500">
                              Available
                            </span>

                            <span className="font-semibold text-slate-800">
                              {product.quantity}{" "}
                              {product.unit}
                            </span>
                          </div>

                          {product.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4 shrink-0 text-emerald-500" />

                              <span className="truncate">
                                {product.location}
                              </span>
                            </div>
                          )}

                          {product.sellerName && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Store className="h-4 w-4 shrink-0 text-emerald-500" />

                              <span className="truncate">
                                {product.sellerName}
                              </span>
                            </div>
                          )}
                        </div>

                        <Link
                          href={`/dashboard/farmer/marketplace/${product._id}`}
                          className="mt-5 flex h-11 w-full items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white"
                        >
                          View Product
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}

        {/* Pagination */}
        {!loading &&
          !error &&
          totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1
                    )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
      </div>
    </div>
  );
}