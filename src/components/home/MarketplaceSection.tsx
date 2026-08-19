import React from "react";
import Image from "next/image";
import { products } from "../../data/mockData";

export default function MarketplaceSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-12 px-4 md:px-8 bg-white dark:bg-black rounded-3xl my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#143B2E] dark:text-emerald-400 mb-1">Local Marketplace</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Quality inputs and direct sales opportunities.</p>
        </div>
        <button className="px-6 py-2 bg-white text-sm font-medium text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 transition-colors">
          Explore Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-48 w-full overflow-hidden relative">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-gray-800 dark:text-zinc-200 text-sm mb-1 line-clamp-1">{product.name}</h3>
              <p className="font-bold text-gray-900 dark:text-white mb-2">{product.price}</p>
              
              <div className="flex items-center text-gray-500 dark:text-zinc-400 text-xs mb-4 mt-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {product.location}
              </div>
              
              <button className="w-full py-2 bg-[#E6F0FF] text-[#1E5FDB] font-medium text-xs rounded-md hover:bg-[#d6e5ff] transition-colors dark:bg-blue-900/30 dark:text-blue-400">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
