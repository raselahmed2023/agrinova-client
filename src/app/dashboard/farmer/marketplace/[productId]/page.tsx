"use client";

import { useParams } from "next/navigation";

import ProductDetails from "@/components/marketplace/ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams();

  return (
    <ProductDetails
      productId={String(
        params.productId
      )}
    />
  );
}