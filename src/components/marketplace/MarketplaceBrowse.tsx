"use client";

import { useEffect, useState } from "react";

import ProductCard from "./ProductCard";
import MarketplaceFilters from "./MarketplaceFilters";

import { MarketplaceService } from "@/services/marketplace.service";

import { IProduct } from "@/types/marketplace";

interface MarketplaceFiltersState {
  category: string;
  search: string;
  district: string;
}

export default function MarketplaceBrowse() {
  const [products, setProducts] =
    useState<IProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filters, setFilters] =
    useState<MarketplaceFiltersState>({
      category: "",
      search: "",
      district: "",
    });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await MarketplaceService.getProducts({
          category:
            filters.category || undefined,

          search:
            filters.search || undefined,

          district:
            filters.district || undefined,
        });

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err: any) {
      setProducts([]);

      setError(
        err?.message ||
          "Failed to load marketplace products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    filters.category,
    filters.search,
    filters.district,
  ]);

  return (
    <section className="min-h-screen w-full px-5 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Agricultural Marketplace
          </h1>

          <p className="mt-2 text-gray-600">
            Explore products directly from farmers
            across Bangladesh.
          </p>
        </div>

        {/* FILTERS */}

        <MarketplaceFilters
          filters={filters}
          setFilters={setFilters}
        />

        {/* LOADING */}

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-gray-100"
                />
              )
            )}
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-800">
              Unable to load products
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProducts}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🌾
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No products found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search,
                category, or district.
              </p>

              <button
                type="button"
                onClick={() =>
                  setFilters({
                    category: "",
                    search: "",
                    district: "",
                  })
                }
                className="mt-5 rounded-xl bg-[#0B513D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083c2d]"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* PRODUCTS */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {products.length}{" "}
                  {products.length === 1
                    ? "product"
                    : "products"}{" "}
                  found
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  )
                )}
              </div>
            </>
          )}
      </div>
    </section>
  );
}