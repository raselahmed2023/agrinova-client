"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Store,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import MarketplaceFilters from "./MarketplaceFilters";
import ProductCard from "./ProductCard";

import { getMarketplaceProducts } from "@/services/marketplace.service";

import type { MarketplaceProduct } from "@/types/marketplace";

export default function MarketplaceBrowse() {
  const [products, setProducts] =
    useState<MarketplaceProduct[]>([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    totalProducts,
    setTotalProducts,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const timeout =
      setTimeout(async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getMarketplaceProducts({
              page,
              limit: 8,
              search,
              category,
              sort,
            });

          setProducts(
            result.data || []
          );

          setTotalPages(
            result.meta?.totalPages ||
              1
          );

          setTotalProducts(
            result.meta?.total || 0
          );
        } catch (err) {
          setProducts([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load products."
          );
        } finally {
          setLoading(false);
        }
      }, 300);

    return () =>
      clearTimeout(timeout);
  }, [
    search,
    category,
    sort,
    page,
  ]);

  const changeSearch = (
    value: string
  ) => {
    setPage(1);
    setSearch(value);
  };

  const changeCategory = (
    value: string
  ) => {
    setPage(1);
    setCategory(value);
  };

  const changeSort = (
    value: string
  ) => {
    setPage(1);
    setSort(value);
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              Farmer Marketplace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Browse Marketplace
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover products from
              farmers and agricultural
              sellers.
            </p>
          </div>

          <Link
            href="/dashboard/farmer/marketplace/sell"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <Store className="h-4 w-4" />
            Sell Product
          </Link>
        </div>

        <MarketplaceFilters
          search={search}
          category={category}
          sort={sort}
          onSearchChange={
            changeSearch
          }
          onCategoryChange={
            changeCategory
          }
          onSortChange={changeSort}
        />

        <div className="my-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">
              {totalProducts}
            </span>{" "}
            products found
          </p>

          {category !== "all" && (
            <button
              type="button"
              onClick={() =>
                changeCategory("all")
              }
              className="text-sm font-semibold text-emerald-600"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading marketplace...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              Could not load
              marketplace
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Package className="mx-auto h-11 w-11 text-slate-300" />

            <h2 className="mt-4 font-bold text-slate-800">
              No products found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search
              or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map(
              (product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              )
            )}
          </div>
        )}

        {!loading &&
          !error &&
          totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((value) =>
                    Math.max(
                      1,
                      value - 1
                    )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                Page {page} of{" "}
                {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage((value) =>
                    Math.min(
                      totalPages,
                      value + 1
                    )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
      </div>
    </div>
  );
}