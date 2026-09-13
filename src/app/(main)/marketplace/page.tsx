"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import ProductCard from "@/components/marketplace/ProductCard";
import { MarketplaceService } from "@/services/marketplace.service";
import type { IProduct } from "@/types/marketplace";
import { useCart } from "@/context/CartContext";

const categories = [
  { value: "", label: "All Categories" },
  { value: "crops", label: "Crops" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "pesticides", label: "Pesticides" },
  { value: "equipment", label: "Equipment" },
  { value: "poultry", label: "Poultry" },
  { value: "farm_foods", label: "Farm Foods" },
  { value: "by_products", label: "By Products" },
  { value: "other", label: "Other" },
];

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f8f2]">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm" aria-label="Loading marketplace">
              <span className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />
            </div>
          </div>
        </main>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}

function MarketplaceContent() {
  const searchParams = useSearchParams();

  const { data: session } = useSession();
  const { totalItems } = useCart();

  const isFarmer =
    session?.user?.role?.toUpperCase() === "FARMER";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [district, setDistrict] = useState(
    searchParams.get("district") || ""
  );
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await MarketplaceService.getProductsPage({
          search: search.trim(),
          category,
          district: district.trim(),
          page,
          limit: 20,
          sort,
        });

      setProducts(response.data);
      setTotal(response.meta.total);
      setTotalPages(Math.max(response.meta.totalPages, 1));
    } catch (err) {
      console.error(
        "Marketplace products failed:",
        err
      );

      setProducts([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load marketplace products."
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, district, page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadProducts]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDistrict("");
    setSort("newest");
    setPage(1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
     

      <div className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/marketplace-bg.jpg')",
            animation:
              "marketplaceBg 45s ease-in-out infinite alternate",
          }}
        />

        {/* Much lighter overlay so background remains visible */}
        <div className="absolute inset-0 bg-white/15" />

        {/* Soft readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-[#f5f8f2]/15 to-[#f5f8f2]/25" />
      </div>

      

      <div className="relative mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-4 lg:px-5 lg:py-8">
        



        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/70 bg-white/55 shadow-xl shadow-slate-900/10 backdrop-blur-md">
          {/* Soft decorative accents */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

          <div className="relative p-6 sm:p-8 lg:p-9">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  AgriNova Marketplace
                </div>

                <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-xl xl:text-[1.4rem]">
                  Buy & Sell{" "}
                  <span className="text-emerald-700">
                    Agricultural Products
                  </span>
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                  A trusted marketplace where farmers and buyers can
                  <span className="font-semibold text-slate-800">
                    {" "}buy and sell agricultural products
                  </span>
                  {" "}directly across Bangladesh.
                </p>

                <div className="mt-6">
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    Available on the marketplace
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Crops",
                      "Seeds",
                      "Fertilizers",
                      "Pesticides",
                      "Equipment",
                      "Poultry",
                      "Farm Foods",
                      "By Products",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-bold text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3 xl:justify-end">
                <Link
                  href="/cart"
                  className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>View Cart</span>

                  {totalItems > 0 && (
                    <span className="flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {totalItems > 99
                        ? "99+"
                        : totalItems}
                    </span>
                  )}
                </Link>

                {isFarmer && (
                  <Link
                    href="/marketplace/listings"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/95 px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md"
                  >
                    <Package className="h-4 w-4" />
                    Manage Listings
                  </Link>
                )}

                {isFarmer && (
                  <Link
                    href="/marketplace/sell"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Sell a Product
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

      

        <section className="mt-0">
          <div className="rounded-2xl border border-white/70 bg-white/85 p-3 shadow-lg shadow-slate-900/5 backdrop-blur-md">
            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_190px_190px_190px]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search products..."
                  aria-label="Search marketplace products"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by category"
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                {categories.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <input
                value={district}
                onChange={(event) => {
                  setDistrict(event.target.value);
                  setPage(1);
                }}
                placeholder="District"
                aria-label="Filter by district"
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                aria-label="Sort marketplace products"
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {(search || category || district || sort !== "newest") && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

         

          {loading && (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 10 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[380px] animate-pulse rounded-2xl border border-white/60 bg-white/75 shadow-sm"
                  />
                )
              )}
            </div>
          )}

          

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/95 p-6 shadow-sm">
              <h2 className="font-bold text-red-800">
                Unable to load marketplace
              </h2>

              <p className="mt-2 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

         

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/95 p-14 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <Package className="h-7 w-7 text-emerald-600" />
                </div>

                <h2 className="mt-5 text-lg font-bold text-slate-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try another product name or category.
                </p>

                {(search || category || district) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

          

          {!loading &&
            !error &&
            products.length > 0 && (
              <>
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-slate-600 backdrop-blur-sm">
                  <span>
                    <strong className="text-slate-900">{total}</strong>{" "}
                    {total === 1 ? "product" : "products"} found
                  </span>
                  <span>Page {page} of {totalPages}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.max(current - 1, 1))}
                      disabled={page <= 1}
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                      disabled={page >= totalPages}
                      className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
        </section>
      </div>

     

      <style jsx global>{`
        @keyframes marketplaceBg {
          0% {
            transform: scale(1);
          }

          100% {
            transform: scale(1.05);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}