"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Edit3,
  Loader2,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Store,
  Trash2,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  images?: string[];
  sellerName?: string;
  sellerEmail?: string;
  sellerContact?: string;
  location?: string;
  status?: string;
  isFeatured?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

const categories = [
  "crops",
  "seeds",
  "fertilizers",
  "equipment",
];

const units = [
  "kg",
  "piece",
  "bag",
  "ton",
  "liter",
];

export default function MyListingsPage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const sellerEmail =
    session?.user?.email || "";

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    editingProduct,
    setEditingProduct,
  ] = useState<Product | null>(null);

  const [
    deletingProduct,
    setDeletingProduct,
  ] = useState<Product | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const fetchListings =
    useCallback(async () => {
      if (sessionLoading) {
        return;
      }

      if (!sellerEmail) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication required.");
        }

        const response =
          await fetch(
            `${API_URL}/marketplace/my-listings`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${tokenData.token}`,
              },
              cache: "no-store",
            }
          );

        const result: ApiResponse =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load listings."
          );
        }

        setProducts(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }, [
      API_URL,
      sellerEmail,
      sessionLoading,
    ]);

  useEffect(() => {
    if (!sessionLoading) {
      fetchListings();
    }
  }, [
    fetchListings,
    sessionLoading,
  ]);

  const handleUpdate =
    async () => {
      if (!editingProduct) {
        return;
      }

      if (!sellerEmail) {
        setError(
          "Please login to update your listing."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication required.");
        }

        const response =
          await fetch(
            `${API_URL}/marketplace/products/${editingProduct._id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenData.token}`,
              },
              body: JSON.stringify({
                title:
                  editingProduct.title.trim(),

                description:
                  editingProduct.description.trim(),

                price: Number(
                  editingProduct.price
                ),

                category:
                  editingProduct.category,

                quantity: Number(
                  editingProduct.quantity
                ),

                unit:
                  editingProduct.unit,

                location:
                  editingProduct.location,

                sellerContact:
                  editingProduct.sellerContact,

                status:
                  editingProduct.status,
              }),
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to update product."
          );
        }

        setEditingProduct(null);

        await fetchListings();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update product."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleDelete =
    async () => {
      if (!deletingProduct) {
        return;
      }

      if (!sellerEmail) {
        setError(
          "Please login to delete your listing."
        );
        return;
      }

      try {
        setDeleting(true);
        setError("");

        if (!API_URL) {
          throw new Error(
            "NEXT_PUBLIC_API_URL is not configured."
          );
        }

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Authentication required.");
        }

        const response =
          await fetch(
            `${API_URL}/marketplace/products/${deletingProduct._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${tokenData.token}`,
              },
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to delete product."
          );
        }

        setDeletingProduct(null);

        await fetchListings();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete product."
        );
      } finally {
        setDeleting(false);
      }
    };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#f7f9f8]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-lg font-bold text-amber-800">
              Login Required
            </h2>

            <p className="mt-2 text-sm text-amber-700">
              Please login to manage your marketplace listings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f7f9f8] px-5 py-7 lg:px-8">
        <div className="mx-auto max-w-[1380px]">
          {/* Header */}
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Farmer Marketplace
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                My Listings
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage products you have
                published in the marketplace.
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Logged in as{" "}
                <span className="font-semibold text-slate-600">
                  {session.user.email}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={
                  fetchListings
                }
                className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                href="/dashboard/farmer/marketplace/sell"
                className="flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading your listings...
                </p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Package className="h-12 w-12 text-slate-300" />

              <h2 className="mt-4 text-xl font-bold text-slate-800">
                No listings yet
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Publish your first agricultural
                product to start selling in the
                marketplace.
              </p>

              <Link
                href="/dashboard/farmer/marketplace/sell"
                className="mt-5 flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Sell Product
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map(
                (product) => {
                  const image =
                    product.images?.[0];

                  return (
                    <article
                      key={
                        product._id
                      }
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="relative h-48 bg-slate-100">
                        {image ? (
                          <Image
                            src={image}
                            alt={
                              product.title
                            }
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-12 w-12 text-slate-300" />
                          </div>
                        )}

                        <span
                          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                            product.status ===
                            "available"
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-700 text-white"
                          }`}
                        >
                          {product.status ||
                            "available"}
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                              {
                                product.category
                              }
                            </p>

                            <h2 className="mt-1 truncate text-lg font-bold text-slate-900">
                              {
                                product.title
                              }
                            </h2>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-lg font-extrabold text-emerald-600">
                              ৳
                              {product.price.toLocaleString()}
                            </p>

                            <p className="text-xs text-slate-400">
                              /{" "}
                              {
                                product.unit
                              }
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                          {
                            product.description
                          }
                        </p>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                              Stock
                            </span>

                            <span className="font-semibold text-slate-800">
                              {
                                product.quantity
                              }{" "}
                              {
                                product.unit
                              }
                            </span>
                          </div>

                          {product.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4 text-emerald-600" />

                              <span className="truncate">
                                {
                                  product.location
                                }
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Store className="h-4 w-4 text-emerald-600" />

                            <span>
                              Your listing
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProduct({
                                ...product,
                              })
                            }
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeletingProduct(
                                product
                              )
                            }
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update listing information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingProduct(
                    null
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Product Title
                </label>

                <input
                  value={
                    editingProduct.title
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      title:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={
                    editingProduct.description
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description:
                        e.target.value,
                    })
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={
                    editingProduct.category
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {
                          category
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={
                    editingProduct.status ||
                    "available"
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      status:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="out_of_stock">
                    Out of Stock
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  min={1}
                  value={
                    editingProduct.price
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    editingProduct.quantity
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      quantity: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Unit
                </label>

                <select
                  value={
                    editingProduct.unit
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      unit:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
                >
                  {units.map(
                    (unit) => (
                      <option
                        key={unit}
                        value={unit}
                      >
                        {unit}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Number
                </label>

                <input
                  value={
                    editingProduct.sellerContact ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      sellerContact:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  value={
                    editingProduct.location ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      location:
                        e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
              <button
                type="button"
                onClick={() =>
                  setEditingProduct(
                    null
                  )
                }
                disabled={saving}
                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleUpdate
                }
                disabled={saving}
                className="flex h-11 min-w-32 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Delete listing?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You are about to delete{" "}
              <span className="font-semibold text-slate-700">
                {
                  deletingProduct.title
                }
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={() =>
                  setDeletingProduct(
                    null
                  )
                }
                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  deleting
                }
                onClick={
                  handleDelete
                }
                className="flex h-11 min-w-28 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}