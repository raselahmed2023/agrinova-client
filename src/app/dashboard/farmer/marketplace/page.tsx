"use client";

import { useState } from "react";
import {
  FaSlidersH,
  FaCheck,
  FaBoxOpen,
  FaUserAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

// ---------- Types ----------
interface Product {
  id: number;
  image: string;
  status: "Available" | "Sold Out";
  category: string;
  name: string;
  price: number;
  unit: string;
  availableQuantity: string;
  seller: string;
  location: string;
}

// ---------- Local Data (replace image paths with your own later) ----------
const products: Product[] = [
  {
    id: 1,
    image: "/products/brri-dhan.webp",
    status: "Available",
    category: "SEEDS",
    name: "BRRI Dhan-89 Seed",
    price: 78,
    unit: "kg",
    availableQuantity: "Available: 500 kg",
    seller: "Rahman Agro Farm",
    location: "Kushtia Sadar",
  },
  {
    id: 2,
    image: "/products/tractor-blade.jpg",
    status: "Available",
    category: "EQUIPMENT",
    name: "Rotavator Blade Set",
    price: 4500,
    unit: "set",
    availableQuantity: "Available: 12 sets",
    seller: "AgriTech Solutions",
    location: "Dhaka North",
  },
  {
    id: 3,
    image: "/products/urea-fertilizer.jpg",
    status: "Available",
    category: "FERTILIZERS",
    name: "Urea Fertilizer Bag",
    price: 1100,
    unit: "50kg bag",
    availableQuantity: "Available: 200 bags",
    seller: "Green Field Supplies",
    location: "Rangpur Sadar",
  },
  {
    id: 4,
    image: "/products/hand-hoe.jpg",
    status: "Available",
    category: "FARMING TOOLS",
    name: "Hand Hoe (Kodal)",
    price: 350,
    unit: "piece",
    availableQuantity: "Available: 80 pieces",
    seller: "Mizan Tools & Co.",
    location: "Bogura Sadar",
  },
];

// ---------- Filter categories (checkbox list) ----------
const categories = ["Seeds", "Fertilizers", "Pesticides", "Farming Tools", "Equipment"];

export default function AgriculturalMarketplace() {
  // keep track of which category checkboxes are checked
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Seeds"]);

  function toggleCategory(category: string) {
    if (selectedCategories.includes(category)) {
      // already selected -> remove it
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      // not selected yet -> add it
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  // if no checkbox is selected, show every product
  // otherwise, only show products whose category matches one of the selected checkboxes
  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedCategories.some(
            (category) => category.toLowerCase() === product.category.toLowerCase()
          )
        );

  return (
    <section className="w-full bg-[#F7F8FC] px-6 py-12 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <h1 className="text-3xl font-extrabold text-[#1A2B22] md:text-4xl">
          Agricultural Marketplace
        </h1>
        <p className="mt-2 text-[15px] text-[#6B7570]">
          Discover agricultural products, farming tools, and fresh produce from
          sellers near you.
        </p>

        {/* Main layout: filters sidebar + product grid */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          {/* ---------- Filters Sidebar ---------- */}
          <aside className="w-full shrink-0 rounded-2xl border border-black/10 bg-white p-6 lg:w-72">
            <div className="flex items-center gap-2 text-[#1A2B22]">
              <FaSlidersH className="h-4 w-4" />
              <h2 className="font-bold">Filters</h2>
            </div>

            <div className="my-6 border-t border-black/10" />

            <h3 className="font-bold text-[#1A2B22]">Categories</h3>
            <div className="mt-4 flex flex-col gap-4">
              {categories.map((category) => {
                const isChecked = selectedCategories.includes(category);
                return (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    {/* custom checkbox */}
                    <span
                      onClick={() => toggleCategory(category)}
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        isChecked
                          ? "border-[#1B3A2A] bg-[#1B3A2A]"
                          : "border-black/20 bg-white"
                      }`}
                    >
                      {isChecked && <FaCheck className="h-3 w-3 text-white" />}
                    </span>
                    <span className="text-[15px] text-[#3A443E]">{category}</span>
                  </label>
                );
              })}
            </div>
          </aside>

          {/* ---------- Product Grid ---------- */}
          <div className="flex-1">
            {/* Top bar: showing count */}
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text-[15px] text-[#3A443E]">
                Showing <span className="font-bold">{filteredProducts.length}</span>{" "}
                products
              </p>
            </div>

            {/* Product cards */}
            {filteredProducts.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-black/10 bg-white p-8 text-center text-[#6B7570]">
                No products found for the selected categories.
              </p>
            ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  {/* image + status badge */}
                  <div className="relative h-56 w-full">
                    {/* using plain img tag to keep this simple for a local data setup */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#1B3A2A] px-3 py-1 text-xs font-semibold text-white">
                      {product.status}
                    </span>
                  </div>

                  {/* card content */}
                  <div className="p-5">
                    <p className="text-xs font-semibold tracking-wide text-[#8A948E]">
                      {product.category}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#1A2B22]">
                      {product.name}
                    </h3>

                    <p className="mt-1">
                      <span className="text-2xl font-extrabold text-[#1B3A2A]">
                        {product.price.toLocaleString()}
                      </span>
                      <span className="ml-1 text-sm text-[#6B7570]">
                        {product.unit}
                      </span>
                    </p>

                    <div className="mt-4 flex flex-col gap-2 text-sm text-[#3A443E]">
                      <div className="flex items-center gap-2">
                        <FaBoxOpen className="h-3.5 w-3.5 text-[#8A948E]" />
                        <span>{product.availableQuantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUserAlt className="h-3.5 w-3.5 text-[#8A948E]" />
                        <span>{product.seller}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="h-3.5 w-3.5 text-[#8A948E]" />
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}