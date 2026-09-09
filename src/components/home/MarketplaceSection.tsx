"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { products } from "../../data/mockData";

export default function MarketplaceSection() {
  return (
    <section className="mx-auto my-8 w-full max-w-7xl rounded-3xl bg-white px-4 py-12 md:px-8 dark:bg-black">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h2 className="mb-1 text-2xl font-bold text-[#143B2E] dark:text-emerald-400">
            Local Marketplace
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quality inputs and direct sales opportunities.
          </p>
        </div>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Explore Marketplace
        </motion.button>
      </motion.div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -6,
              transition: { duration: 0.25 },
            }}
            className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* Product Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-800 dark:text-zinc-200">
                {product.name}
              </h3>

              <p className="mb-2 font-bold text-gray-900 dark:text-white">
                {product.price}
              </p>

              {/* Location */}
              <div className="mt-auto mb-4 flex items-center text-xs text-gray-500 dark:text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>

                {product.location}
              </div>

              {/* View Details */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full rounded-md bg-[#E6F0FF] py-2 text-xs font-medium text-[#1E5FDB] transition-colors duration-300 hover:bg-[#d6e5ff] dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}