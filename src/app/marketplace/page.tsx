"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";

import {
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
            <div className="rounded-2xl bg-white px-8 py-6 text-sm text-slate-500 shadow-sm">
              Loading marketplace...
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await MarketplaceService.getProducts({
          search: search.trim(),
          category,
          page: 1,
          limit: 24,
          sort: "newest",
        });

      const productList = Array.isArray(response)
        ? response
        : response?.data || [];

      setProducts(productList);
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
  }, [search, category]);

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
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/marketplace-bg.jpg')",
            animation:
              "marketplaceBg 30s ease-in-out infinite alternate",
          }}
        />

        {/* Much lighter overlay so background remains visible */}
        <div className="absolute inset-0 bg-white/65" />

        {/* Soft readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-[#f5f8f2]/70 to-[#f5f8f2]/90" />
      </div>

      

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* =======================================================
            HERO
        ======================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-md md:p-8 lg:p-10">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                AgriNova Marketplace
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Buy & Sell
                <span className="block text-emerald-700">
                  Agricultural Products
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Discover quality agricultural products
                directly from farmers and sellers across
                Bangladesh.
              </p>
            </div>

    

            <div className="flex flex-wrap gap-3">
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 hover:shadow-md"
              >
                <ShoppingCart className="h-4 w-4" />

                <span>Cart</span>

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
                  href="/marketplace/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  Sell Product
                </Link>
              )}
            </div>
          </div>
        </section>

      

        <section className="mt-7">
          <div className="rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-md">
            <div className="grid gap-3 md:grid-cols-[1fr_240px]">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  aria-label="Search marketplace products"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
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
            </div>
          </div>

         

          {loading && (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[430px] animate-pulse rounded-2xl border border-white/60 bg-white/75 shadow-sm"
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

                {(search || category) && (
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
                <div className="mt-7 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Marketplace Products
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {products.length}{" "}
                      {products.length === 1
                        ? "product"
                        : "products"}{" "}
                      found
                    </p>
                  </div>

                  {(search || category) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}
                </div>
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