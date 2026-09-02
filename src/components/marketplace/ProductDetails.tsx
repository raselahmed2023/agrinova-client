"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Store,
  User,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import PurchaseRequestModal from "./PurchaseRequestModal";

import { authClient } from "@/lib/auth-client";

import { getMarketplaceProduct } from "@/services/marketplace.service";

import type { MarketplaceProduct } from "@/types/marketplace";

interface ProductDetailsProps {
  productId: string;
}

const formatCategory = (
  category: string
) =>
  category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

export default function ProductDetails({
  productId,
}: ProductDetailsProps) {
  const { data: session } = authClient.useSession();
  const [product, setProduct] =
    useState<MarketplaceProduct | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [requestOpen, setRequestOpen] =
    useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getMarketplaceProduct(
            productId
          );

        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <Package className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-bold text-red-700">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/dashboard/farmer/marketplace"
            className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const image =
    product.images?.[0];

  const isAvailable =
    product.status ===
      "available" &&
    product.quantity > 0;

  const isOwnProduct =
    Boolean(
      session?.user?.email &&
        product.sellerEmail &&
        session.user.email
          .trim()
          .toLowerCase() ===
          product.sellerEmail
            .trim()
            .toLowerCase()
    );

  return (
    <>
      <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <Link
            href="/dashboard/farmer/marketplace"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>

          <div className="grid gap-7 lg:grid-cols-2">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative min-h-[420px]">
                {image ? (
                  <Image
                    src={image}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-[500px] items-center justify-center bg-slate-100">
                    <Package className="h-16 w-16 text-slate-300" />
                  </div>
                )}

                {product.isFeatured && (
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {formatCategory(
                    product.category
                  )}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isAvailable
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isAvailable
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
                {product.title}
              </h1>

              <div className="mt-5 flex items-end gap-2">
                <span className="text-3xl font-extrabold text-emerald-600">
                  ৳
                  {product.price.toLocaleString()}
                </span>

                <span className="pb-1 text-sm text-slate-500">
                  / {product.unit}
                </span>
              </div>

              <p className="mt-6 leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-7 grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Available Quantity
                    </p>

                    <p className="font-semibold text-slate-800">
                      {product.quantity}{" "}
                      {product.unit}
                    </p>
                  </div>
                </div>

                {product.location && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Location
                      </p>

                      <p className="font-semibold text-slate-800">
                        {product.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="mb-4 text-sm font-bold text-slate-900">
                  Seller Information
                </p>

                <div className="space-y-3">
                  {product.sellerName && (
                    <div className="flex items-center gap-3 text-sm">
                      <Store className="h-4 w-4 text-emerald-600" />

                      <span className="text-slate-500">
                        Seller:
                      </span>

                      <span className="font-semibold text-slate-800">
                        {product.sellerName}
                      </span>
                    </div>
                  )}

                  {product.sellerContact && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-emerald-600" />

                      <span className="text-slate-500">
                        Contact:
                      </span>

                      <span className="font-semibold text-slate-800">
                        {
                          product.sellerContact
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={!isAvailable || isOwnProduct}
                onClick={() =>
                  setRequestOpen(true)
                }
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <ShoppingBag className="h-5 w-5" />

                {isOwnProduct
                  ? "Your Own Listing"
                  : isAvailable
                    ? "Send Purchase Request"
                    : "Product Unavailable"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                No online payment. Seller
                reviews your request first.
              </p>
            </section>
          </div>
        </div>
      </div>

      <PurchaseRequestModal
        product={product}
        open={requestOpen}
        onClose={() =>
          setRequestOpen(false)
        }
      />
    </>
  );
}