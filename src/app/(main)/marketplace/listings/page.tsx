"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Package,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { MarketplaceService } from "@/services/marketplace.service";
import { useSession } from "@/lib/auth-client";
import type { IProduct } from "@/types/marketplace";
import MarketplaceBackground from "@/components/marketplace/MarketplaceBackground";

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  available: {
    label: "Available",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  out_of_stock: {
    label: "Out of Stock",
    className:
      "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  },
  disabled: {
    label: "Disabled",
    className:
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

export default function MyListingsPage() {
  const { data: session, isPending: sessionLoading } =
    useSession();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await MarketplaceService.getMyProducts({
          page: 1,
          limit: 100,
        });

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setProducts(data);
    } catch (err) {
      console.error(
        "Failed to load my listings:",
        err
      );

      setProducts([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading) {
      loadListings();
    }
  }, [sessionLoading, loadListings]);

  const handleDelete = async (
    product: IProduct
  ) => {
    const confirmed = window.confirm(
      `Delete "${product.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await MarketplaceService.deleteProduct(
        product._id
      );

      setProducts((current) =>
        current.filter(
          (item) => item._id !== product._id
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to delete product."
      );
    }
  };

  if (
    !sessionLoading &&
    !session?.user
  ) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please login to view your listings.
          </p>

          <Link
            href="/login?redirect=/marketplace/listings"
            className="mt-5 inline-flex rounded-xl bg-[#0B513D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083f30]"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <MarketplaceBackground>
      <main className="min-h-screen bg-[#f5f8f2]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/marketplace"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0B513D]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8E9DA] text-[#0B513D]">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Manage Products
                </h1>

                <p className="text-sm text-slate-500">
                  Manage your marketplace listings
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadListings}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <Link
              href="/marketplace/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B513D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#083f30]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Total"
            value={products.length}
          />

          <StatCard
            label="Pending"
            value={
              products.filter(
                (p) => p.status === "pending"
              ).length
            }
          />

          <StatCard
            label="Available"
            value={
              products.filter(
                (p) => p.status === "available"
              ).length
            }
          />

          <StatCard
            label="Other"
            value={
              products.filter(
                (p) =>
                  p.status !== "pending" &&
                  p.status !== "available"
              ).length
            }
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">
              Unable to load listings
            </p>

            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              )
            )}
          </div>
        ) : products.length === 0 ? (
          /* Empty */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-6 w-6 text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No products listed yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't added any products to the
              marketplace yet.
            </p>

            <Link
              href="/marketplace/sell"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B513D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083f30]"
            >
              <Plus className="h-4 w-4" />
              List a Product
            </Link>
          </div>
        ) : (
          /* Products */
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const status =
                statusConfig[
                  String(product.status)
                ] || {
                  label: String(product.status),
                  className:
                    "bg-slate-100 text-slate-600",
                };

              return (
                <div
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-slate-100">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-slate-900">
                          {product.title}
                        </h2>

                        <p className="mt-1 text-xs capitalize text-slate-500">
                          {String(
                            product.category
                          ).replace(
                            /_/g,
                            " "
                          )}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-bold text-[#0B513D]">
                          {product.transactionType ===
                          "free"
                            ? "Free"
                            : `৳${Number(
                                product.price || 0
                              ).toLocaleString()}`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <p className="text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 font-semibold text-slate-700">
                          {product.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">
                          Type
                        </p>

                        <p className="mt-1 font-semibold capitalize text-slate-700">
                          {String(
                            product.transactionType ||
                              "sale"
                          ).replace(
                            /_/g,
                            " "
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/marketplace/${product._id}?edit=1`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product)
                        }
                        className="flex items-center justify-center rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
    </MarketplaceBackground>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}