"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import ProductDetails from "@/components/marketplace/ProductDetails";
import ManageProductForm from "@/components/marketplace/ManageProductForm";
import { MarketplaceService } from "@/services/marketplace.service";
import type { IProduct } from "@/types/marketplace";

export default function ProductPageClient({ productId }: { productId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const editing = searchParams.get("edit") === "1";

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const item = editing
          ? await MarketplaceService.getMyProductById(
              productId
            )
          : await MarketplaceService.getProductById(
              productId
            );

        setProduct(item);
      } catch (err) {
        setProduct(null);
        setError(
          err instanceof Error
            ? err.message
            : editing
              ? "Unable to load this listing for editing."
              : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editing, productId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-16">
        <div className="mx-auto flex min-h-[420px] max-w-5xl items-center justify-center">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" aria-label="Loading product" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f5f8f2] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            {editing ? "Unable to edit listing" : "Product not found"}
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error || "Product not found."}
          </p>
          <button
            type="button"
            onClick={() =>
              router.push(
                editing
                  ? "/marketplace/listings"
                  : "/marketplace"
              )
            }
            className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (editing) {
    return (
      <ManageProductForm
        product={product}
        onSaved={(updated) => {
          setProduct(updated);
          router.replace("/marketplace/listings");
          router.refresh();
        }}
        onCancel={() => router.push("/marketplace/listings")}
      />
    );
  }

  return (
    <ProductDetails
      product={product}
      backHref="/marketplace"
    />
  );
}