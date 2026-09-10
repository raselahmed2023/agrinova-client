
"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Package,
  Plus,
  Search,
  ShoppingCart,
} from "lucide-react";

import ProductCard from "@/components/marketplace/ProductCard";

import { MarketplaceService } from "@/services/marketplace.service";

import type { IProduct } from "@/types/marketplace";

import { useCart } from "@/context/CartContext";

import { useSearchParams } from "next/navigation";

import { useSession } from "@/lib/auth-client";

const categories = [
  {
    value: "",
    label: "All Categories",
  },
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
    label: "Farm Foods",
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await MarketplaceService.getProducts({
          search,
          category,
          page: 1,
          limit: 24,
          sort: "newest",
        });

      setProducts(
        Array.isArray(response)
          ? response
          : response?.data || []
      );
    } catch (err) {
      setProducts([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load marketplace products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/marketplace-bg.jpg')",
            animation:
              "marketplaceBg 24s ease-in-out infinite alternate",
          }}
        />

        <div className="absolute inset-0 bg-[#f5f8f2]/90" />

        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#f5f8f2]/85 to-[#f5f8f2]/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              AgriNova Marketplace
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Buy & Sell Agricultural Products
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Discover quality agricultural products
              directly from farmers across Bangladesh.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ShoppingCart className="h-4 w-4" />

              Cart

              {totalItems > 0 && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {isFarmer && (
              <Link
                href="/marketplace/sell"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Sell Product
              </Link>
            )}
          </div>
        </div>

        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-900/5 backdrop-blur">
            <div className="grid gap-3 md:grid-cols-[1fr_240px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search product name..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
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
                    className="h-[430px] animate-pulse rounded-2xl bg-white/80 shadow-sm"
                  />
                )
              )}
            </div>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p>{error}</p>

              <button
                type="button"
                onClick={loadProducts}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/95 p-14 text-center shadow-sm">
                <Package className="mx-auto h-10 w-10 text-slate-300" />

                <h2 className="mt-4 font-bold text-slate-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try another product name or category.
                </p>

                {(search || category) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("");
                    }}
                    className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
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
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {products.length}{" "}
                    {products.length === 1
                      ? "product"
                      : "products"}{" "}
                    found
                  </p>
                </div>

                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            transform: scale(1.06);
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

