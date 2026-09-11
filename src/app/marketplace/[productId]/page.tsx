"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import ProductDetails from "@/components/marketplace/ProductDetails";

import ManageProductForm from "@/components/marketplace/ManageProductForm";

import {
  MarketplaceService,
} from "@/services/marketplace.service";

import type {
  IProduct,
} from "@/types/marketplace";

export default function MarketplaceProductPage() {
  const params =
    useParams<{
      productId: string;
    }>();

  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const [product, setProduct] =
    useState<IProduct | null>(
      null
    );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const editing =
    searchParams.get(
      "edit"
    ) === "1";

  useEffect(() => {
    if (!params.productId) {
      return;
    }

    const load =
      async () => {
        try {
          setLoading(true);
          setError("");

          const item =
            await MarketplaceService.getProductById(
              params.productId
            );

          setProduct(item);
        } catch (err) {
          try {
            const response =
              await MarketplaceService.getMyProducts(
                {
                  page: 1,
                  limit: 50,
                }
              );

            const own =
              response.data.find(
                (item) =>
                  item._id ===
                  params.productId
              );

            if (!own) {
              throw new Error(
                "Product not found."
              );
            }

            setProduct(own);
          } catch (innerError) {
            setError(
              innerError instanceof
                Error
                ? innerError.message
                : err instanceof
                    Error
                  ? err.message
                  : "Unable to load product."
            );
          }
        } finally {
          setLoading(false);
        }
      };

    load();
  }, [
    params.productId,
  ]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center text-slate-500">
        Loading product...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-center text-red-600">
        {error ||
          "Product not found."}
      </main>
    );
  }

  if (editing) {
    return (
      <ManageProductForm
        product={product}
        onSaved={(updated) => {
          setProduct(updated);

          router.replace(
            `/marketplace/${updated._id}`
          );
        }}
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