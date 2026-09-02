"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Ban, RotateCcw, Trash2, AlertTriangle, X } from "lucide-react";

interface ProductItem {
  _id: string;
  title: string;
  category?: string;
  price: number;
  status: string;
}

interface IProductsResponse {
  success: boolean;
  data: ProductItem[];
}

interface IActionResponse {
  success: boolean;
}

export default function AdminMarketplacePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchProducts = () => {
    setLoading(true);
    adminService
      .getAdminProducts()
      .then((response: unknown) => {
        const res = response as IProductsResponse;
        if (res && res.success) {
          setProducts(res.data);
        }
      })
      .catch((err: unknown) => console.error("Failed to load products", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDisable = async (id: string) => {
    const response = await adminService.disableProduct(id);
    const res = response as IActionResponse;
    if (res && res.success) fetchProducts();
  };

  const handleRestore = async (id: string) => {
    const response = await adminService.restoreProduct(id);
    const res = response as IActionResponse;
    if (res && res.success) fetchProducts();
  };

  const openDeleteModal = (id: string) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmRemove = async () => {
    if (!selectedProductId) return;
    try {
      setActionLoading(true);
      const response = await adminService.removeProduct(selectedProductId);
      const res = response as IActionResponse;
      if (res && res.success) {
        setProducts((prev) => prev.filter((item) => item._id !== selectedProductId));
        setDeleteModalOpen(false);
        setSelectedProductId(null);
      }
    } catch (err) {
      console.error("Failed to remove product", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto relative">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketplace Moderation</h1>
        <p className="text-sm text-slate-500">Manage, disable, or remove marketplace listings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-medium">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading products...</td>
                </tr>
              ) : products.length > 0 ? (
                products.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{item.title}</td>
                    <td className="py-3.5 px-6 text-slate-500">{item.category || "N/A"}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-700">৳{item.price}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status?.toLowerCase() === "available" || item.status?.toLowerCase() === "active" 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {item.status ? item.status.toUpperCase() : "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      {item.status?.toUpperCase() === "DISABLED" ? (
                        <button
                          onClick={() => handleRestore(item._id)}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Restore
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDisable(item._id)}
                          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" /> Disable
                        </button>
                      )}
                      <button
                        onClick={() => openDeleteModal(item._id)}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 mx-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900">Remove Marketplace Listing</h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to remove this product? This action is permanent and cannot be undone from the platform.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirmRemove}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition flex items-center disabled:opacity-50"
              >
                {actionLoading ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}