"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Package } from "lucide-react";

import { MarketplaceService } from "@/services/marketplace.service";
import type { IProduct } from "@/types/marketplace";

function formatMoney(product: IProduct) {
  if (product.transactionType === "free") return "Free";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(product.price || 0));
}

export default function MarketplaceSection() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    MarketplaceService.getProducts({
      page: 1,
      limit: 4,
      sort: "newest",
    })
      .then((result) => {
        if (active) setProducts(result);
      })
      .catch((error) => {
        console.error("Failed to load homepage marketplace:", error);
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto my-8 w-full max-w-6xl rounded-3xl bg-white px-4 py-12 md:px-8 dark:bg-black">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Farmer marketplace
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#143B2E] dark:text-emerald-400">
            Fresh listings from local sellers
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse admin-approved products available through AgriNova.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Explore marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-900" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-zinc-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Package className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
            No approved products yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            New products will appear here after marketplace approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product._id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <Link href={`/marketplace/${product._id}`} className="block">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <Package className="h-10 w-10" />
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex min-h-44 flex-col p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  {String(product.category).replaceAll("_", " ")}
                </p>
                <Link href={`/marketplace/${product._id}`}>
                  <h3 className="mt-1 line-clamp-1 text-sm font-bold text-gray-900 transition group-hover:text-emerald-800 dark:text-zinc-100 dark:group-hover:text-emerald-300">
                    {product.title}
                  </h3>
                </Link>
                <p className="mt-2 font-bold text-gray-950 dark:text-white">
                  {formatMoney(product)}
                  {product.transactionType !== "free" && product.unit ? (
                    <span className="text-xs font-medium text-gray-400"> / {product.unit}</span>
                  ) : null}
                </p>

                <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-gray-500 dark:text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">
                    {product.district || product.location || "Bangladesh"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}