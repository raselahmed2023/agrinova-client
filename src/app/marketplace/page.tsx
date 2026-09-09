"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Grid2X2,
  Leaf,
  ShieldCheck,
  Users,
  Plus,
  List,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

import ProductCard from "@/components/marketplace/ProductCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";

import { MarketplaceService } from "@/services/marketplace.service";

import type { IProduct } from "@/types/marketplace";

export default function MarketplacePage() {
  const { data: session, isPending: sessionLoading } = useSession();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    search: "",
    district: "",
  });

  const isFarmer =
    session?.user?.role?.toUpperCase() === "FARMER";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await MarketplaceService.getProducts(filters);

        /*
          Only approved products should appear
          in the public marketplace.
        */
        const approvedProducts = data.filter(
          (product) =>
            product.status === "APPROVED"
        );

        setProducts(approvedProducts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load marketplace products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.category,
    filters.search,
    filters.district,
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f8f2]">
      {/* Soft agricultural background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="absolute right-[-120px] top-[-80px] h-96 w-96 rounded-full bg-lime-100/40 blur-3xl" />

        <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[650px] rounded-full bg-green-100/50 blur-3xl" />

        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#e7f0df]/60 to-transparent" />
      </div>

      {/* Content */}

      <div className="relative mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
        {/* Header */}

        <section className="mb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[#0B513D]" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B513D]">
                  AgriNova Marketplace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Fresh Products,
                <span className="text-[#0B513D]">
                  {" "}
                  Directly from Farmers
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Discover quality agricultural products
                from farmers and local sellers across
                Bangladesh.
              </p>

              {/* Trust points */}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-[#0B513D]" />
                  Fresh Products
                </div>

                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#0B513D]" />
                  Trusted Farmers
                </div>

                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#0B513D]" />
                  Local Community
                </div>
              </div>
            </div>

            {/* Farmer actions */}

            {!sessionLoading && isFarmer && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/marketplace/sell"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B513D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#083c2d]"
                >
                  <Plus className="h-4 w-4" />
                  Sell Product
                </Link>

                <Link
                  href="/marketplace/listings"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0B513D]/30 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0B513D] shadow-sm transition hover:bg-[#EAF4ED]"
                >
                  <List className="h-4 w-4" />
                  My Listings
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Filters */}

        <section className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_8px_30px_rgba(20,59,46,0.08)] backdrop-blur md:p-4">
          <MarketplaceFilters
            filters={filters}
            setFilters={setFilters}
          />
        </section>

        {/* Results header */}

        {!loading && !error && (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {products.length}{" "}
                {products.length === 1
                  ? "product"
                  : "products"}{" "}
                available
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing approved marketplace products
              </p>
            </div>
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-[390px] animate-pulse rounded-2xl border border-white bg-white/80"
                />
              )
            )}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white bg-white/90 px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4ED]">
                <Leaf className="h-7 w-7 text-[#0B513D]" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No products found
              </h2>

              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
                Try changing your search or category.
                New products will appear here after
                they are approved.
              </p>
            </div>
          )}

        {/* Products */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
}