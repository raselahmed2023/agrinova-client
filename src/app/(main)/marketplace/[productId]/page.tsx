import type { Metadata } from "next";
import { Suspense } from "react";

import ProductPageClient from "@/components/marketplace/ProductPageClient";
import type { IProduct } from "@/types/marketplace";

type Props = {
  params: Promise<{ productId: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/$/, "");

async function getProductForSeo(productId: string): Promise<IProduct | null> {
  try {
    const response = await fetch(
      `${API_URL}/marketplace/products/${encodeURIComponent(productId)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;
    const result = (await response.json()) as {
      success?: boolean;
      data?: IProduct;
    };
    return result.success && result.data ? result.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductForSeo(productId);

  if (!product) {
    return {
      title: "Marketplace Product",
      description: "View agricultural products on the AgriNova marketplace.",
      robots: { index: false, follow: true },
    };
  }

  const description = product.description.slice(0, 155);
  const canonical = `/marketplace/${product._id}`;

  return {
    title: `${product.title} | Marketplace`,
    description,
    keywords: [
      product.title,
      product.category.replaceAll("_", " "),
      product.district || "Bangladesh",
      "AgriNova marketplace",
      "farm products",
    ],
    alternates: { canonical },
    openGraph: {
      title: `${product.title} | Marketplace`,
      description,
      url: canonical,
      siteName: "AgriNova",
      type: "website",
      images: product.images?.[0]
        ? [{ url: product.images[0], alt: product.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Marketplace`,
      description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function MarketplaceProductPage({ params }: Props) {
  const { productId } = await params;
  const product = await getProductForSeo(productId);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.images || [],
        category: product.category.replaceAll("_", " "),
        offers: {
          "@type": "Offer",
          priceCurrency: "BDT",
          price: product.transactionType === "free" ? 0 : product.price,
          availability:
            product.status === "available" && product.quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/marketplace/${product._id}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<main className="min-h-screen bg-[#f5f8f2] px-4 py-16"><div className="mx-auto flex min-h-[420px] max-w-5xl items-center justify-center"><span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" aria-label="Loading product" /></div></main>}>
        <ProductPageClient productId={productId} />
      </Suspense>
    </>
  );
}